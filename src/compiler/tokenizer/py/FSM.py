#!/usr/bin/python2

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
                elif ch == '\\':
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
                return

    return edges, callbacks
