import "./Game.css";
import { useGame, useGameUpdate } from "../../context/GameContext";
import { Board } from "../Board/Board";
import { useLayoutEffect, useRef } from "react";
import { ACTIONS, PIECE_DESIGNS, SQUARE_COLORS } from "../../constants";

export default function Game() {
  const {
    boardStates,
    currentBoardStateId,
    squareColor: stateSquareColor,
    pieceDesign: statePieceDesign,
    gameStarted,
    gameResult,
    gameResultDisplay,
  } = useGame();
  const dispatch = useGameUpdate();

  function changeSquareColor(squareColor) {
    if (!gameStarted) return;
    if (stateSquareColor === squareColor) return;
    dispatch({ type: ACTIONS.CHANGE_SQUARE_COLOR, payload: { squareColor } });
  }
  function changePieceDesign(pieceDesign) {
    if (!gameStarted) return;
    if (statePieceDesign === pieceDesign) return;
    dispatch({ type: ACTIONS.CHANGE_PIECE_DESIGN, payload: { pieceDesign } });
  }
  function jumpToBoardState(boardStateId) {
    if (!gameStarted) return;
    dispatch({
      type: ACTIONS.JUMP_TO_BOARD_STATE,
      payload: { boardStateId },
    });
  }
  function openResultDisplay() {
    if (gameResultDisplay) return;
    dispatch({ type: ACTIONS.OPEN_RESULT_DISPLAY });
  }
  function playAgain() {
    const confirm = window.confirm("Are you sure you want to play again?");
    if (confirm)
      dispatch({
        type: ACTIONS.PLAY_AGAIN,
      });
  }
  const moves = boardStates.slice(1).map(boardState => boardState.move);
  const movesRows = [];
  for (let i = 1; i <= Math.round(moves.length / 2); i++) {
    movesRows.push(i);
  }
  const movesRef = useRef();

  useLayoutEffect(() => {
    movesRef.current.scrollTop = movesRef.current.scrollHeight;
  }, [boardStates]);
  return (
    <div className="game">
      <Board />
      <div className="game__details">
        <div className="container">
          {gameResult == null ? null : (
            <section className="game__details__section">
              <div className="game-finished-btns">
                <button className="game-results-btn" onClick={openResultDisplay}>
                  Watch game results
                </button>
                <button className="play-again-btn" onClick={playAgain}>
                  Play again!
                </button>
              </div>
            </section>
          )}
          <section className="game__details__section">
            <h2>Moves</h2>
            <div className="moves" ref={movesRef}>
              <table>
                <tbody>
                  {movesRows.map(movesRow => {
                    const whiteMoveIndex = (movesRow - 1) * 2;
                    const blackMoveIndex = whiteMoveIndex + 1;
                    return (
                      <tr key={movesRow}>
                        <td className="moves__rows">{`${movesRow}.`}</td>
                        <td className="moves__columns">
                          <button
                            className={
                              currentBoardStateId === whiteMoveIndex + 1
                                ? "selected-state"
                                : "unselected-state"
                            }
                            onClick={() => jumpToBoardState(whiteMoveIndex + 1)}
                          >
                            {moves[whiteMoveIndex]}
                          </button>
                        </td>
                        <td className="moves__columns">
                          <button
                            className={
                              currentBoardStateId === blackMoveIndex + 1
                                ? "selected-state"
                                : "unselected-state"
                            }
                            onClick={() => jumpToBoardState(blackMoveIndex + 1)}
                          >
                            {moves[blackMoveIndex]}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="game__details__section">
            <h2>Change square colors</h2>
            <div className="square-color-btns">
              <button
                onClick={() => changeSquareColor(SQUARE_COLORS.PATTERN_1)}
                className="pattern-1"
              >
                Pattern 1
              </button>
              <button
                onClick={() => changeSquareColor(SQUARE_COLORS.PATTERN_2)}
                className="pattern-2"
              >
                Pattern 2
              </button>
              <button
                onClick={() => changeSquareColor(SQUARE_COLORS.PATTERN_3)}
                className="pattern-3"
              >
                Pattern 3
              </button>
            </div>
          </section>

          <section className="game__details__section">
            <h2>Change piece design</h2>
            <div className="piece-design-btns">
              <button onClick={() => changePieceDesign(PIECE_DESIGNS.CLASSIC)}>Design 1</button>
              <button onClick={() => changePieceDesign(PIECE_DESIGNS.SOLID)}>Design 2</button>
            </div>
          </section>

          <section className="game__details__section">
            <h2>Change board state</h2>
            <div className="board-state-change-btns">
              <button
                disabled={currentBoardStateId === 0}
                onClick={() => jumpToBoardState(currentBoardStateId - 1)}
              >
                Undo
              </button>
              <button
                disabled={currentBoardStateId === boardStates.length - 1}
                onClick={() => jumpToBoardState(currentBoardStateId + 1)}
              >
                Redo
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
