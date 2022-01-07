import { PIECE_TYPES } from "../constants";
import { findPiecesByTypeAndColor } from "./findPiecesByTypeAndColor";
import { getAvailableSquares } from "./getAvailableSquares";

/*
The function isKingChecked returns a bool that tells
whether the king is in check in a determined position,
given the current turn and the pieces array on the board.

Gets the current position of the king, then iterates over 
all pieces of the enemy, uses the getAvailableSquares
function to get their respective available squares 
(BEFORE check), and if at least piece can land on king's
square, the king is indeed in check. If no enemy pieces
can land on the king's square, there is no check.
 */
export function isKingChecked(isWhiteTurn, pieces) {
  const [king] = findPiecesByTypeAndColor(PIECE_TYPES.KING, isWhiteTurn, pieces);
  for (const piece of pieces) {
    const availableSquares = getAvailableSquares(piece, pieces);

    if (availableSquares.includes(king.position)) {
      return true;
    }
  }
  return false;
}
