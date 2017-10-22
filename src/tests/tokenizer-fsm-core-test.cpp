#include "../compiler/tokenizer/tokenizer-core/cpp/FSM.cpp"

int main() {

    using namespace std;

    string folder = "../compiler/tokenizer/finite-state-machine-maker/output/";
    string files[] = {
        "FSM-0-standard.txt",
        "FSM-1-compound.txt",
        "FSM-2-prefixes.txt"
    };

    for (int i = 0; i < 3; ++i) {
        string filename = folder + files[i];
        cout << files[i] << "... " << flush;
        rainscript::FSM(filename.c_str());
        cout << "PASSED" << endl;
    }

}