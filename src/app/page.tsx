'use client';

import { useState } from 'react';
import styles from './page.module.css';
let first = 0;

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

// ユーザーの操作、爆弾の位置
// userInputs,bombMap,
const calc = (userInputs: number[][], bombMap: number[][]) => {
  const newcalc = structuredClone(bombMap);
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      newcalc[y][x] = userInputs[y][x] + bombMap[y][x];
    }
  }
  return newcalc;
};

const bomcalc = (userInputs: number[][], bombMap: number[][]) => {};

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
  //0:セーフ, 1:爆弾

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
  ]); //初級,9×9,ボム10
  // 0:透明, 1:開ける, 2:旗, 3:はてな,の予定

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

  const leftclick = (x: number, y: number) => {
    let rx = 0;
    let ry = 0;
    let bombcount = 0;
    const newbombMap = structuredClone(bombMap);
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0) {
      newuserInputs[y][x] = 1;
      first += 1;
    }
    // 一回目の左クリックで爆弾配置
    if (first === 1) {
      while (bombcount < 11) {
        rx = Math.floor(Math.random() * 9);
        ry = Math.floor(Math.random() * 9);
        // 初級9x9の盤面に爆弾をランダム配置
        if (newbombMap[ry][rx] === 0) {
          newbombMap[ry][rx] = 1;
          bombcount += 1;
        }
        if (bombcount === 10) {
          console.log(newbombMap);
          setbombMap(newbombMap);
          break;
        }
      }
    }

    setuserInputs(newuserInputs);
  };

  const rightclick = (x: number, y: number, event: React.MouseEvent) => {
    event?.preventDefault();
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0) {
      newuserInputs[y][x] = 2;
    } else if (newuserInputs[y][x] === 2) {
      newuserInputs[y][x] = 3;
    } else if (newuserInputs[y][x] === 3) {
      newuserInputs[y][x] = 0;
    }
    setuserInputs(newuserInputs);
  };

  const board = calc(userInputs, bombMap);

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {userInputs.map((row, y) =>
          row.map((value, x) => (
            <div
              className={styles.block}
              key={`${x}-${y}`}
              onClick={() => leftclick(x, y)}
              onContextMenu={(event) => rightclick(x, y, event)}
              style={{
                backgroundPosition: `${value === 2 ? -270 : value === 3 ? -240 : 30}px`,
                opacity: value === 1 ? 0 : 1,
              }}
            />
          )),
        )}
        {board.map((row, y) =>
          row.map((value, x) => (
            <div
              className={styles.undercell}
              key={`${x}-${y}`}
              onClick={() => leftclick(x, y)}
              onContextMenu={(event) => rightclick(x, y, event)}
              style={{
                backgroundPosition: `${value === 1 ? -300 : 30}px`,
              }}
            />
          )),
        )}
      </div>
      {/* <button onClick={clickHandler}>クリック</button> */}
    </div>
  );
}

// 再起関数
