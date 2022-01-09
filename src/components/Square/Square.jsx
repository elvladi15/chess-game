import { useEffect, useRef } from "react";
import { findPieceByPosition } from "../../chess_utils/findPieceByPosition";
import { getForwardIncrementAndLastRow } from "../../chess_utils/getForwardIncrementAndLastRow";
import { getSquareColor } from "../../chess_utils/getSquareColor";
import { squareOperation } from "../../chess_utils/squareOperation";
import { ACTIONS, PIECE_TYPES } from "../../constants";
import { useGame, useGameUpdate } from "../../context/GameContext";
import { Piece } from "../Piece";
import "./Square.css";

export default function Square({ position }) {
  const { currentBoardState, squareColor: stateSquareColor, promotion, gameResult } = useGame();
  const { pieces, selectedPiece, isWhiteTurn, isKingChecked, previousMovedPiece } =
    currentBoardState;

  const dispatch = useGameUpdate();
  const squareRef = useRef();

  const piece = findPieceByPosition(position, pieces);

  function getSquareCircle() {
    if (selectedPiece == null) return;
    if (!selectedPiece.availableSquares.includes(position)) return;

    const circleClassname = piece != null ? "circle-piece" : "circle";
    return <div className={circleClassname}></div>;
  }

  useEffect(() => {
    const newSquareRef = squareRef.current;
    const squareColor = getSquareColor(position, stateSquareColor);

    //cursor
    function canPlaceCursor() {
      if (gameResult != null) return false;
      if (getSquareCircle() != null) return true;
      if (piece == null) return false;
      return piece.isWhite === isWhiteTurn;
    }
    if (canPlaceCursor()) newSquareRef.style.cursor = "pointer";

    //background color
    function getBackgroundColor() {
      let backgroundColor = squareColor.color;

      function isSelected() {
        if (selectedPiece == null) return false;
        if (selectedPiece.position !== position) return false;
        return true;
      }
      function isMovedSquare() {
        if (previousMovedPiece == null) return false;
        if (previousMovedPiece.piece.position === position) return true;
        if (previousMovedPiece.previousSquare === position) return true;
      }
      function isCheckedSquare() {
        if (!isKingChecked) return false;
        if (piece == null) return false;
        if (piece.type !== PIECE_TYPES.KING) return false;
        if (piece.isWhite !== isWhiteTurn) return false;

        return true;
      }

      if (isSelected() || isMovedSquare()) {
        backgroundColor = squareColor.isWhite
          ? stateSquareColor.selected.white
          : stateSquareColor.selected.black;
      } else if (isCheckedSquare()) {
        backgroundColor = "red";
      }

      return backgroundColor;
    }
    newSquareRef.style.backgroundColor = getBackgroundColor();

    return function () {
      newSquareRef.style.cursor = "auto";
    };
  });
  function handleSquareClick() {
    if (gameResult != null) return;

    if (promotion != null) {
      dispatch({ type: ACTIONS.UNASSIGN_PROMOTION });
    }
    function canSelectPiece() {
      if (piece == null) return false;
      if (piece.isWhite !== isWhiteTurn) return false;
      if (selectedPiece != null && selectedPiece.position === piece.position) return false;
      return true;
    }
    function canDeselectPiece() {
      if (promotion != null) return true;
      if (selectedPiece == null) return false;
      if (piece == null) return false;
      if (piece.position !== selectedPiece.position) return false;
      return true;
    }
    function canAssignPromotion() {
      if (selectedPiece == null) return false;

      if (selectedPiece.type !== PIECE_TYPES.PAWN) return false;

      const row = parseInt(position[1]);
      const { lastRow } = getForwardIncrementAndLastRow(selectedPiece.isWhite);
      if (row !== lastRow) return false;

      return true;
    }
    function canMovePiece() {
      if (selectedPiece == null) return false;
      if (!selectedPiece.availableSquares.includes(position)) return false;
      return true;
    }
    if (canSelectPiece()) return dispatch({ type: ACTIONS.SELECT_PIECE, payload: { piece } });
    if (canDeselectPiece()) return dispatch({ type: ACTIONS.DESELECT_PIECE });

    if (canAssignPromotion()) {
      return dispatch({
        type: ACTIONS.ASSIGN_PROMOTION,
        payload: { promotion: { position, canCapture: piece != null } },
      });
    }
    if (canMovePiece()) {
      let canResetStreakCount = false;
      if (piece != null) {
        canResetStreakCount = true;
        dispatch({ type: ACTIONS.REMOVE_PIECE, payload: { position } });
      }
      dispatch({
        type: ACTIONS.MOVE_PIECE,
        payload: { piece: selectedPiece, position, registerMove: true },
      });

      if (selectedPiece.type === PIECE_TYPES.PAWN) canResetStreakCount = true;

      //en passant capture
      function canCaptureEnPassant() {
        if (selectedPiece.type !== PIECE_TYPES.PAWN) return false;
        if (piece != null) return false;

        //make sure the pawn is not moving forward
        const { forwardIncrement } = getForwardIncrementAndLastRow(selectedPiece.isWhite);
        if (
          position === squareOperation(selectedPiece.position, 0, forwardIncrement) ||
          position === squareOperation(selectedPiece.position, 0, 2 * forwardIncrement)
        )
          return false;

        return true;
      }
      if (canCaptureEnPassant()) {
        const { forwardIncrement } = getForwardIncrementAndLastRow(selectedPiece.isWhite);
        dispatch({
          type: ACTIONS.REMOVE_PIECE,
          payload: {
            position: squareOperation(position, 0, -forwardIncrement),
          },
        });
      }

      //castling
      function getCastlingSide() {
        const castlingSide = {
          kingSide: false,
          queenSide: false,
        };
        if (selectedPiece.type !== PIECE_TYPES.KING) return castlingSide;
        if (selectedPiece.didMove) return castlingSide;

        const twoLeftSquares = squareOperation(selectedPiece.position, -2, 0);
        const twoRightSquares = squareOperation(selectedPiece.position, 2, 0);

        if (position === twoLeftSquares) castlingSide.queenSide = true;
        else if (position === twoRightSquares) castlingSide.kingSide = true;
        return castlingSide;
      }
      const { kingSide, queenSide } = getCastlingSide();
      if (kingSide) {
        const rightRook = findPieceByPosition(
          squareOperation(selectedPiece.position, 3, 0),
          pieces
        );
        dispatch({
          type: ACTIONS.MOVE_PIECE,
          payload: {
            piece: rightRook,
            position: squareOperation(selectedPiece.position, 1, 0),
            registerMove: false,
          },
        });
      } else if (queenSide) {
        const leftRook = findPieceByPosition(
          squareOperation(selectedPiece.position, -4, 0),
          pieces
        );
        dispatch({
          type: ACTIONS.MOVE_PIECE,
          payload: {
            piece: leftRook,
            position: squareOperation(selectedPiece.position, -1, 0),
            registerMove: false,
          },
        });
      }

      if (canResetStreakCount) {
        dispatch({ type: ACTIONS.RESET_STREAK_COUNT_WITHOUT_PAWN_MOVE_OR_CAPTURE });
      } else {
        dispatch({ type: ACTIONS.INCREMENT_STREAK_COUNT_WITHOUT_PAWN_MOVE_OR_CAPTURE });
      }
      dispatch({ type: ACTIONS.CHANGE_TURN });
      return;
    }
  }
  return (
    <div className="square" ref={squareRef} onClick={() => handleSquareClick()}>
      {piece == null ? null : <Piece type={piece.type} isWhite={piece.isWhite} />}
      {getSquareCircle()}
    </div>
  );
}
