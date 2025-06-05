'use client';

import { useState } from 'react';
import styles from './page.module.css';
let count = 0;
// ユーザーの操作、爆弾の位置
// userInputs,bombMap,
const calcBoard = (userInputs: number[][], bombMap: number[][]) => {};

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

  const leftclick = (x: number, y: number) => {
    let rx = 0;
    let ry = 0;
    let bombcount = 0;
    const newbombMap = structuredClone(bombMap);
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0) {
      newuserInputs[y][x] = 1;
      count += 1;
    }
    if (count === 1) {
      while (bombcount < 11) {
        rx = Math.floor(Math.random() * 9);
        ry = Math.floor(Math.random() * 9);
        console.log(bombcount);
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

  const calcBoard = (userInputs: number[][], bombMap: number[][]) => {
    const newBoard = Array.from({ length: userInputs.length }, () =>
      Array.from({ length: userInputs[0].length }, () => 0),
    );
  };
  const board = calcBoard(userInputs, bombMap);

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
        {bombMap.map((row, y) =>
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
