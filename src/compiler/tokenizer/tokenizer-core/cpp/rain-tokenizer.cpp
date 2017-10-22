#include <iostream>
#include <fstream>
#include <vector>
#include <cassert>
using namespace std;

struct FSM {
    int n_states;
    int n_symbols;
    string *states;
    string *symbols;
    int *n_callbacks;
    string **callbacks;
    int *null;
    int **matrix;

    FSM(const char filename[]) {

        static string buffer;
        ifstream fin(filename);

        // read size
        fin >> n_states >> n_symbols;

        // allocate state and callbacks
        states = new string[n_states];
        n_callbacks = new int[n_states];
        callbacks = new string*[n_states];

        // read state names and callbacks
        for (int i = 0; i < n_states; ++i) {
            int& length = n_callbacks[i];
            fin >> states[i] >> length;
            callbacks[i] = new string[length];
            for (int j = 0; j < length; ++j)
                fin >> callbacks[i][j];
        }

        // move cursor down
        getline(fin, buffer);

        // allocate symbols
        symbols = new string[n_symbols];

        // read symbols per line
        for (int i = 0; i < n_symbols; ++i) {
            getline(fin, symbols[i]);
        }

        // allocate null pointers and FSM adjacency matrix
        null = new int[n_states];
        matrix = new int*[n_states];

        // read matrix, L means list, N means null
        for (int i = 0; i < n_states; ++i) {
            fin >> buffer;
            if (buffer == "L") {
                null[i] = -1;
                // read list
                matrix[i] = new int[n_symbols];
                for (int j = 0; j < n_symbols; ++j)
                    fin >> matrix[i][j];
            } else if (buffer == "N") {
                matrix[i] = NULL;
                fin >> null[i];
            } else {
                assert(false);
            }

        }

    }

    ~FSM() {
        for (int i = 0; i < n_states; ++i) {
            delete[] callbacks[i];
            if (matrix[i] != NULL)
                delete[] matrix[i];
        }
        delete[] states;
        delete[] symbols;
        delete[] callbacks;
        delete[] n_callbacks;
        delete[] null;
        delete[] matrix;
    }

};

int main(int argc, char *args[]) {
    FSM("../../finite-state-machine-maker/output/FSM-0-standard.txt");
    FSM("../../finite-state-machine-maker/output/FSM-1-compound.txt");
    FSM("../../finite-state-machine-maker/output/FSM-2-prefixes.txt");
    cout << "PASSED ASSERTIONS" << endl;
}