import React, { useState, useEffect, useRef, useCallback } from "react";
import "../App.css";

// 1. 矢印と逆方向の定義（コンポーネントの外で定義）
const ARROW_PARTS = [
  { normal: "↖︎", reverse: "↘︎" },
  { normal: "↗︎", reverse: "↙︎" },
  { normal: "↘︎", reverse: "↖︎" },
  { normal: "↙︎", reverse: "↗︎" },
  { normal: "←", reverse: "→" },
  { normal: "→", reverse: "←" },
];

const RandomWord = ({ count, isBlackNormal, onFinish }) => {
  // 初期値をオブジェクトにしておくことで、初回レンダリング時のエラーを防ぐ
  const [displayData, setDisplayData] = useState({
    displayText: "",
    color: "black",
  });
  const [step, setStep] = useState(0);
  const lastText = useRef("");

  const getNextState = useCallback(() => {
    // 1. 前回と違う「normal」を持つ矢印に絞る
    const availableOptions = ARROW_PARTS.filter(
      (arrow) => arrow.normal !== lastText.current,
    );

    // 2. 絞り込まれた中からランダムに選択
    const selectedArrow =
      availableOptions[Math.floor(Math.random() * availableOptions.length)];

    // 3. 次回のために、選択した矢印を「前回の値」として保存
    lastText.current = selectedArrow.normal;

    const color = Math.random() > 0.5 ? "black" : "red";

    // 4. 反転ロジック
    const isNormalMode = isBlackNormal ? color === "black" : color === "red";
    const displayText = isNormalMode
      ? selectedArrow.normal
      : selectedArrow.reverse;

    return { displayText, color };
  }, [isBlackNormal]);

  useEffect(() => {
    // 終了処理
    if (step >= count) {
      setDisplayData({ displayText: "Over!", color: "black" });
      const finalTimer = setTimeout(onFinish, 1200);
      return () => clearTimeout(finalTimer);
    }

    // 初回は0.5秒、以降は4.8秒固定
    const delay = step === 0 ? 500 : 4800;

    const timer = setTimeout(() => {
      const next = getNextState();
      setDisplayData(next); // nextオブジェクトをそのままセット
      setStep((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [step, count, getNextState, onFinish]);

  return (
    <div
      className="fullscreen-text"
      style={{
        color: displayData.color,
        fontSize: "10rem", // 矢印は見やすさ重視でさらに巨大化
        fontWeight: "900",
      }}
    >
      {displayData.displayText}
    </div>
  );
};

export default RandomWord;
