import { GAME_RESULTS, PIECE_TYPES } from "../constants";
import { findPiecesByTypeAndColor } from "./findPiecesByTypeAndColor";
import { squareOperation } from "./squareOperation";

/*
The function getMove returns the move notation after a move
has been executed on the board. Receives the board state before
and after the move, to determine differences in them, such as
piece movement, piece capture, and promotion type after a pawn
has promoted, and also receives the game result, just to check
if the game ended in a checkmate to put a # at the end of the 
notation
 */
export function getMove(boardStateBeforeMove, boardStateAfterMove, gameResult) {
  let move = "";
  const isKingChecked = boardStateAfterMove.isKingChecked;
  //after move
  const pieceAfterMove = boardStateAfterMove.previousMovedPiece.piece;

  //before move
  let pieceBeforeMove;
  let isLandingSquareEmpty = true;

  for (const piece of boardStateBeforeMove.pieces) {
    if (piece.position === boardStateAfterMove.previousMovedPiece.previousSquare) {
      pieceBeforeMove = piece;
    } else if (piece.position === pieceAfterMove.position) {
      isLandingSquareEmpty = false;
    }
  }
  const [pieceBeforeMoveColumn, pieceBeforeMoveRow] = pieceBeforeMove.position;
  const [pieceAfterMoveColumn, pieceAfterMoveRow] = pieceAfterMove.position;

  function findNotationMatch(type) {
    const matches = {
      thereIsMatch: false,
      columnUnmatch: false,
      rowUnmatch: false,
    };
    let unmatcher = "";
    const piecesOfSameTypeAndColor = findPiecesByTypeAndColor(
      type,
      pieceBeforeMove.isWhite,
      boardStateBeforeMove.pieces
    );

    const differentFromMovingPiece = piecesOfSameTypeAndColor.filter(
      piece => piece.position !== pieceBeforeMove.position
    );

    for (const piece of differentFromMovingPiece) {
      if (!piece.availableSquares.includes(pieceAfterMove.position)) continue;
      matches.thereIsMatch = true;
      const [column, row] = piece.position;
      if (column === pieceBeforeMoveColumn) {
        matches.rowUnmatch = true;
      } else if (row === pieceBeforeMoveRow) {
        matches.columnUnmatch = true;
      }
    }
    if (!matches.thereIsMatch) return "";
    if (matches.columnUnmatch) unmatcher += pieceBeforeMoveColumn;
    /*
    if there is match, but there is neither match in 
    row nor column, the column will be used by default
    */
    if (!matches.columnUnmatch && !matches.rowUnmatch) unmatcher += pieceBeforeMoveColumn;

    if (matches.rowUnmatch) unmatcher += pieceBeforeMoveRow;
    return unmatcher;
  }
  function getCaptureMark() {
    return isLandingSquareEmpty ? "" : "x";
  }
  function getPieceLetter(type) {
    //pawn has no letter
    let letter = "";
    if (type === PIECE_TYPES.ROOK) letter = "R";
    else if (type === PIECE_TYPES.KNIGHT) letter = "N";
    else if (type === PIECE_TYPES.BISHOP) letter = "B";
    else if (type === PIECE_TYPES.QUEEN) letter = "Q";
    else if (type === PIECE_TYPES.KING) letter = "K";
    return letter;
  }
  function getCheckMark() {
    if (!isKingChecked) return "";

    if (gameResult == null) return "+";
    return gameResult.motive === GAME_RESULTS.CHECKMATE ? "#" : "+";
  }
  if (pieceBeforeMove.type === PIECE_TYPES.PAWN) {
    /*
    if pawn is not moving forward, then it is 
    capturing in diagonal
    */
    if (pieceBeforeMoveColumn !== pieceAfterMoveColumn) {
      move += `${pieceBeforeMoveColumn}x`;
    }
    move += pieceAfterMove.position;

    const lastRow = pieceBeforeMove.isWhite ? "8" : "1";
    //check if pawn promoted
    if (pieceAfterMoveRow === lastRow) {
      move += `=${getPieceLetter(pieceAfterMove.type)}`;
    }
  } else if (pieceBeforeMove.type === PIECE_TYPES.KING) {
    //just check if it is castling

    //castle king side
    if (squareOperation(pieceBeforeMove.position, 2, 0) === pieceAfterMove.position) {
      move = "O-O";
      move += getCheckMark();
      return move;
    }
    //castle queen side
    else if (squareOperation(pieceBeforeMove.position, -2, 0) === pieceAfterMove.position) {
      move = "O-O-O";
      move += getCheckMark();
      return move;
    }
    move += `${getPieceLetter(pieceBeforeMove.type)}${findNotationMatch(pieceBeforeMove.type)}`;
    move += getCaptureMark();
    move += pieceAfterMove.position;
  } else {
    move += `${getPieceLetter(pieceBeforeMove.type)}${findNotationMatch(pieceBeforeMove.type)}`;
    move += getCaptureMark();
    move += pieceAfterMove.position;
  }
  move += getCheckMark();
  return move;
}
