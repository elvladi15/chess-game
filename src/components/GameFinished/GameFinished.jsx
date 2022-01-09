import "./GameFinished.css";
import { useGame, useGameUpdate } from "../../context/GameContext";
import { ACTIONS, GAME_RESULTS } from "../../constants";
export default function GameFinished() {
  const { gameResult } = useGame();
  const dispatch = useGameUpdate();

  function getFinalResult() {
    let finalResult = "Draw!";
    if (
      gameResult.motive === GAME_RESULTS.CHECKMATE ||
      gameResult.motive === GAME_RESULTS.RESIGNATION
    ) {
      finalResult = `${gameResult.isWhiteWinner ? "White" : "Black"} wins!`;
    }
    return finalResult;
  }
  function closeBox() {
    dispatch({ type: ACTIONS.CLOSE_RESULT_DISPLAY });
  }
  function playAgain() {
    const confirm = window.confirm("Are you sure you want to play again?");
    if (confirm)
      dispatch({
        type: ACTIONS.PLAY_AGAIN,
      });
  }
  return (
    <div className="game-finished">
      <button className="close-box" onClick={closeBox}>
        X
      </button>
      <h1>{getFinalResult()}</h1>
      <h2>{`by ${gameResult.motive}`}</h2>
      <button className="play-again-result-btn" onClick={playAgain}>
        Play again!
      </button>
    </div>
  );
}
