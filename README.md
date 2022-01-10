# chess-game

Local multiplayer chess game made with ReactJS without using chess libraries.

## Player functionalities:

1. Prompts player to enter both white player's username and black player's username
2. Player can flip the board
3. Player can choose between 3 different square colors
4. Player can choose between 2 different chess piece designs
5. Player can watch every board state during game and its chess notation
6. Player can undo and redo moves
7. Each player has the option to resign the game
8. Each player has the option to offer a draw and the opponent can choose to accept it or not
9. Each player has the option to force a draw by 50 move rule after the 50th consecutive move without pawn movement or a capture

## Game possible endings

The game can finish by one of the following possible:

1. Win by checkmate
2. Win by opponent resignation
3. Draw by stalemate
4. Draw by agreement
5. Draw by threefold repetition
6. Draw by 50 move rule
7. Draw by insufficient material

## Other game details

### Game autosaving

The game will autosave its state in browser local storage every time:

1. A player makes a move
2. A player rotates the board
3. A player changes square colors
4. A player changes piece designs
5. A player resigns
6. A player offers a draw and the opponent accepts it
7. A player forces a draw by 50 move rule
8. When the game starts
9. When players are prompted to input their usernames

### Move sound effects

Every time a move is made, 1 of 3 different sound effects will be heard.

There are sound effects for:

1. Normal piece move (without capture)
2. A capture
3. A check to the opponent's king
