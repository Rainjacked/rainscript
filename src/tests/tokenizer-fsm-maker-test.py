#!/usr/bin/python2

def main():

    folder = '../compiler/tokenizer/finite-state-machine-maker/'
    files = ['FSM-edge-list.txt']

    import sys
    sys.path.append(folder + 'py')
    
    from FSM import Graph, parse

    graphs = []
    for filename in files:
        edges, callbacks = parse(folder + 'input/' + filename)
        states = [u for u, v, w in edges] \
               + [v for u, v, w in edges] \
               + [s for s, c in callbacks]
        symbols = []
        flat_edges = []
        for u, v, w in edges:
            if isinstance(w, list):
                symbols.extend(w)
                flat_edges.extend((u, v, ww) for ww in w)
            else:
                symbols.append(w)
                flat_edges.append((u, v, w))
        print(filename + '...'),
        try:
            graphs.append(Graph(edges=flat_edges,
                                callbacks=callbacks,
                                states=states,
                                symbols=symbols))
        except Exception as e:
            print('Error in file: ' + folder + 'input/' + filename)
            print(e)
            
        print('PASSED')

    for filename, graph in zip(files, graphs):
        graph.to_file(folder + 'output/' + filename)

if __name__ == "__main__":
    main()