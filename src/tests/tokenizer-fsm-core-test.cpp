#include "../compiler/tokenizer/tokenizer-core/cpp/FSM.cpp"

#include <iostream>
#include <fstream>
#include <cassert>
#include <ctime>
#include <cctype>
#include <cstdlib>
#include <vector>
#include <regex>
#define FSM_0_STANDARD_FILENAME "../compiler/tokenizer/finite-state-machine-maker/output/FSM-edge-list.txt"

bool test_fsm_one_character_symbols_only(const rainscript::FSM& fsm) {
    for (int i = 0; i < fsm.n_symbols; ++i)
        if (fsm.symbols[i].size() != 1)
            return false;
    return true;
}

bool test_tokenize_1_remove_comments(std::string& program, const std::string& output_filename) {
    static std::regex r_comments("//[^\n]*|/\\*(\\*(?!/)|[^\\*])*\\*/");
    program = std::regex_replace(program, r_comments, "");
    std::ofstream(("output/" + output_filename + "_test_tokenize_1_remove_comments.txt").c_str())
        << program << std::flush;
    return true;
}

bool test_tokenize_2_collapse_whitespace(std::string& program, const std::string& output_filename) {
    static std::regex r_endlines("\\s+");
    program = std::regex_replace(program, r_endlines, " ");
    if (program.size() == 0 || program.back() != ' ')
        program.push_back(' '); // force sentinel whitespace
    std::ofstream(("output/" + output_filename + "_test_tokenize_2_collapse_whitespace.txt").c_str())
        << program << std::endl;
    return true;
}

bool test_tokenize_3_FSM_standard(std::string& program, const std::string& output_filename) {

    using namespace std;
    rainscript::FSM fsm(FSM_0_STANDARD_FILENAME);

    if (!test_fsm_one_character_symbols_only(fsm))
        return false;

    static char *esc_sequence = NULL;
    if (esc_sequence == NULL) {
        esc_sequence = new char[256];
        esc_sequence['a'] = '\a';
        esc_sequence['b'] = '\b';
        esc_sequence['f'] = '\f';
        esc_sequence['n'] = '\n';
        esc_sequence['r'] = '\r';
        esc_sequence['t'] = '\t';
        esc_sequence['v'] = '\v';
    }

    // create lookup array based on ascii values
    int max_ascii = 0;
    for (int i = 0; i < fsm.n_symbols; ++i)
        max_ascii = max<int>(max_ascii, fsm.symbols[i][0]);

    int *ascii_index = new int[max_ascii + 1];
    memset(ascii_index, -1, sizeof(int) * (max_ascii + 1));
    for (int i = 0; i < fsm.n_symbols; ++i)
        ascii_index[fsm.symbols[i][0]] = i;


    // buffer of tokens
    static vector<string> tokens, lexemes;
    static string buffer;

    tokens.clear();
    lexemes.clear();
    buffer.clear();

    // last token should be whitespace
    program.push_back(' ');

    int index = 0;
    size_t size = program.size();

    // buffer for escaped octals/hexadecimals
    int esc_buffer = 0;

    // create callback function that handles state changes
    auto handler = [&fsm, &index, &esc_buffer]
                    (int state, int symbol, const string& status) {
        switch (status[0]) {
            case 'B': // back
                // pop one character from buffer
                buffer.pop_back();
                --index;
                break;
            case 'T': // trim
                do { buffer.pop_back(); }
                while (buffer.back() == ' ');
                buffer.push_back(' ');
                break;
            case 'P': // pop
                buffer.pop_back();
                break;
            case 'e': // keep same character
                buffer.erase(buffer.end() - 2);
                break;
            case 'E': // special escape
                buffer.pop_back();
                buffer.push_back(esc_sequence[fsm.symbols[symbol][0]]);
                break;
            case 'o': // arbitrary octal
                esc_buffer = esc_buffer * 8 + (fsm.symbols[symbol][0] - '0');
                buffer.pop_back();
                break;
            case 'O': // octal convert
                buffer.pop_back();
                // TODO: guard against overflow
                buffer.push_back((char) esc_buffer);
                esc_buffer = 0;
                break;
            case 'x': // arbitrary hexadecimal
                buffer.pop_back();
                {
                    char ch = fsm.symbols[symbol][0];
                    if ('0' <= ch && ch <= '9')
                        esc_buffer = esc_buffer * 16 + (ch - '0');
                    else if ('A' <= ch && ch <= 'F')
                        esc_buffer = esc_buffer * 16 + 10 + (ch - 'A');
                    else if ('a' <= ch && ch <= 'f')
                        esc_buffer = esc_buffer * 16 + 10 + (ch - 'a');
                }
                break;
            case 'X': // hexadecimal convert
                buffer.pop_back();
                buffer.push_back((char) esc_buffer);
                esc_buffer = 0;
                break;
            default:
                tokens.push_back(status);
                lexemes.push_back(buffer);
                buffer.clear();
                break;
        }
        return true;
    };

    auto print = [&index, &size] (ofstream& out) {
        size_t token_size = tokens.size();
        out << "index  = " << index << " of " << size << '\n';
        out << "tokens = " << token_size << '\n';
        out << "buffer = \"" << buffer << "\"\n\n";  
        for (size_t i = 0; i < token_size; ++i) {
            out << "[" << i << "] " << (tokens[i] == "w" ? " " : lexemes[i]) << '\n';
        }
    };

    // simulate FSM
    ofstream fout(("output/" + output_filename + "_test_tokenize_3_FSM_standard.txt").c_str());

    int state = fsm.start_state;
    while (index < size) {
        // push to buffer
        char& ch = program[index++];
        buffer.push_back(ch);
        // jump to next state
        int symbol = ascii_index[ch];
        if (symbol == -1 || !fsm.next(state, symbol, handler)) {
            print(fout);
            delete[] ascii_index;
            return false;
        }
    }

    delete[] ascii_index;

    // everything ok
    print(fout);
    return true;

}

bool test_tokenize(std::string program, const std::string& output_filename) {
    return test_tokenize_1_remove_comments(program, output_filename)
        // && test_tokenize_2_collapse_whitespace(program, output_filename)
        && test_tokenize_3_FSM_standard(program, output_filename);
}

bool test_tokenize_file(const char input_filename[], const char output_filename[]) {
    
    using namespace std;

    ifstream fin(input_filename);
    fin.seekg(0, ios::end);
    ifstream::pos_type pos = fin.tellg();

    // read all bytes
    vector<char> bytes(pos);
    fin.seekg(0, ios::beg);
    fin.read(&bytes[0], pos);
    return test_tokenize(string(bytes.begin(), bytes.end()), output_filename);
}

int main() {

    using namespace std;

    vector<string> files = {
        "BOOK.rs",
        "GAME.rs",
        "MARRY.rs",
        "PROLOGUE.rs",
        "START.rs"
    };

    int index = 0;
    for (auto& filename : files) {
        cout << "TEST " << filename << "... " << flush;
        long start_time = clock();
        if (test_tokenize_file(("input/" + filename).c_str(), filename.data()))
            cout << "PASSED" << endl;
        else
            cout << "FAILED" << endl;
        cout << "\ttime: " << float(std::clock() - start_time) / CLOCKS_PER_SEC << " seconds" << endl;
    }


}