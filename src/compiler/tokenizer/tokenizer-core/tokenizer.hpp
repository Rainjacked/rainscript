#ifndef __rainscript_include_tokenizer
#define __rainscript_include_tokenizer

namespace rainscript {

    /**
     * Tokenizes a stream of input
     */
    template<typename input_t, typename token_t>
    class tokenizer {
    public:

        typedef token_t token;
        typedef std::vector<token_t> token_collection;

        /**
         * Constructs a tokenizer for Rainscript
         * from a finite state machine.
         */
        tokenizer(rainscript::fsm*);

        /**
         * Gets the current state ID
         * @return [description]
         */
        int get_current_state() const;

        /**
         * Tokenizes a stream of input.
         * @param input     the stream of input to tokenize
         * @param onError   function for handling errors during tokenization
         */
        void tokenize(input_t input, function<void(std::string)> on_error);

        /**
         * A list of tokens captured by this tokenizer.
         */
        token_collection get_tokens() const;

    };

}

#endif /* __rainscript_include_tokenizer */
