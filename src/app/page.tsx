'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

const directions = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
];

const difficulty_levels = {
  beginner: { width: 9, height: 9, bombs: 10 },
  intermediate: { width: 16, height: 16, bombs: 40 },
  advanced: { width: 30, height: 16, bombs: 99 },
};

//指定されたサイズの空の盤面を作成
const createEmptyBoard = (height: number, width: number, fillValue: number = 0): number[][] => {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fillValue));
};

const calcBoard = (userInputs: number[][], bombMap: number[][]) => {
  const newcalc = structuredClone(bombMap);
  const h = userInputs.length;
  const w = userInputs[0].length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (userInputs[y][x] === -1) {
        newcalc[y][x] = bombMap[y][x] - 1;
      } else {
        newcalc[y][x] = userInputs[y][x];
      }
    }
  }
  console.log(bombMap);
  console.log(newcalc);
  return newcalc;
};

const aroundBomCheck = (newbombMap: number[][]) => {
  const h = newbombMap.length;
  const w = newbombMap[0].length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (newbombMap[y][x] !== 10) {
        let numbom = 0;
        for (const [dx, dy] of directions) {
          const ny = y + dy;
          const nx = x + dx;
          // xとyの両方で、盤面の範囲内にあるかを確認する
          if (ny >= 0 && ny < h && nx >= 0 && nx < w && newbombMap[ny][nx] === 10) {
            numbom++;
          }
        }
        newbombMap[y][x] = numbom * 100;
        // numbom * 100 - 1の値で爆弾数表示
      }
    }
  }
};

// 再帰関数
const openRecursive = (x: number, y: number, bombMap: number[][], userInputs: number[][]) => {
  const h = userInputs.length;
  const w = userInputs[0].length;
  if (x < 0 || x >= w || y < 0 || y >= h || userInputs[y][x] !== 0) {
    return;
  }
  userInputs[y][x] = -1;

  //8方向にボムが無いなら、再帰的に周囲のセルを開ける
  if (bombMap[y][x] === 0) {
    for (const [dx, dy] of directions) {
      const isDiagonal = dx !== 0 && dy !== 0;

      // もし進む方向が「斜め」の場合
      if (isDiagonal) {
        // 右下に進む場合、右のマスと下のマスが両方とも爆弾だと道が塞がれていると判断
        const isPathClear = bombMap[y]?.[x + dx] !== 10 || bombMap[y + dy]?.[x] !== 10;

        if (isPathClear) {
          openRecursive(x + dx, y + dy, bombMap, userInputs);
        }
      } else {
        openRecursive(x + dx, y + dy, bombMap, userInputs);
      }
    }
  }
};

export default function Home() {
  const [settings, setSettings] = useState(difficulty_levels.beginner);
  const [bombMap, setBombMap] = useState(() => createEmptyBoard(settings.height, settings.width));
  const [userInputs, setUserInputs] = useState(() =>
    createEmptyBoard(settings.height, settings.width),
  );
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  // 難易度が変更された時にゲームをリセットする
  useEffect(() => {
    setBombMap(createEmptyBoard(settings.height, settings.width));
    setUserInputs(createEmptyBoard(settings.height, settings.width));
    setGameState('playing');
  }, [settings]);

  // タイマー
  const [count, setCount] = useState(0);

  const leftclick = (x: number, y: number) => {
    const newbombMap = structuredClone(bombMap);
    let currentBombMap = bombMap;
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);

    // 爆弾があったらゲームオーバー
    // if (bombMap[y][x] === 10) {
    //   alert('GAME OVER!');
    // 全ての爆弾を表示する処理を入れる
    //   setuserInputs(newuserInputs);
    //   return;
    // }

    const firstClick = bombMap.flat().every((value) => value === 0);
    // 一回目の左クリックで爆弾配置
    if (firstClick) {
      let bombcount = settings.bombs;
      while (bombcount > 0) {
        const rx = Math.floor(Math.random() * userInputs[0].length);
        const ry = Math.floor(Math.random() * userInputs.length);
        // h x wの盤面に爆弾をランダム配置
        if (newbombMap[ry][rx] === 0 && (ry !== y || rx !== x)) {
          newbombMap[ry][rx] = 10;
          bombcount--;
        }
      }
      aroundBomCheck(newbombMap);
      setBombMap(newbombMap);
      currentBombMap = newbombMap;
    }
    openRecursive(x, y, currentBombMap, newuserInputs);
    setUserInputs(newuserInputs);
  };

  const rightclick = (x: number, y: number, event: React.MouseEvent) => {
    event?.preventDefault();
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0 || newuserInputs[y][x] === 1 || newuserInputs[y][x] === 2)
      newuserInputs[y][x] = (newuserInputs[y][x] + 1) % 3;
    setUserInputs(newuserInputs);
  };

  // const board = calcBoard(userInputs, bombMap);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCount((prevCount) => prevCount + 1);
  //   }, 1000);

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, []);

  return (
    <div className={styles.container}>
      <div>
        <button onClick={() => setSettings(difficulty_levels.beginner)}>初級</button>
        <button onClick={() => setSettings(difficulty_levels.intermediate)}>中級</button>
        <button onClick={() => setSettings(difficulty_levels.advanced)}>上級</button>
      </div>
      <div>
        <p>{count}</p>
      </div>
      <div
        className={styles.board}
        style={{
          width: settings.width * 30,
          height: settings.height * 30,
        }}
      >
        {calcBoard(userInputs, bombMap).map((row, y) =>
          row.map((value, x) => (
            <button
              className={styles.block}
              key={`${x}-${y}`}
              onClick={() => leftclick(x, y)}
              onContextMenu={(event) => rightclick(x, y, event)}
              style={{
                border:
                  value === 0
                    ? '4px solid #808080'
                    : value === 1
                      ? '4px solid #808080'
                      : value === 2
                        ? '4px solid #808080'
                        : '1px solid #808080',
                borderTopColor:
                  value === 0 ? '#fff' : value === 1 ? '#fff' : value === 2 ? '#fff' : '#808080',
                borderLeftColor:
                  value === 0 ? '#fff' : value === 1 ? '#fff' : value === 2 ? '#fff' : '#808080',
                backgroundColor: value === 9 ? 'red' : '#c6c6c6',
              }}
            >
              <div
                className={styles.cell}
                style={{
                  backgroundPosition: `${value === 9 ? -300 : value === 99 ? 0 : value === 199 ? -30 : value === 299 ? -60 : value === 399 ? -90 : value === 499 ? -120 : value === 599 ? -150 : value === 699 ? -180 : value === 799 ? -210 : value === 1 ? -270 : value === 2 ? -240 : value === -1 ? 30 : 30}px`,
                }}
              />
            </button>
          )),
        )}
      </div>
    </div>
  );
}
