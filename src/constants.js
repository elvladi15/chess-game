export const ACTIONS = {
  START_GAME: "start-game",
  PLAY_AGAIN: "play-again",
  SELECT_PIECE: "select-piece",
  DESELECT_PIECE: "deselect-square",
  MOVE_PIECE: "move-piece",
  REMOVE_PIECE: "remove-piece",
  FLIP_BOARD: "flip-board",
  PROMOTE_PAWN: "promote-pawn",
  CHANGE_TURN: "change-turn",
  ASSIGN_PROMOTION: "assign-promotion",
  UNASSIGN_PROMOTION: "unassign-promotion",
  CHANGE_SQUARE_COLOR: "change-square-color",
  JUMP_TO_BOARD_STATE: "jump-to-board-state",
  CHANGE_PIECE_DESIGN: "change-piece-design",
  RESIGN: "resign",
  DRAW_BY_AGREEMENT: "draw-by-agreement",
  DRAW_BY_FIFTY_MOVE_RULE: "draw-by-fifty-move-rule",
  CLOSE_RESULT_DISPLAY: "close-result-display",
  OPEN_RESULT_DISPLAY: "open-result-display",
  RESET_STREAK_COUNT_WITHOUT_PAWN_MOVE_OR_CAPTURE: "reset-streak-without-pawn-move-or-capture",
  INCREMENT_STREAK_COUNT_WITHOUT_PAWN_MOVE_OR_CAPTURE:
    "increment-streak-without-pawn-move-or-capture",
};
export const PIECE_TYPES = {
  PAWN: "pawn",
  ROOK: "rook",
  KNIGHT: "knight",
  BISHOP: "bishop",
  KING: "king",
  QUEEN: "queen",
};
export const PIECE_DESIGNS = {
  CLASSIC: "classic",
  SOLID: "solid",
};
export const SQUARE_COLORS = {
  PATTERN_1: {
    white: "#EEEED2",
    black: "#769656",
    selected: { white: "#F6F669", black: "#BACA2B" },
  },
  PATTERN_2: {
    white: "#F0D9B5",
    black: "#B58863",
    selected: { white: "#F6F669", black: "#BACA2B" },
  },
  PATTERN_3: {
    white: "#EAE9D2",
    black: "#4B7399",
    selected: { white: "#75C7E8", black: "#268CCC" },
  },
};
export const COLUMNS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const GAME_RESULTS = {
  CHECKMATE: "checkmate",
  RESIGNATION: "resignation",
  AGREEMENT: "agreement",
  STALEMATE: "stalemate",
  REPETITION: "repetition",
  INSUFFICIENT_MATERIAL: "insufficient material",
  FIFTY_MOVE_RULE: "fifty move rule",
};
