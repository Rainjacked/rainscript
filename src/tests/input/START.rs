[[ START ]]

    @play sound(illurock.opus)
    @show @fade @bg image(lecturehall)

    "It's only when I hear the sounds of shuffling feet and supplies being put away that I realize that the lecture's over."
    "Professor Eileen's lectures are usually interesting, but today I just couldn't concentrate on it."
    "I've had a lot of other thoughts on my mind...thoughts that culminate in a question."
    "It's a question that I've been meaning to ask a certain someone."

    @show @dissolve @bg image(uni)

    "When we come out of the university, I spot her right away."

    @show @dissolve Sylvie(normal, text color = green)

    "I've known Sylvie since we were kids. She's got a big heart and she's always been a good friend to me."
    "But recently... I've felt that I want something more."
    "More than just talking, more than just walking home together when our classes end."

    "As soon as she catches my eye, I decide..."

    #option
        #choice "To ask her right away." goto [[ rightaway ]]
        #choice "To ask her later." goto [[ later ]]
    #endoption

[[ rightaway ]]

    @show Sylvie(smile)

    Sylvie: "Hi there! How was class?"
    Me: "Good..."
    "I can't bring myself to admit that it all went"
    Me: "Are you going home now? Wanna go back with me?"
    Sylvie: "Sure!"

    @show @fade @bg image(meadow)

    "After a short while, we reach the meadows just outside the neighborhood where we both live."
    "It's a scenic view I've grown used to. Autumn is especially beautiful here."
    "When we were children, we played in these meadows a lot, so they're full of memories."

    Me: "Hey... Umm..."

    @show @dissolve Sylvie(smile)

    "She turns to me and smiles. She looks so welcoming that I feel my nervousness melt away."
    "I'll ask her...!"

    Me: "Umm... Will you..."
    Me: "Will you be my artist for my visual novel?"

    @show Sylvie(surprised)

    "Silence."
    "She looks so shocked that I begin to fear the worst. But then..."

    @show Sylvie(smile)

    Sylvie: "Sure, but what's a visual novel?"

    #option
        #choice "It's a video game." goto [[ GAME ]]
        #choice "It's an interactive book." goto [[ BOOK ]]
    #endoption

[[ later ]]

    "I can't get up the nerve to ask right now. With a gulp, I decide to ask her later."

    @show @dissolve color(black)

    "But I'm an indecisive person."
    "I couldn't ask her that day and I end up never being able to ask her."
    "I guess I'll never know the answer to my question now..."
    "**Bad Ending**."
