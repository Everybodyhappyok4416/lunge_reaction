import React, { useState, useEffect, useRef, useCallback } from "react";
import "../App.css";

// 1. パーツと組み合わせの定義
const DIRECTION_PARTS = {
  forward: { text: "前" },
  backward: { text: "後" },
  left: { text: "左" },
  right: { text: "右" },
};

const LUNGE_TYPES = [
  ["forward", "left"], ["forward", "right"],
  ["left"], ["right"],
  ["backward", "left"], ["backward", "right"]
];

const RandomWord = ({ count, isBlackNormal, onFinish }) => {
  const [displayParts, setDisplayParts] = useState([]); 
  const [step, setStep] = useState(0);
  const lastDirKey = useRef("");

  const getNextState = useCallback(() => {
    // 前回と同じ組み合わせを排除
    let validOptions = LUNGE_TYPES.filter(type => type.join('') !== lastDirKey.current);
    const selectedType = validOptions[Math.floor(Math.random() * validOptions.length)];
    
    // 各文字ごとに独立して色（赤or黒）を決定
    const partsData = selectedType.map(partKey => ({
      text: DIRECTION_PARTS[partKey].text,
      color: Math.random() > 0.5 ? "black" : "red"
    }));

    return { partsData, key: selectedType.join('') };
  }, [step]);

  useEffect(() => {
    // 終了処理
    if (step >= count) {
      setDisplayParts([{ text: "Over!", color: "black" }]);
      const finalTimer = setTimeout(onFinish, 1200);
      return () => clearTimeout(finalTimer);
    }

    // 初回は0.5秒、以降は1.0~1.4秒のランダム
    const delay = step === 0 
      ? 500 
      : 4800;

    const timer = setTimeout(() => {
      const next = getNextState();
      setDisplayParts(next.partsData);
      lastDirKey.current = next.key;
      setStep(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [step, count, getNextState, onFinish]);

  return (
    <div className="fullscreen-text">
      {displayParts.map((part, i) => (
        <span key={i} style={{ color: part.color, margin: "0 5px" }}>
          {part.text}
        </span>
      ))}
    </div>
  );
};

export default RandomWord;