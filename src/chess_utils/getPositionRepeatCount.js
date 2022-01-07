import { findPieceByPosition } from "./findPieceByPosition";

/*
The function getPositionRepeatCount returns the number of
times a given board state is repeated among all the board
states that have been present. Receives the current pieces
in the board and all the board states (not including current
one yet).
  
Two states are the same not only when the same pieces are 
in the board, but also the legal moves of each piece, so
a state with same piece positions, but in one you can castle
and the other you can't, are not equal. The same happens 
with capture en passant, as it has to be executed immediately
after the pawn moves 2 squares.
 */
export function getPositionRepeatCount(currentPieces, boardStates) {
  let repeatCount = 1;

  for (let i = 0; i < boardStates.length; i++) {
    let areSamePosition = true;
    if (boardStates[i].pieces.length !== currentPieces.length) continue;

    for (const piece of boardStates[i].pieces) {
      const comparingPiece = findPieceByPosition(piece.position, currentPieces);
      function areSamePieces() {
        if (comparingPiece == null) return false;
        if (comparingPiece.type !== piece.type) return false;
        if (comparingPiece.isWhite !== piece.isWhite) return false;

        if (comparingPiece.availableSquares.length !== piece.availableSquares.length) return false;

        for (const square of comparingPiece.availableSquares) {
          if (!piece.availableSquares.includes(square)) return false;
        }
        return true;
      }
      if (!areSamePieces()) {
        areSamePosition = false;
        break;
      }
    }
    if (areSamePosition) repeatCount++;
  }
  return repeatCount;
}
