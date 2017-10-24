#!/bin/bash
mkdir -p build
mkdir -p output
rm -r output/*
TOKENIZER=../compiler/tokenizer
CORE=tokenizer-core

echo "Test 1: tokenizer-fsm-maker-test.py"
python2 tokenizer-fsm-maker-test.py

echo ""
echo "Test 2: tokenizer-fsm-core-test.cpp"
echo "Compiling..."
I/data
g++ -std=c++11 -O2 tokenizer-fsm-core-test.cpp -I "$TOKENIZER/$CORE" -o build/tokenizer-fsm-core-test.out
echo "Running..."
./build/tokenizer-fsm-core-test.out
rm -r build/
