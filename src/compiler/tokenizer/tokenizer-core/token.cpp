#ifndef __rainscript_include_Tokenizer
#define __rainscript_include_Tokenizer

namespace rainscript {

    template<typename type_t, typename lexeme_t>
    struct token {
        
        type_t type;
        lexeme_t lexeme;

        token(const type_t& type, const lexeme_t& lexeme):
            type(type),
            lexeme(lexeme) {}
    
    };

}

#endif /* __rainscript_include_Token */
