'use client';

import { useState } from 'react';
import styles from './page.module.css';

const calcTotalPoint = (arr: number[], counter: number) => {
  const total = arr.reduce((k, i) => {
    return k + i;
  });
  return total + counter;
};
const down = (n: number) => {
  if (n >= 0) {
    console.log(n);
    down(n - 1);
  }
};
down(10);
const sum1 = (n: number): number => {
  if (n > 0) {
    return n + sum1(n - 1);
  } else {
    return n;
  }
};
console.log(sum1(10));
const sum2 = (n: number, n1: number): number => {
  return n < n1 ? n + sum2(n + 1, n1) : n;
};
console.log(sum2(4, 10)); //49
const sum3 = (n: number, n1: number): number => {
  return ((n1 - n + 1) / 2) * (n + n1);
};
console.log(sum3(4, 10)); //49
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
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    newuserInputs[y][x] = 1;
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

  console.log(userInputs);
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
      </div>
      {/* <button onClick={clickHandler}>クリック</button> */}
    </div>
  );
}
