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
  const validHeight = Math.max(1, height);
  const validWidth = Math.max(1, width);
  // ここで負の値を指定できないようにする
  return Array.from({ length: validHeight }, () =>
    Array.from({ length: validWidth }, () => fillValue),
  );
};

const calcBoard = (
  userInputs: number[][],
  bombMap: number[][],
  gameState: 'playing' | 'won' | 'lost',
) => {
  if (!userInputs || userInputs.length === 0) return [];

  const displayBoard = createEmptyBoard(userInputs.length, userInputs[0].length);
  const h = userInputs.length;
  const w = userInputs[0].length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // プレイ中の表示ロジック
      if (userInputs[y][x] === -1) {
        displayBoard[y][x] = bombMap[y][x] - 1; // 開いたセル
      } else {
        displayBoard[y][x] = userInputs[y][x]; // 旗、？、初期状態
      }
      if (gameState === 'lost') {
        if (userInputs[y][x] === -2) {
          displayBoard[y][x] = 8; // 踏んだ爆弾
        } else if (bombMap[y][x] === 10 && userInputs[y][x] !== 1) {
          displayBoard[y][x] = 9; // 踏んでいない他の爆弾
        } else if (bombMap[y][x] !== 10 && userInputs[y][x] === 1) {
          displayBoard[y][x] = 11; // 間違った旗
        }
      }
    }
  }
  return displayBoard;
};

const aroundBomCheck = (newbombMap: number[][]) => {
  if (!newbombMap || newbombMap.length === 0) return;
  const h = newbombMap.length;
  const w = newbombMap[0].length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (newbombMap[y][x] !== 10) {
        let numbom = 0;
        for (const [dx, dy] of directions) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w && newbombMap[ny][nx] === 10) {
            numbom++;
          }
        }
        newbombMap[y][x] = numbom * 100;
      }
    }
  }
};

