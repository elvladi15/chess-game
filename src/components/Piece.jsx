import { useGame } from "../context/GameContext";

export function Piece({ type, isWhite }) {
  const { pieceDesign } = useGame();

  const pieceSrc = require(`../assets/${pieceDesign}-design/${type}_${
    isWhite ? "white" : "black"
  }.png`).default;
  return <img src={pieceSrc} alt="" />;
}
