'use client';
import { useEffect, useState } from 'react';
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
      if (userInputs[y][x] === 2 || userInputs[y][x] === 3) {
        newcalc[y][x] = userInputs[y][x];
        continue;
      }
      if (newcalc[y][x] === userInputs[y][x]) {
        continue;
      }
      newcalc[y][x] = userInputs[y][x] + bombMap[y][x];
    }
  }
  return newcalc;
};

const bomcalc = (userInputs: number[][], bombMap: number[][]) => {
  const newcalc = structuredClone(bombMap);
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      newcalc[y][x] = bombMap[y][x] + userInputs[y][x];
    }
  }
};

const bom = (b: number[][]) => {
  const newbom = structuredClone(b);
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      let notice = 0;
      if (newbom[y][x] !== 1) {
        for (const [dy, dx] of directions) {
          if (newbom[y + dy] !== undefined) {
            if (newbom[y + dy][x + dx] === 1) {
              notice += 1;
            }
          }
        }
        // if (notice !== 0) {}
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
  // 0:透明, 10:開ける, 2:旗, 3:はてな,の予定(calcの影響により一旦1 => 10に変更)

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

  type CountMap = Record<number, number>;
  const flat = bombMap.flat();
  const counts = flat.reduce<CountMap>((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {} as CountMap);

  const leftclick = (x: number, y: number) => {
    let rx = 0;
    let ry = 0;
    let bombcount = 0;
    const newbombMap = structuredClone(bombMap);
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    if (newuserInputs[y][x] === 0) {
      newuserInputs[y][x] = 10;
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

  const [count, setCount] = useState(0);
  function App() {
    useEffect(() => {
      const timerId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);

      return () => {
        clearInterval(timerId);
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
                backgroundPosition: `${value === 2 ? -270 : value === 3 ? -240 : 30}px`,
                opacity: value === 10 ? 0 : 1,
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
