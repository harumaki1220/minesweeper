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
  const hundleclick = (x: number, y: number) => {};
  const [board, setboard] = useState([
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
  // 0:透明, 1:旗, 2:はてな,の予定

  const [samplePoints, setSamplePoints] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  console.log(samplePoints);
  const [sampleCounter, setSampleCounter] = useState(0);
  console.log(sampleCounter);
  const clickHandler = () => {
    const newSamplePoints = structuredClone(samplePoints);
    newSamplePoints[sampleCounter] += 1;
    setSamplePoints(newSamplePoints);
    setSampleCounter((sampleCounter + 1) % 14);
  };
  const totalPoint = calcTotalPoint(samplePoints, sampleCounter);
  console.log(totalPoint);
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.block}
              key={`${x}-${y}`}
              onClick={() => hundleclick(x, y)}
              style={{ backgroundPosition: `${-30 * sampleCounter}px` }}
            />
          )),
        )}
        <div
          className={styles.sampleCell}
          style={{ backgroundPosition: `${-30 * sampleCounter}px` }}
        />
      </div>
      <button onClick={clickHandler}>クリック</button>
    </div>
  );
}
