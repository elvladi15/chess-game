import { PIECE_TYPES } from "../constants";
import { findPieceByPosition } from "./findPieceByPosition";
import { getAvailableSquares } from "./getAvailableSquares";
import { getForwardIncrementAndLastRow } from "./getForwardIncrementAndLastRow";
import { isKingChecked } from "./isKingChecked";
import { squareOperation } from "./squareOperation";

/* 
The function getDistributionAfterMove will recreate
the board in a state as if certain piece has already been 
moved to evaluate whether after the move, the current turn's 
king is under attack.

Takes in consideration the capture of a pawn en passant,
as this can actually make a difference in current turn's 
king's safety.

However, during castling, the function will recreate king's 
movement, but will not move the rook, as this does not make 
any difference in king's safety after all previous validations 
of the castle.
*/
function getDistributionAfterMove(pieceToMove, squareToMoveTo, pieces, captureEnPassantSquare) {
  const { position } = pieceToMove;
  const { forwardIncrement } = getForwardIncrementAndLastRow(pieceToMove.isWhite);

  const distributionAfterMove = [];

  for (const pieceToBeCompared of pieces) {
    //there is a regular capture
    if (pieceToBeCompared.position === squareToMoveTo) continue;
    //there is a capture en passant
    else if (
      captureEnPassantSquare != null &&
      captureEnPassantSquare === squareToMoveTo &&
      pieceToBeCompared.position === squareOperation(squareToMoveTo, 0, -forwardIncrement)
    )
      continue;
    //piece to be compared is the same as the piece that may move
    if (pieceToBeCompared.position === position) {
      distributionAfterMove.push({
        ...pieceToMove,
        position: squareToMoveTo,
        availableSquares: [],
      });
    } else {
      distributionAfterMove.push(pieceToBeCompared);
    }
  }
  return distributionAfterMove;
}

/*
The function assignAvailableSquares uses the 
getAvailableSquares function, which returns an array
of the available squares given a piece and pieces array
BEFORE check validation, and filters the squares that, after
such move, the king is vulnerable.

Also verifies En Passant capture and Castling, as they are
special moves.

Returns an object that contains the array of all pieces with 
their available squares (only current turn's pieces, the other 
side will get an empty array) AFTER ensuring king's safety, also 
returns a bool that tells whether there are available moves in the
position, to further know if the game ended in checkmate or 
stalemate, depending if the current king's turn is in check or not.
 */