// 再帰関数
const openRecursive = (x: number, y: number, bombMap: number[][], userInputs: number[][]) => {
  if (!userInputs || userInputs.length === 0) return;
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
  const [customSettings, setCustomSettings] = useState({ width: 10, height: 10, bombs: 10 });
  const [custom, setCustom] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  // タイマー
  const [count, setCount] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const flagCount = userInputs.flat().filter((cell) => cell === 1).length;
  const remainingBombs = settings.bombs - flagCount;

  // 難易度が変更された時にゲームをリセットする
  useEffect(() => {
    setBombMap(createEmptyBoard(settings.height, settings.width));
    setUserInputs(createEmptyBoard(settings.height, settings.width));
    setGameState('playing');
    setCount(0);
    setTimerRunning(false);
  }, [settings]);

  const restart = () => {
    setBombMap(createEmptyBoard(settings.height, settings.width));
    setUserInputs(createEmptyBoard(settings.height, settings.width));
    setGameState('playing');
    setCount(0);
    setTimerRunning(false);
  };

  useEffect(() => {
    const maxBombs = customSettings.width * customSettings.height - 1;
    if (maxBombs < 0) return;

    if (customSettings.bombs > maxBombs) {
      setCustomSettings((prev) => ({ ...prev, bombs: maxBombs }));
    }
  }, [customSettings.width, customSettings.height, customSettings.bombs]);

  useEffect(() => {
    // timerRunningがtrueで、かつゲームがプレイ中の場合のみタイマーを動かす
    if (timerRunning && gameState === 'playing') {
      const intervalId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [timerRunning, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    // 開かれていないマスの数を数える
    const unopenedCells = userInputs.flat().filter((cell) => cell !== -1).length;

    // 開かれていないマスの数と爆弾の数が同じになったら勝利
    if (unopenedCells === settings.bombs) {
      setGameState('won');
      setTimerRunning(false);
      alert('GAME CLEAR!');

      // クリア時に、残っている爆弾に旗を立てる
      const finalUserInputs = structuredClone(userInputs);
      for (let y = 0; y < settings.height; y++) {
        for (let x = 0; x < settings.width; x++) {
          if (bombMap[y][x] === 10) {
            finalUserInputs[y][x] = 1;
          }
        }
      }
      setUserInputs(finalUserInputs);
    }
  }, [userInputs, bombMap, settings, gameState]);

  const leftclick = (x: number, y: number) => {
    if (gameState !== 'playing' || userInputs[y][x] !== 0) {
      return;
    }

    let currentBombMap = bombMap;
    console.log(x, y);

    const firstClick = bombMap.flat().every((value) => value === 0);
    // 一回目の左クリックで爆弾配置
    if (firstClick) {
      const newbombMap = structuredClone(bombMap);
      setTimerRunning(true);
      let bombcount = settings.bombs;
      while (bombcount > 0) {
        const rx = Math.floor(Math.random() * userInputs[0].length);
        const ry = Math.floor(Math.random() * userInputs.length);
        // h wの盤面に爆弾をランダム配置
        if (newbombMap[ry][rx] === 0 && (ry !== y || rx !== x)) {
          newbombMap[ry][rx] = 10;
          bombcount--;
        }
      }
      aroundBomCheck(newbombMap);
      setBombMap(newbombMap);
      currentBombMap = newbombMap;
    }
    if (currentBombMap[y][x] === 10) {
      setGameState('lost');
      setTimerRunning(false);
      const finalUserInputs = structuredClone(userInputs);
      finalUserInputs[y][x] = -2;
      setUserInputs(finalUserInputs);
      alert('GAME OVER!');
      return;
    }
    const newuserInputs = structuredClone(userInputs);
    openRecursive(x, y, currentBombMap, newuserInputs);
    setUserInputs(newuserInputs);
  };

  const rightclick = (x: number, y: number, event: React.MouseEvent) => {
    if (gameState !== 'playing' || userInputs[y][x] === -1) return;
    event?.preventDefault();
    console.log(x, y);
    const newuserInputs = structuredClone(userInputs);
    newuserInputs[y][x] = (newuserInputs[y][x] + 1) % 3;
    setUserInputs(newuserInputs);
  };

  const handleStartCustomGame = () => {
    const { width, height, bombs } = customSettings;
    const maxBombs = width * height - 1;
    // 爆弾がボード全体を埋め尽くすないように-1

    if (width <= 0 || height <= 0) {
      alert('幅と高さは1以上にしてください。(0と負の値はダメよ)');
      return;
    }

    if (bombs > maxBombs) {
      alert(`爆弾の数は${maxBombs}個以下にしてください。(ゲームが成り立たないよ！)`);
      setCustomSettings((prev) => ({ ...prev, bombs: maxBombs }));
      return;
    }

    if (bombs < 1) {
      alert('爆弾は1個以上に設定してください。(爆弾がないとゲームが成り立たないよ！)');
      return;
    }

    setSettings(customSettings);
    setCustom(false);
  };

  const getFaceStyle = () => {
    if (gameState === 'won') {
      return { backgroundPosition: '-360px' }; // サングラス
    }
    if (gameState === 'lost') {
      return { backgroundPosition: '-390px' }; // (X ^ X)
    }
    return { backgroundPosition: '-330px' }; // プレイ中はふつうのにこちゃんマーク
  };

  return (
    <div className={styles.container}>
      <div className={styles.customSettings}>
        <div className={styles.inputItem}>
          <label htmlFor="customWidth">幅:</label>
          <input
            id="customWidth"
            type="number"
            value={customSettings.width}
            onChange={(e) =>
              setCustomSettings({ ...customSettings, width: parseInt(e.target.value, 10) || 0 })
            }
          />
        </div>
        <div className={styles.inputItem}>
          <label htmlFor="customHeight">高さ:</label>
          <input
            id="customHeight"
            type="number"
            value={customSettings.height}
            onChange={(e) =>
              setCustomSettings({ ...customSettings, height: parseInt(e.target.value, 10) || 0 })
            }
          />
        </div>
        <div className={styles.inputItem}>
          <label htmlFor="customBombs">爆弾数:</label>
          <input
            id="customBombs"
            type="number"
            value={customSettings.bombs}
            onChange={(e) =>
              setCustomSettings({ ...customSettings, bombs: parseInt(e.target.value, 10) || 0 })
            }
          />
        </div>
        <button onClick={handleStartCustomGame}>更新</button>
      </div>

      <div>
        <button onClick={() => setSettings(difficulty_levels.beginner)}>初級</button>
        <button onClick={() => setSettings(difficulty_levels.intermediate)}>中級</button>
        <button onClick={() => setSettings(difficulty_levels.advanced)}>上級</button>
      </div>

      <div className={styles.gameContainer} style={{ width: settings.width * 38 }}>
        <div className={styles.header}>
          <div className={styles.digitalDisplay}>{String(remainingBombs).padStart(3, '0')}</div>
          <button className={styles.faceButton} onClick={restart}>
            <div className={styles.face} style={getFaceStyle()} />
          </button>
          <div className={styles.digitalDisplay}>{String(count).padStart(3, '0')}</div>
        </div>
        <div
          className={styles.board}
          style={{
            width: settings.width * 35,
            height: settings.height * 35,
          }}
        >
          {calcBoard(userInputs, bombMap, gameState).map((row, y) =>
            row.map((value, x) => (
              <button
                className={styles.block}
                key={`${x}-${y}`}
                onClick={() => leftclick(x, y)}
                onContextMenu={(event) => rightclick(x, y, event)}
                style={{
                  border:
                    value === 0 || value === 1 || value === 2
                      ? '4px solid #808080'
                      : '1px solid #808080',
                  borderTopColor: value === 0 || value === 1 || value === 2 ? '#fff' : '#808080',
                  borderLeftColor: value === 0 || value === 1 || value === 2 ? '#fff' : '#808080',
                  backgroundColor: value === 8 ? 'red' : value === 11 ? '#ffa0a0' : '#c6c6c6',
                  // 間違った旗(11)
                }}
              >
                <div
                  className={styles.cell}
                  style={{
                    // 踏んだ爆弾(8)他の爆弾(9)
                    backgroundPosition: `${value === 8 || value === 9 ? -300 : value === 99 ? 0 : value === 199 ? -30 : value === 299 ? -60 : value === 399 ? -90 : value === 499 ? -120 : value === 599 ? -150 : value === 699 ? -180 : value === 799 ? -210 : value === 1 || value === 11 ? -270 : value === 2 ? -240 : value === -1 ? 30 : 30}px`,
                  }}
                />
              </button>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
