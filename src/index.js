import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import GameContextProvider from "./context/GameContext";

ReactDOM.render(
  <GameContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GameContextProvider>,
  document.getElementById("root")
);
