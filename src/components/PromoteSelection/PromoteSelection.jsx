import { ACTIONS, COLUMNS, PIECE_TYPES } from "../../constants";
import { useGame, useGameUpdate } from "../../context/GameContext";
import { Piece } from "../Piece";
import "./PromoteSelection.css";

export default function PromoteSelection() {
  const { currentBoardState, promotion, isBoardFlipped } = useGame();
  const { isWhiteTurn, selectedPiece } = currentBoardState;

  const dispatch = useGameUpdate();
  const { position, canCapture } = promotion;

  const column = position[0];
  const columnIndex = COLUMNS.indexOf(column);

  function removePromoteSelection() {
    dispatch({ type: ACTIONS.UNASSIGN_PROMOTION });
    dispatch({ type: ACTIONS.DESELECT_PIECE });
  }
  function selectPromotePiece(type) {
    dispatch({ type: ACTIONS.RESET_STREAK_COUNT_WITHOUT_PAWN_MOVE_OR_CAPTURE });
    if (canCapture) {
      dispatch({ type: ACTIONS.REMOVE_PIECE, payload: { position } });
    }
    dispatch({
      type: ACTIONS.MOVE_PIECE,
      payload: { piece: selectedPiece, position: position, registerMove: true },
    });
    dispatch({
      type: ACTIONS.PROMOTE_PAWN,
      payload: { position, type },
    });
    dispatch({ type: ACTIONS.UNASSIGN_PROMOTION });
    dispatch({ type: ACTIONS.CHANGE_TURN });
  }
  let promoteSelectionStyle = {};

  if (isBoardFlipped) {
    promoteSelectionStyle.right = `calc(12.5% * ${columnIndex})`;
    if (isWhiteTurn) {
      promoteSelectionStyle.bottom = 0;
      promoteSelectionStyle.flexDirection = "column-reverse";
    }
  } else {
    promoteSelectionStyle.left = `calc(12.5% * ${columnIndex})`;
    if (!isWhiteTurn) {
      promoteSelectionStyle.bottom = 0;
      promoteSelectionStyle.flexDirection = "column-reverse";
    }
  }

  return (
    <div className="promote-selection" style={promoteSelectionStyle}>
      <div
        className="promote-selection__item"
        onClick={() => selectPromotePiece(PIECE_TYPES.QUEEN)}
      >
        <Piece type={PIECE_TYPES.QUEEN} isWhite={isWhiteTurn} />
      </div>
      <div
        className="promote-selection__item"
        onClick={() => selectPromotePiece(PIECE_TYPES.KNIGHT)}
      >
        <Piece type={PIECE_TYPES.KNIGHT} isWhite={isWhiteTurn} />
      </div>
      <div className="promote-selection__item" onClick={() => selectPromotePiece(PIECE_TYPES.ROOK)}>
        <Piece type={PIECE_TYPES.ROOK} isWhite={isWhiteTurn} />
      </div>
      <div
        className="promote-selection__item"
        onClick={() => selectPromotePiece(PIECE_TYPES.BISHOP)}
      >
        <Piece type={PIECE_TYPES.BISHOP} isWhite={isWhiteTurn} />
      </div>
      <div className="promote-selection__item" onClick={() => removePromoteSelection()}>
        X
      </div>
    </div>
  );
}
