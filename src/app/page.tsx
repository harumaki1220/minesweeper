'use client';
import { useState } from 'react';
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

const calcBoard = (userInputs: number[][], bombMap: number[][]) => {
  const newcalc = structuredClone(bombMap);
  const h = userInputs.length;
  const w = userInputs[0].length;
  console.log(userInputs);
  console.log(bombMap);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      newcalc[y][x] = userInputs[y][x] + bombMap[y][x];
      console.log(newcalc);
    }
  }
  return newcalc;
};

const aroundBomCheck = (newbombMap: number[][]) => {
  let numbom = 0;
  const h = newbombMap.length;
  const w = newbombMap[0].length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (newbombMap[y][x] !== 10) {
        for (const [dx, dy] of directions) {
          if (newbombMap[y + dy] !== undefined) {
            if (newbombMap[y + dy][x + dx] === 10) {
              numbom++;
            }
          }
        }
        newbombMap[y][x] = numbom * 100;
        numbom = 0;
      }
    }
  }
};

// 再起関数
// for (let y = 0; y < 9; y++) {
//   for (let x = 0; x < 9; x++) {
//   }
// }

export default function Home() {
  const [bombMap, setbombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  //0:セーフ, 10:爆弾

  const [userInputs, setuserInputs] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]); //初級,9×9,ボム10個
  // 0:透明, -1:開ける, 1:旗, 2:はてな,

  // タイマー
  const [count, setCount] = useState(0);

  const leftclick = (x: number, y: number) => {
    const newbombMap = structuredClone(bombMap);
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0) {
      newuserInputs[y][x] = -1;
    }

    const first = bombMap.flat().every((value) => value === 0);
    // 一回目の左クリックで爆弾配置
    if (first) {
      let bombcount = 10;
      while (bombcount > 0) {
        const rx = Math.floor(Math.random() * 9);
        const ry = Math.floor(Math.random() * 9);
        // 初級9x9の盤面に爆弾をランダム配置
        if (newbombMap[ry][rx] === 0 && (ry !== y || rx !== x)) {
          newbombMap[ry][rx] = 10;
          bombcount--;
        }
      }
      aroundBomCheck(newbombMap);
      setbombMap(newbombMap);
    }
    setuserInputs(newuserInputs);
  };

  const rightclick = (x: number, y: number, event: React.MouseEvent) => {
    event?.preventDefault();
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0 || newuserInputs[y][x] === 1 || newuserInputs[y][x] === 2)
      newuserInputs[y][x] = (newuserInputs[y][x] + 1) % 3;
    setuserInputs(newuserInputs);
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
        <p>{count}</p>
      </div>
      <div className={styles.board}>
        {calcBoard(userInputs, bombMap).map((row, y) =>
          row.map((value, x) => (
            <button
              className={styles.block}
              key={`${x}-${y}`}
              onClick={() => leftclick(x, y)}
              onContextMenu={(event) => rightclick(x, y, event)}
              style={{
                opacity: value === -1 ? 0 : 1,
              }}
            >
              <div
                className={styles.undercell}
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
