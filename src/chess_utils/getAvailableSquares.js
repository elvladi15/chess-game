import { PIECE_TYPES } from "../constants";
import { findPieceByPosition } from "./findPieceByPosition";
import { getForwardIncrementAndLastRow } from "./getForwardIncrementAndLastRow";
import { squareOperation } from "./squareOperation";

/*
The function getAvailableSquares will return an array
of the available squares BEFORE validating king's safety
after respective of each piece. Receives the piece to get
movements and the array of piece objects to determine the
situation on the board. 
 */
export function getAvailableSquares(piece, pieces) {
  const { position, isWhite } = piece;
  if (piece.type === PIECE_TYPES.PAWN) {
    return pawnMovement();
  } else if (piece.type === PIECE_TYPES.ROOK) {
    return perpendicularMovement(7);
  } else if (piece.type === PIECE_TYPES.KNIGHT) {
    return knightMovement();
  } else if (piece.type === PIECE_TYPES.BISHOP) {
    return diagonalMovement(7);
  } else if (piece.type === PIECE_TYPES.QUEEN) {
    return [...diagonalMovement(7), ...perpendicularMovement(7)];
  } else if (piece.type === PIECE_TYPES.KING) {
    return [...diagonalMovement(1), ...perpendicularMovement(1)];
  }
  function diagonalMovement(maxDistance) {
    const availableSquares = [];

    //northwest
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, -i, i);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) break;
      availableSquares.push(squarePosition);
      break;
    }
    //northeast
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, i, i);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) break;
      availableSquares.push(squarePosition);
      break;
    }
    //southeast
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, i, -i);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) {
        break;
      }
      availableSquares.push(squarePosition);
      break;
    }
    //southwest
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, -i, -i);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) break;
      availableSquares.push(squarePosition);
      break;
    }
    return availableSquares;
  }

  function perpendicularMovement(maxDistance) {
    const availableSquares = [];

    //west
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, -i, 0);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) break;
      availableSquares.push(squarePosition);
      break;
    }
    //north
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, 0, i);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) break;
      availableSquares.push(squarePosition);
      break;
    }
    //east
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, i, 0);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) break;
      availableSquares.push(squarePosition);
      break;
    }
    //south
    for (let i = 1; i <= maxDistance; i++) {
      const squarePosition = squareOperation(position, 0, -i);
      if (squarePosition == null) break;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
        continue;
      }
      if (pieceInSquare.isWhite === isWhite) break;
      availableSquares.push(squarePosition);
      break;
    }
    return availableSquares;
  }

  function knightMovement() {
    const availableSquares = [];

    function evaluateKnightMovement(columnIncrement, rowIncrement) {
      const squarePosition = squareOperation(position, columnIncrement, rowIncrement);
      if (squarePosition == null) return;

      const pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null || pieceInSquare.isWhite !== isWhite) {
        availableSquares.push(squarePosition);
      }
    }

    evaluateKnightMovement(-2, 1); //⬑
    evaluateKnightMovement(-1, 2); //↰
    evaluateKnightMovement(1, 2); //↱
    evaluateKnightMovement(2, 1); //⬏
    evaluateKnightMovement(2, -1); //⬎
    evaluateKnightMovement(1, -2); //↳
    evaluateKnightMovement(-1, -2); //↲
    evaluateKnightMovement(-2, -1); //⬐

    return availableSquares;
  }

  function pawnMovement() {
    const availableSquares = [];

    let row = position[1];
    row = parseInt(row);

    let { forwardIncrement } = getForwardIncrementAndLastRow(isWhite);
    const startingRow = isWhite ? 2 : 7;
    let limit = row === startingRow ? 2 : 1;

    let squarePosition;
    let pieceInSquare;
    //forward increment movement
    for (let i = 1; i <= limit; i++) {
      squarePosition = squareOperation(position, 0, forwardIncrement * i);
      pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare == null) {
        availableSquares.push(squarePosition);
      } else break;
    }

    //left capture
    squarePosition = squareOperation(position, -1, forwardIncrement);
    if (squarePosition != null) {
      pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare != null && pieceInSquare.isWhite !== isWhite) {
        availableSquares.push(squarePosition);
      }
    }
    //right capture
    squarePosition = squareOperation(position, 1, forwardIncrement);
    if (squarePosition != null) {
      pieceInSquare = findPieceByPosition(squarePosition, pieces);

      if (pieceInSquare != null && pieceInSquare.isWhite !== isWhite) {
        availableSquares.push(squarePosition);
      }
    }

    return availableSquares;
  }
}
