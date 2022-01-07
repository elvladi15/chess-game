import { useState } from "react";
import { ACTIONS } from "../../constants";
import { useGame, useGameUpdate } from "../../context/GameContext";
import "./GameStarting.css";

export default function GameStarting() {
  const { whiteUsername: wname, blackUsername: bname } = useGame();
  const dispatch = useGameUpdate();
  const [whiteUsername, setWhiteUsername] = useState(wname);
  const [blackUsername, setBlackUsername] = useState(bname);

  function startGame() {
    dispatch({
      type: ACTIONS.START_GAME,
      payload: {
        whiteUsername,
        blackUsername,
      },
    });
  }
  return (
    <form className="game-starting" onSubmit={() => startGame()}>
      <h1>New Chess Game</h1>

      <div className="field">
        <label>Enter white player username</label>
        <input
          type="text"
          placeholder="White player username"
          onChange={e => setWhiteUsername(e.target.value)}
          value={whiteUsername}
          required
        />
      </div>

      <div className="field">
        <label>Enter black player username</label>
        <input
          type="text"
          placeholder="Black player username"
          onChange={e => setBlackUsername(e.target.value)}
          value={blackUsername}
          required
        />
      </div>

      <button type="submit" className="start-btn">
        Start Game!
      </button>
    </form>
  );
}
