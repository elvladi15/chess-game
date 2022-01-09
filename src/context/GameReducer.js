import { ACTIONS, GAME_RESULTS, PIECE_TYPES } from "../constants";
import { findPiecesByTypeAndColor } from "../chess_utils/findPiecesByTypeAndColor";
import { isKingChecked } from "../chess_utils/isKingChecked";
import { assignAvailableSquares } from "../chess_utils/assignAvailableSquares";
import { getMove } from "../chess_utils/getMove";
import { getPositionRepeatCount } from "../chess_utils/getPositionRepeatCount";
import { createPiece } from "../chess_utils/createPiece";

export function gameReducer(state, { type, payload }) {
  if (type === ACTIONS.START_GAME) {
    const startingPosition = [
      createPiece(PIECE_TYPES.PAWN, "a7", false),
      createPiece(PIECE_TYPES.PAWN, "b7", false),
      createPiece(PIECE_TYPES.PAWN, "c7", false),
      createPiece(PIECE_TYPES.PAWN, "d7", false),
      createPiece(PIECE_TYPES.PAWN, "e7", false),
      createPiece(PIECE_TYPES.PAWN, "f7", false),
      createPiece(PIECE_TYPES.PAWN, "g7", false),
      createPiece(PIECE_TYPES.PAWN, "h7", false),

      createPiece(PIECE_TYPES.ROOK, "a8", false),
      createPiece(PIECE_TYPES.ROOK, "h8", false),

      createPiece(PIECE_TYPES.KNIGHT, "b8", false),
      createPiece(PIECE_TYPES.KNIGHT, "g8", false),

      createPiece(PIECE_TYPES.BISHOP, "c8", false),
      createPiece(PIECE_TYPES.BISHOP, "f8", false),

      createPiece(PIECE_TYPES.QUEEN, "d8", false),
      createPiece(PIECE_TYPES.KING, "e8", false),

      createPiece(PIECE_TYPES.PAWN, "a2", true),
      createPiece(PIECE_TYPES.PAWN, "b2", true),
      createPiece(PIECE_TYPES.PAWN, "c2", true),
      createPiece(PIECE_TYPES.PAWN, "d2", true),
      createPiece(PIECE_TYPES.PAWN, "e2", true),
      createPiece(PIECE_TYPES.PAWN, "f2", true),
      createPiece(PIECE_TYPES.PAWN, "g2", true),
      createPiece(PIECE_TYPES.PAWN, "h2", true),

      createPiece(PIECE_TYPES.ROOK, "a1", true),
      createPiece(PIECE_TYPES.ROOK, "h1", true),

      createPiece(PIECE_TYPES.KNIGHT, "b1", true),
      createPiece(PIECE_TYPES.KNIGHT, "g1", true),

      createPiece(PIECE_TYPES.BISHOP, "c1", true),
      createPiece(PIECE_TYPES.BISHOP, "f1", true),

      createPiece(PIECE_TYPES.QUEEN, "d1", true),
      createPiece(PIECE_TYPES.KING, "e1", true),
    ];
    const { pieces: piecesWithAssignedMoves } = assignAvailableSquares(
      true,
      startingPosition,
      null,
      false
    );

    const initialBoardState = {
      pieces: piecesWithAssignedMoves.map(piece => {
        return { ...piece };
      }),
      isWhiteTurn: true,
      isKingChecked: false,
      previousMovedPiece: null,
      move: null,

      //color of the captured pieces
      blackCaptures: {
        pawn: 0,
        bishop: 0,
        knight: 0,
        rook: 0,
        queen: 0,
      },
      whiteCaptures: {
        pawn: 0,
        bishop: 0,
        knight: 0,
        rook: 0,
        queen: 0,
      },
    };

    const initialCurrentBoardState = {
      ...initialBoardState,
      pieces: piecesWithAssignedMoves.map(piece => {
        return { ...piece };
      }),
      selectedPiece: null,
      streakCountWithoutPawnMoveOrCapture: 0,
    };
    delete initialCurrentBoardState.move;

    return {
      boardStates: [initialBoardState],
      currentBoardStateId: 0,
      currentBoardState: initialCurrentBoardState,
      squareColor: state.squareColor,
      pieceDesign: state.pieceDesign,
      isBoardFlipped: false,
      gameStarted: true,
      gameResult: null,
      gameResultDisplay: false,
      promotion: null,
      whitePlayer: {
        username: payload.whiteUsername,
        picture: require("../assets/default-player.png").default,
      },
      blackPlayer: {
        username: payload.blackUsername,
        picture: require("../assets/default-player.png").default,
      },
    };
  }
  if (type === ACTIONS.PLAY_AGAIN) {
    return {
      ...state,
      boardStates: [],
      currentBoardState: {
        pieces: [],
      },
      whiteUsername: state.whitePlayer.username,
      blackUsername: state.blackPlayer.username,
      gameStarted: false,
      gameResult: null,
      gameResultDisplay: false,
    };
  }
  if (type === ACTIONS.SELECT_PIECE) {
    return {
      ...state,
      currentBoardState: {
        ...state.currentBoardState,
        selectedPiece: payload.piece,
      },
    };
  }
  if (type === ACTIONS.DESELECT_PIECE) {
    return {
      ...state,
      currentBoardState: {
        ...state.currentBoardState,
        selectedPiece: null,
      },
    };
  }
  if (type === ACTIONS.MOVE_PIECE) {
    const newPieces = state.currentBoardState.pieces.map(piece => {
      return { ...piece };
    });
    let pieceToMove = newPieces.find(piece => piece.position === payload.piece.position);
    pieceToMove.position = payload.position;
    pieceToMove.didMove = true;

    const previousMovedPiece = {
      piece: { ...pieceToMove, availableSquares: [] },
      previousSquare: payload.piece.position,
    };
    return {
      ...state,
      currentBoardState: {
        ...state.currentBoardState,
        pieces: newPieces,
        previousMovedPiece: payload.registerMove
          ? previousMovedPiece
          : state.currentBoardState.previousMovedPiece,
      },
    };
  }
  if (type === ACTIONS.REMOVE_PIECE) {
    const pieceToCapture = state.currentBoardState.pieces.find(
      piece => piece.position === payload.position
    );

    const captures = pieceToCapture.isWhite
      ? { ...state.currentBoardState.whiteCaptures }
      : { ...state.currentBoardState.blackCaptures };
    captures[`${pieceToCapture.type}`] += 1;

    return {
      ...state,
      currentBoardState: {
        ...state.currentBoardState,
        pieces: state.currentBoardState.pieces.filter(piece => piece.position !== payload.position),
        [`${pieceToCapture.isWhite ? "white" : "black"}Captures`]: captures,
      },
    };
  }
  if (type === ACTIONS.FLIP_BOARD) {
    return {
      ...state,
      isBoardFlipped: !state.isBoardFlipped,
    };
  }
  if (type === ACTIONS.PROMOTE_PAWN) {
    const newPieces = state.currentBoardState.pieces.map(piece => {
      return { ...piece };
    });
    const pawnToPromote = newPieces.find(piece => piece.position === payload.position);
    pawnToPromote.type = payload.type;

    return {
      ...state,
      currentBoardState: {
        ...state.currentBoardState,
        pieces: newPieces,
        previousMovedPiece: {
          ...state.currentBoardState.previousMovedPiece,
          piece: {
            ...state.currentBoardState.previousMovedPiece.piece,
            type: payload.type,
          },
        },
      },
    };
  }
  if (type === ACTIONS.CHANGE_TURN) {
    //get check condition
    const kingChecked = isKingChecked(
      !state.currentBoardState.isWhiteTurn,
      state.currentBoardState.pieces
    );

    const { pieces: newPiecesWithAvailableSquares, hasAvailableMoves } = assignAvailableSquares(
      !state.currentBoardState.isWhiteTurn,
      state.currentBoardState.pieces,
      state.currentBoardState.previousMovedPiece,
      kingChecked
    );

    const boardStatesUntilCurrentState = state.boardStates.slice(0, state.currentBoardStateId + 1);
    function getGameResult() {
      function isDrawByInsufficientMaterial() {
        //only 2 kings
        if (state.currentBoardState.pieces.length === 2) return true;

        function hasSufficientNonBishopOrKnightMaterial(type) {
          const whitePieceCount = findPiecesByTypeAndColor(
            type,
            true,
            state.currentBoardState.pieces
          ).length;
          if (whitePieceCount > 0) return true;

          const blackPieceCount = findPiecesByTypeAndColor(
            type,
            false,
            state.currentBoardState.pieces
          ).length;
          if (blackPieceCount > 0) return true;

          return false;
        }

        if (hasSufficientNonBishopOrKnightMaterial(PIECE_TYPES.QUEEN)) return false;
        if (hasSufficientNonBishopOrKnightMaterial(PIECE_TYPES.ROOK)) return false;
        if (hasSufficientNonBishopOrKnightMaterial(PIECE_TYPES.PAWN)) return false;

        //get knight and bishop count for both sides
        function hasSufficientBishopAndKnightMaterialPerSide(isWhite) {
          const bishopCount = findPiecesByTypeAndColor(
            PIECE_TYPES.BISHOP,
            isWhite,
            state.currentBoardState.pieces
          ).length;

          const knightCount = findPiecesByTypeAndColor(
            PIECE_TYPES.KNIGHT,
            isWhite,
            state.currentBoardState.pieces
          ).length;

          if (bishopCount === 0 && knightCount === 0) return false;
          if (bishopCount === 0 && knightCount === 1) return false;
          if (bishopCount === 1 && knightCount === 0) return false;

          return true;
        }
        if (hasSufficientBishopAndKnightMaterialPerSide(true)) return false;
        if (hasSufficientBishopAndKnightMaterialPerSide(false)) return false;

        return true;
      }
      function isDrawByRepetition() {
        if (boardStatesUntilCurrentState.length <= 7) return false;
        if (
          getPositionRepeatCount(newPiecesWithAvailableSquares, boardStatesUntilCurrentState) === 3
        )
          return true;
        return false;
      }
      if (isDrawByInsufficientMaterial())
        return {
          motive: GAME_RESULTS.INSUFFICIENT_MATERIAL,
        };

      if (!hasAvailableMoves)
        if (kingChecked) {
          return {
            motive: GAME_RESULTS.CHECKMATE,
            isWhiteWinner: state.currentBoardState.isWhiteTurn,
          };
        } else {
          return {
            motive: GAME_RESULTS.STALEMATE,
          };
        }

      if (isDrawByRepetition())
        return {
          motive: GAME_RESULTS.REPETITION,
        };

      return null;
    }

    const gameResult = getGameResult();

    const newCurrentBoardState = {
      ...state.currentBoardState,
      pieces: newPiecesWithAvailableSquares,
      selectedPiece: null,
      isWhiteTurn: !state.currentBoardState.isWhiteTurn,
      isKingChecked: kingChecked,
    };

    //get move notation
    const move = getMove(
      state.boardStates[state.currentBoardStateId],
      newCurrentBoardState,
      gameResult
    );
    const newBoardState = {
      ...newCurrentBoardState,
      move,
    };
    delete newBoardState.selectedPiece;

    const newBoardStates = [...boardStatesUntilCurrentState, newBoardState];
    return {
      ...state,
      boardStates: newBoardStates,
      currentBoardState: newCurrentBoardState,
      currentBoardStateId: newBoardStates.length - 1,
      gameResult,
      gameResultDisplay: gameResult != null,
    };
  }
  if (type === ACTIONS.ASSIGN_PROMOTION) {
    return {
      ...state,
      promotion: payload.promotion,
    };
  }
  if (type === ACTIONS.UNASSIGN_PROMOTION) {
    return {
      ...state,
      promotion: null,
    };
  }
  if (type === ACTIONS.CHANGE_SQUARE_COLOR) {
    return {
      ...state,
      squareColor: payload.squareColor,
    };
  }
  if (type === ACTIONS.JUMP_TO_BOARD_STATE) {
    const newCurrentBoardState = {
      ...state.boardStates[payload.boardStateId],
      selectedPiece: null,
    };
    delete newCurrentBoardState.move;
    return {
      ...state,
      currentBoardState: newCurrentBoardState,
      currentBoardStateId: payload.boardStateId,
      gameResultDisplay: false,
    };
  }
  if (type === ACTIONS.CHANGE_PIECE_DESIGN) {
    return {
      ...state,
      pieceDesign: payload.pieceDesign,
    };
  }
  if (type === ACTIONS.RESIGN) {
    return {
      ...state,
      gameResult: {
        motive: GAME_RESULTS.RESIGNATION,
        isWhiteWinner: payload.isWhiteWinner,
      },
      gameResultDisplay: true,
    };
  }
  if (type === ACTIONS.DRAW_BY_AGREEMENT) {
    return {
      ...state,
      gameResult: { motive: GAME_RESULTS.AGREEMENT },
      gameResultDisplay: true,
    };
  }
  if (type === ACTIONS.DRAW_BY_FIFTY_MOVE_RULE) {
    return {
      ...state,
      gameResult: { motive: GAME_RESULTS.FIFTY_MOVE_RULE },
      gameResultDisplay: true,
    };
  }
  if (type === ACTIONS.CLOSE_RESULT_DISPLAY) {
    return {
      ...state,
      gameResultDisplay: false,
    };
  }
  if (type === ACTIONS.OPEN_RESULT_DISPLAY) {
    return {
      ...state,
      gameResultDisplay: true,
    };
  }
  if (type === ACTIONS.RESET_STREAK_COUNT_WITHOUT_PAWN_MOVE_OR_CAPTURE) {
    return {
      ...state,
      currentBoardState: {
        ...state.currentBoardState,
        streakCountWithoutPawnMoveOrCapture: 0,
      },
    };
  }
  if (type === ACTIONS.INCREMENT_STREAK_COUNT_WITHOUT_PAWN_MOVE_OR_CAPTURE) {
    return {
      ...state,
      currentBoardState: {
        ...state.currentBoardState,
        streakCountWithoutPawnMoveOrCapture:
          state.currentBoardState.streakCountWithoutPawnMoveOrCapture + 1,
      },
    };
  }
}
