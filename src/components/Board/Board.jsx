import { useGame, useGameUpdate } from "../../context/GameContext";
import PromoteSelection from "../PromoteSelection/PromoteSelection";
import Square from "../Square/Square";
import "./Board.css";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import GameStarting from "../GameStarting/GameStarting";
import { ACTIONS, COLUMNS, PIECE_TYPES } from "../../constants";
import { Piece } from "../Piece";
import GameFinished from "../GameFinished/GameFinished";

export function Board() {
  const {
    currentBoardState,
    isBoardFlipped,
    promotion,
    whitePlayer,
    blackPlayer,
    gameStarted,
    gameResult,
    gameResultDisplay,
  } = useGame();
  const { whiteCaptures, blackCaptures } = currentBoardState;
  const dispatch = useGameUpdate();

  const rows = [8, 7, 6, 5, 4, 3, 2, 1];

  const rowsStyle = {
    flexDirection: isBoardFlipped ? "column-reverse" : "column",
  };
  const columnsStyle = {
    flexDirection: isBoardFlipped ? "row-reverse" : "row",
  };
  const rotateIconStyle = {
    fill: "#fff",
    position: "absolute",
    top: "-2.5rem",
    right: 0,
    cursor: "pointer",
    transform: "scale(1.5)",
  };
  function createSquares(columns, rows, isBoardFlipped) {
    let squares = [];
    for (const row of rows) {
      for (const column of columns) {
        squares.push(<Square key={`${column}${row}`} position={`${column}${row}`} />);
      }
    }
    if (isBoardFlipped) {
      squares = squares.reverse();
    }
    return squares;
  }
  function flipBoard() {
    if (!gameStarted) return;
    dispatch({ type: ACTIONS.FLIP_BOARD });
  }
  function renderPlayer(isWhite) {
    const player = isWhite ? whitePlayer : blackPlayer;
    const capturedPieces = isWhite ? blackCaptures : whiteCaptures;

    function resign() {
      if (gameResult != null) return;
      const confirm = window.confirm(
        `${player.username}, Are you sure you want to resign the game?`
      );
      if (confirm) {
        dispatch({ type: ACTIONS.RESIGN, payload: { isWhiteWinner: !isWhite } });
      }
    }
    function offerDraw() {
      if (gameResult != null) return;
      const confirm = window.confirm(
        `${isWhite ? blackPlayer.username : whitePlayer.username}, do you agree to draw the game?`
      );
      if (confirm) {
        dispatch({ type: ACTIONS.DRAW_BY_AGREEMENT });
      }
    }
    return (
      <div className="player">
        <img src={player?.picture} alt="" className="player__picture" />
        <div className="player__detail">
          <label>{player?.username}</label>
          <button className="resign-btn" onClick={resign}>
            Resign
          </button>
          <button className="offer-draw-btn" onClick={offerDraw}>
            Offer draw
          </button>
          <div className="captured-pieces">
            <div className="captured-piece-group">
              {[...Array(capturedPieces.pawn)].map((_, index) => (
                <Piece key={index} type={PIECE_TYPES.PAWN} isWhite={!isWhite} />
              ))}
            </div>
            <div className="captured-piece-group">
              {[...Array(capturedPieces.bishop)].map((_, index) => (
                <Piece key={index} type={PIECE_TYPES.BISHOP} isWhite={!isWhite} />
              ))}
            </div>
            <div className="captured-piece-group">
              {[...Array(capturedPieces.knight)].map((_, index) => (
                <Piece key={index} type={PIECE_TYPES.KNIGHT} isWhite={!isWhite} />
              ))}
            </div>
            <div className="captured-piece-group">
              {[...Array(capturedPieces.rook)].map((_, index) => (
                <Piece key={index} type={PIECE_TYPES.ROOK} isWhite={!isWhite} />
              ))}
            </div>
            <div className="captured-piece-group">
              {[...Array(capturedPieces.queen)].map((_, index) => (
                <Piece key={index} type={PIECE_TYPES.QUEEN} isWhite={!isWhite} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  function gameStateRendering() {
    if (!gameStarted) return <GameStarting />;
    if (gameResultDisplay) return <GameFinished />;
  }
  return (
    <div className="board-wrapper">
      <div className="container">
        {gameStarted ? renderPlayer(isBoardFlipped) : null}

        <div className="board">
          {createSquares(COLUMNS, rows, isBoardFlipped)}

          {gameStateRendering()}

          {
            <div className="rows" style={rowsStyle}>
              {rows.map(row => (
                <div key={row}>{row}</div>
              ))}
            </div>
          }

          {
            <div className="columns" style={columnsStyle}>
              {COLUMNS.map(column => (
                <div key={column}>{column}</div>
              ))}
            </div>
          }
          {promotion == null ? null : <PromoteSelection />}
          {<AutorenewIcon style={rotateIconStyle} onClick={() => flipBoard()} />}
        </div>

        {gameStarted ? renderPlayer(!isBoardFlipped) : null}
      </div>
    </div>
  );
}
