#!/usr/bin/python2

class Graph(object):

    def __init__(self, edges, callbacks, states, symbols):

        state_list = list(set(states))
        state_ids = range(len(state_list))
        state_map = {}
        for i in state_ids:
            state_map[state_list[i]] = i

        symbol_list = list(set(symbols).difference({'any', 'null'}))
        symbol_ids = range(len(symbol_list))
        symbol_map = {}
        for i in symbol_ids:
            symbol_map[symbol_list[i]] = i

        fallback = [None for i in state_ids]
        matrix = [[-1 for j in symbol_ids] for i in state_ids]

        for state1, state2, edge_symbol in edges:

            state1_id = state_map[state1]
            state2_id = state_map[state2]

            if edge_symbol == 'any':
                fallback[state1_id] = state2_id

            elif edge_symbol == 'null':
                fallback[state1_id] = matrix[state1_id] = state2_id

            else:
                symbol_id = symbol_map[edge_symbol]
                matrix[state1_id][symbol_id] = state2_id

        # make sure that all fallbacks are handled
        missing = [state_list[i] for i, x in enumerate(fallback) if x is None]
        if missing:
            raise Exception('No fallback for: ' + ','.join(missing))

        self.matrix = matrix
        self.states = state_list
        self.symbols = symbol_list
        self.state_map = state_map
        self.symbol_map = symbol_map
        self.callbacks = [[] for i in state_ids]
        self.fallback = fallback

        for state, callback in callbacks:
            assert state in state_map
            state_id = state_map[state]
            self.callbacks[state_id].append(callback)

    def to_file(self, filename):
        with file(filename, 'w') as f:
            n = len(self.states)
            m = len(self.symbols)

            f.write('%d %d %d\n' % (n, m, self.state_map['0']))
            for callback, fallback_id, state in zip(self.callbacks, self.fallback, self.states):
                f.write('%s %d %d' % (state, fallback_id, len(callback)))
                for function in callback:
                    f.write(' %s' % function)
                f.write('\n')

            f.write('%s\0' % '\0'.join(self.symbols))
            
            for row in self.matrix:
                if isinstance(row, list):
                    f.write('L %s\n' % ' '.join(list(map(str, row))))
                else:
                    f.write('N %s\n' % str(row))



# converts text file to edge list and callbacks
def parse(filename):

    callbacks = []
    edges = []

    # parse contents of file
    with file(filename, 'r') as f:
        lines = f.readlines()
        for line_number, line in enumerate(lines):
            line = line.strip()
            if line == '':
                continue
            if line[:2] == '//':
                # skip comment
                continue
            # check if there are any quotations marks
            esc = False
            quo = False
            buf = ''
            words = []
            for ch in line + '\n':
                if esc:
                    buf += ch
                    esc = False
                elif ch == '\\' and quo:
                    buf += ch
                    esc = True
                elif ch == '"':
                    if quo:
                        # closing quote
                        buf += ch
                        quo = False
                        words.append(list(eval(buf)))
                        buf = ''
                    else:
                        # opening quote
                        if buf:
                            words.append(buf)
                            buf = ''
                        buf += ch
                        quo = True
                elif quo:
                    buf += ch
                elif ch.isspace():
                    if buf:
                        words.append(buf)
                        buf = ''
                else:
                    buf += ch

            if len(words) == 2:
                # add callback
                callbacks.append(words)
            elif len(words) == 3:
                # add edge
                edges.append(words)
            else:
                # invalid input
                print("Error on line %d of file %s" % (line_number, filename))
                return edges, callbacks
    return edges, callbacks

def test():
    files = ['FSM-edge-list.txt']
    graphs = []
    for filename in files:
        edges, callbacks = parse('../input/' + filename)
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
        try:
            graphs.append(Graph(edges=flat_edges,
                                callbacks=callbacks,
                                states=states,
                                symbols=symbols))
        except Exception as e:
            print('Error in file: ' + filename)
            print(e)
            return None

    for filename, graph in zip(files, graphs):
        graph.to_file('../output/' + filename)

    return graphs

