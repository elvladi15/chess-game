import { createContext, useContext, useReducer } from "react";
import { gameReducer } from "./GameReducer";
import { PIECE_DESIGNS, SQUARE_COLORS } from "../constants";

const GameContext = createContext();
const GameContextUpdate = createContext();

export function useGame() {
  return useContext(GameContext);
}
export function useGameUpdate() {
  return useContext(GameContextUpdate);
}

export default function GameContextProvider({ children }) {
  const INITIAL_STATE = JSON.parse(localStorage.getItem("state")) ?? {
    boardStates: [],
    currentBoardState: {
      pieces: [],
    },
    squareColor: SQUARE_COLORS.PATTERN_1,
    pieceDesign: PIECE_DESIGNS.CLASSIC,
    whiteUsername: "",
    blackUsername: "",
    gameStarted: false,
    gameResult: null,
    gameResultDisplay: false,
  };

  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  return (
    <GameContext.Provider value={state}>
      <GameContextUpdate.Provider value={dispatch}>{children}</GameContextUpdate.Provider>
    </GameContext.Provider>
  );
}
