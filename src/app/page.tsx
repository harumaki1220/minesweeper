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

const calcBoard = (userInputs: number[][], bombMap: number[][]) => {
  const board = Array.from({ length: userInputs.length }, () =>
    Array.from({ length: userInputs[0].length }, () => 0),
  );
  const bombExplosion: [number, number][] = [];
  let booomb = false;
  const clickBomb: [number, number][] = [];
  for (let y = 0; y < userInputs.length; y++) {
    for (let x = 0; x < userInputs[0].length; x++) {
      if (bombMap[y][x] === 1) {
        bombExplosion.push([x, y]);
      }
      if (userInputs[y][x] === -1) {
        if (bombMap[y][x] === 1) {
          booomb = true;
          clickBomb.push([x, y]);
        }
        if (board[y][x] === 0) {
          const zero: [number, number][] = [];
        }
      }
    }
  }
};

const aroundBomCheck = (x: number, y: number, newbombMap: number[][]) => {
  let numbom = 0;
  // const height = newbombMap.length;
  // const width = newbombMap[0].length;
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (newbombMap[y][x] !== 1) {
        for (const [dx, dy] of directions) {
          if (newbombMap[y + dy] !== undefined) {
            if (newbombMap[y + dy][x + dx] === 1) {
              numbom++;
            }
          }
        }
        newbombMap[y][x] = numbom * 10;
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
  // 0:透明, -1:開ける, 1:旗, 2:はてな,

  // type CountMap = Record<number, number>;
  // const flat = bombMap.flat();
  // const counts = flat.reduce<CountMap>((acc, cur) => {
  //   acc[cur] = (acc[cur] || 0) + 1;
  //   return acc;
  // }, {} as CountMap);

  const leftclick = (x: number, y: number) => {
    const newbombMap = structuredClone(bombMap);
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0) {
      newuserInputs[y][x] = -1;
    }
    console.log(newuserInputs);

    const currentbombMap = bombMap;
    const first = bombMap.flat().every((value) => value === 0);
    // 一回目の左クリックで爆弾配置
    if (first) {
      let bombcount = 10;
      while (bombcount > 0) {
        const rx = Math.floor(Math.random() * 9);
        const ry = Math.floor(Math.random() * 9);
        // 初級9x9の盤面に爆弾をランダム配置
        if (newbombMap[ry][rx] === 0 && (ry !== y || rx !== x)) {
          newbombMap[ry][rx] = 1;
          bombcount--;
        }
      }
      aroundBomCheck(x, y, newbombMap);
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

  const board = calcBoard(userInputs, bombMap);

  // タイマー
  const [count, setCount] = useState(0);
  function App() {
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, []);
  }

  return (
    <div className={styles.container}>
      <div>
        <p>{count}</p>
      </div>
      <div className={styles.board}>
        {userInputs.map((row, y) =>
          row.map((value, x) => (
            <button
              className={styles.block}
              key={`${x}-${y}`}
              onClick={() => leftclick(x, y)}
              onContextMenu={(event) => rightclick(x, y, event)}
              style={{
                backgroundPosition: `${value === 1 ? -270 : value === 2 ? -240 : 30}px`,
                opacity: value === -1 ? 0 : 1,
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
                backgroundPosition: `${value === 1 ? -300 : value === 10 ? 0 : value === 20 ? -30 : value === 30 ? -60 : value === 40 ? -90 : value === 50 ? -120 : value === 60 ? -150 : value === 70 ? -180 : value === 80 ? -210 : 30}px`,
              }}
            />
          )),
        )}
      </div>
      {/* <button onClick={clickHandler}>クリック</button> */}
    </div>
  );
}