export function assignAvailableSquares(isWhiteTurn, pieces, previousMovedPiece, kingChecked) {
  let hasAvailableMoves = false;
  const startingPieces = pieces.map(piece => {
    const { type, position, isWhite, didMove } = piece;
    let squaresWithCheckValidation = [];
    if (isWhite === isWhiteTurn) {
      const squaresWithoutCheckValidation = getAvailableSquares(piece, pieces);

      //capture en passant
      const { forwardIncrement } = getForwardIncrementAndLastRow(isWhite);
      function getCaptureEnPassantSquare() {
        if (piece.type !== PIECE_TYPES.PAWN) return;
        if (previousMovedPiece == null) return;
        if (previousMovedPiece.piece.type !== PIECE_TYPES.PAWN) return;

        if (
          previousMovedPiece.previousSquare !==
          squareOperation(previousMovedPiece.piece.position, 0, 2 * forwardIncrement)
        )
          return;

        const leftSquare = squareOperation(position, -1, 0);
        const rightSquare = squareOperation(position, 1, 0);

        if (leftSquare != null && previousMovedPiece.piece.position === leftSquare) {
          return squareOperation(position, -1, forwardIncrement);
        }

        if (rightSquare != null && previousMovedPiece.piece.position === rightSquare) {
          return squareOperation(position, 1, forwardIncrement);
        }
      }
      const captureEnPassantSquare = getCaptureEnPassantSquare();
      if (captureEnPassantSquare != null) {
        squaresWithoutCheckValidation.push(captureEnPassantSquare);
      }

      //castling
      const squaresToSkipCheckValidation = [];
      function getCastlingSide() {
        const castlingSide = {
          kingSide: false,
          queenSide: false,
        };

        if (type !== PIECE_TYPES.KING) return castlingSide;
        if (didMove) return castlingSide;

        const initialPosition = isWhite ? "e1" : "e8";
        if (position !== initialPosition) return castlingSide;

        if (kingChecked) return castlingSide;

        function isEmptySquare(columnIncrement) {
          const sideSquare = squareOperation(position, columnIncrement, 0);
          return findPieceByPosition(sideSquare, pieces) == null;
        }
        function isCheckedAfterMove(columnIncrement) {
          const sideSquare = squareOperation(position, columnIncrement, 0);
          const distributionAfterKingMove = getDistributionAfterMove(
            piece,
            sideSquare,
            pieces,
            captureEnPassantSquare
          );
          const kingChecked = isKingChecked(isWhiteTurn, distributionAfterKingMove);

          squaresToSkipCheckValidation.push({
            square: sideSquare,
            kingChecked,
          });
          return kingChecked;
        }

        //king side castling
        function canCastleKingSide() {
          //directly 1 right square from the king position
          if (!isEmptySquare(1)) return false;
          if (isCheckedAfterMove(1)) return false;

          //directly 2 right squares from the king position
          if (!isEmptySquare(2)) return false;

          //h-column rook validations
          const rightRook = findPieceByPosition(squareOperation(position, 3, 0), pieces);
          if (rightRook == null) return false;
          if (rightRook.type !== PIECE_TYPES.ROOK) return false;
          if (rightRook.isWhite !== isWhite) return false;
          if (rightRook.didMove) return false;
          return true;
        }
        if (canCastleKingSide()) castlingSide.kingSide = true;

        //queen side castling
        function canCastleQueenSide() {
          //directly 1 left square from the king position
          if (!isEmptySquare(-1)) return false;
          if (isCheckedAfterMove(-1)) return false;

          //directly 2 left squares from the king position
          if (!isEmptySquare(-2)) return false;

          //directly 3 left squares from the king position
          if (!isEmptySquare(-3)) return false;

          //a-column rook validations
          const leftRook = findPieceByPosition(squareOperation(position, -4, 0), pieces);
          if (leftRook == null) return false;
          if (leftRook.type !== PIECE_TYPES.ROOK) return false;
          if (leftRook.isWhite !== isWhite) return false;
          if (leftRook.didMove) return false;

          return true;
        }
        if (canCastleQueenSide()) castlingSide.queenSide = true;
        return castlingSide;
      }
      const castlingSide = getCastlingSide();

      if (castlingSide.kingSide) {
        squaresWithoutCheckValidation.push(squareOperation(position, 2, 0));
      }
      if (castlingSide.queenSide) {
        squaresWithoutCheckValidation.push(squareOperation(position, -2, 0));
      }

      squaresWithCheckValidation = squaresWithoutCheckValidation.filter(square => {
        /* 
        the squares in squaresToSkipCheckValidation array have 
        already been validated in getCastlingSide function (after a 
        number of conditions are met) to see if king is checked after 
        the king itself moves to those squares, so, in order to reduce 
        complexity, they won't have to be recalculated, just take the 
        result of its previous validation.
        */
        if (squaresToSkipCheckValidation[0]?.square === square)
          return !squaresToSkipCheckValidation[0].kingChecked;

        if (squaresToSkipCheckValidation[1]?.square === square)
          return !squaresToSkipCheckValidation[1].kingChecked;

        const distributionAfterMove = getDistributionAfterMove(
          piece,
          square,
          pieces,
          captureEnPassantSquare
        );
        const kingChecked = isKingChecked(isWhite, distributionAfterMove);
        if (kingChecked) {
          return false;
        } else {
          hasAvailableMoves = true;
          return true;
        }
      });
    }
    //assign available squares
    return {
      ...piece,
      availableSquares: squaresWithCheckValidation,
    };
  });
  return { pieces: startingPieces, hasAvailableMoves };
}
