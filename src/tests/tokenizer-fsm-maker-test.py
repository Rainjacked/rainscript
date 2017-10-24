#!/usr/bin/python2

def main():

    folder = '../compiler/tokenizer/finite-state-machine-maker/'
    description_file = folder + 'description.txt'
    output_file = folder + '../tokenizer-core/fsm'

    import sys
    sys.path.append(folder)
    
    from fsmm import parse_graph

    try:
        parse_graph(description_file).to_file(output_file)
        print('PASSED')
    except Exception as e:
        print(e)
        print('FAILED')

if __name__ == "__main__":
    main()