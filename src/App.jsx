import React, { useState } from "react";
import Countdown from "./components/Countdown";
import RandomWord from "./components/RandomWord";
import Finish from "./components/Finish";
import "./App.css";

const App = () => {
  const [stage, setStage] = useState("start");
  const [isBlackNormal, setIsBlackNormal] = useState(true);

  return (
    <div className="app-container">
      {stage === "start" && (
        <div className="start-container">
          <button
            className="start-button"
            onClick={() => setStage("countdown")}
          >
            Lunge Reaction
          </button>
        </div>
      )}
      {stage === "countdown" && (
        <Countdown
          onFinish={(rule) => {
            setIsBlackNormal(rule);
            setStage("random");
          }}
        />
      )}
      {stage === "random" && (
        <RandomWord
          count={10} // 回数
          isBlackNormal={isBlackNormal}
          onFinish={() => setStage("finish")}
        />
      )}
      {stage === "finish" && <Finish onRestart={() => setStage("start")} />}
    </div>
  );
};

export default App;