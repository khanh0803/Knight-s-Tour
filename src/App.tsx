import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { auth } from './firebaseConfig'
import { getNextKnightMove, BoardDimensions } from './api/knightAPI'
const Chessboard = () => {
  const [rowCount, setRowCount] = useState(8)
  const [colCount, setColCount] = useState(8)
  const [playerName, setPlayerName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);

  const [leaderBoard, setLeaderBoard] = useState<{name: string, score: number} []>([])
  const [knightPosition, setKnightPosition] = useState<[number, number] | null>(null)
  const [hasSelectedStart, setHasSelectedStart] = useState(false)
  const [visitedSquares, setVisitedSquares] = useState<[number, number] []>([])
  const [suggestedMove, setSuggestedMove] = useState<[number, number] | null>(null)
  const [isSelected, setIsSelected] = useState(false) 
  const [validMoves, setValidMoves] = useState<[number, number] []>([])  //有効な動きを表示

  // ナイトの有効な移動
  const knightMoves = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
  
  // 現在の位置から、これまで使用されていない有効なマスがあるかどうかを確認する
  const hasValidMoves = (pos: [number, number], visited: [number, number][]) => {
    return knightMoves.some(([dx, dy]) => {
      const [x, y] = [pos[0] + dx, pos[1] + dy]
      return (
        x >= 0 && x < rowCount &&
        y >= 0 && y < colCount &&
        !visited.some(([vx, vy]) => vx === x && vy === y)
      )
    })
  }

  //from から to まで移動が有効かどうか確認
  const isValidMove = (from: [number, number], to: [number, number]) => {
    const dx = Math.abs(from[0] - to[0])
    const dy = Math.abs(from[1] - to[1])
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2)
  }

  //マスをクリックしたときの処理関数
  const handleSquareClick = (i: number, j: number) => {
    const nextPos: [number, number] = [i, j]
    if (!hasSelectedStart) {
      setKnightPosition(nextPos)
      setHasSelectedStart(true)
      setVisitedSquares([nextPos])
      setSuggestedMove(null);
      setIsSelected(false)
      setValidMoves([])
    }
    
    if (knightPosition && knightPosition[0] === i && knightPosition[1] === j) {
      const possibleMoves = knightMoves
        .map(([dx, dy]) => [knightPosition[0] + dx, knightPosition[1] + dy] as [number, number])
        .filter(([x, y]) =>
          x >= 0 && x < rowCount &&
          y >= 0 && y < colCount &&
          !visitedSquares.some(([vx, vy]) => vx === x && vy === y)
        );
      setIsSelected(true)
      setValidMoves(possibleMoves)
      return
    }

    const isMoveValid = validMoves.some(([x, y]) => x === i && y === j)
    if (isSelected && isMoveValid) {
      setKnightPosition(nextPos)
      setVisitedSquares((prev) => [...prev, nextPos])
      setIsSelected(false)
      setValidMoves([])
      setSuggestedMove(null)
      return
    }

    if (
      knightPosition && isValidMove(knightPosition, nextPos) && 
      !visitedSquares.some(([x, y]) => x === i && y === j)
    ) {
        setKnightPosition(nextPos)
        setVisitedSquares((prev) => {const updated = [...prev, nextPos]
        setSuggestedMove(null)
        setIsSelected(false)
        return updated
      })
    }
    setIsSelected(false)
    setValidMoves([])
  }

  //位置(i, j)のマスに色を付ける関数
  const renderSquare = (i:number, j:number) => {
    const isKnight = knightPosition && knightPosition[0] === i && knightPosition[1] === j
    const isVisited = visitedSquares.some(([x, y]) => x === i && y === j)
    const isSuggested = suggestedMove && suggestedMove[0] === i && suggestedMove[1] === j
    const isDark = (i + j) % 2 === 1
    const isKnightSelectedSquare = isKnight && isSelected
    const isValidTargets = validMoves.some(([x, y]) => x === i && y === j)

    //状態に応じた色の機能
    let squareColor = isDark ? 'bg-yellow-700' : 'bg-yellow-200'
    if (isVisited && !isKnight) squareColor = 'bg-red-500'
    if (isSuggested && !isKnight) squareColor = 'bg-green-400'
    return (
      <div
        key={`${i}-${j}`}
        className={`relative w-12 h-12 flex justify-center items-center cursor-pointer ${squareColor}`}
        onClick={() => handleSquareClick(i, j)}
      >
        {isKnight && <span className="text-5xl">♞</span>}
        {/* {isKnight && <img src="/bocchi.jpg"
          className='w-10 h-10'
        />} */}
        
        {isKnightSelectedSquare && (
          <div className="absolute inset-0.25 border-4 border-blue-500 pointer-events-none"></div>
        )}
        {isValidTargets && (
          <div className="absolute inset-0.25 border-4 border-green-400 pointer-events-none"></div>
        )}
      </div>
    )
  }
    
  //行ｘ列のチェス盤を描く関数
  const renderBoard = () => {
    let boards = []
    for (let i = 0; i < rowCount; i++) {
      let row = []
      for (let j = 0; j < colCount; j++) {
        row.push(renderSquare(i, j))
      }
      boards.push(
        <div key={i} className="flex">
          {row}
        </div>
      )
    }
    return boards
  }

  //ゲーム全体を元の状態にリセットする
  const resetGame = () => {
    setKnightPosition(null)
    setVisitedSquares([])
    setHasSelectedStart(false)
    setSuggestedMove(null)
    setIsSelected(false)
    setValidMoves([])
  }

  const handleUpdateBoard = () => {
    resetGame();
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setPlayerName("");
      setIsLoggedIn(false);
    } catch (error: any) {
      alert("Sign out fail: " + error.message);
    }
  };
  
  const getBestScore = (name: string) => {
    const scores = leaderBoard.filter(entry => entry.name === name);
    if (scores.length === 0) return 0;
    return Math.max(...scores.map(entry => entry.score));
  }
  
  if (!isLoggedIn) {
    const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value
      const password = (form.elements.namedItem('password') as HTMLInputElement).value
  
      try {
        if (isRegistering) {
          const displayName = (form.elements.namedItem('displayName') as HTMLInputElement).value;
          const result = await createUserWithEmailAndPassword(auth, email, password);
          setPlayerName(displayName);
          setIsLoggedIn(true);
        } else {
          const result = await signInWithEmailAndPassword(auth, email, password);
          setPlayerName(result.user.email || "anonymous");
          setIsLoggedIn(true);
        }
        
      } catch (error: any) {
        alert((isRegistering ? "Sign up" : "Sign in") + " fail: " + error.message)
      }
    }
  
    return (
      <div className='flex items-center justify-center'>
        <form onSubmit={handleAuth} className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-3xl font-bold">
            {isRegistering ? "サインアップ" : "サインイン"}
          </h1>
          <input
            name="email"
            type="email"
            placeholder="khanhdz@sohobb.jp"
            required
            className="border px-4 py-2 w-64"
          />
          {isRegistering && (
            <input
              name="displayName"
              type="text"
              placeholder="Nickname"
              required
              className="border px-4 py-2 rounded"
            />
          )} 

          <input
            name="password"
            type="password"
            placeholder="パスワード"
            required
            className="border px-4 py-2 w-64"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            {isRegistering ? "サインアップ" : "サインイン"}
          </button>
    
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            {isRegistering
              ? "Already have account? サインイン"
              : "No account yet? サインアップ"}
          </button>
        </form>
      </div>
    );
  }
    
  return (
    <div className="w-screen h-screen flex flex-col items-center bg-slate-100">
      <div className="my-4 flex items-center gap-4">
        <div>
          <p className="text-xl"> こんにちは: <strong>{playerName}</strong></p>
        </div>

        <div>
          <label className="mr-2 text-2xl">行</label>
          <input
            type="number"
            min={1}
            value={rowCount}
            onChange={(e) => setRowCount(Number(e.target.value))}
            className="border px-2 py-1 w-16"
          />
        </div>

        <div>
          <label className="mr-2 text-2xl">列</label>
          <input
            type="number"
            min={1}
            value={colCount}
            onChange={(e) => setColCount(Number(e.target.value))}
            className="border px-2 py-1 w-16"
          />
        </div>
        <button
          onClick={handleUpdateBoard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <p className='text-2xl'>更新</p>
        </button>
      </div>

      <div className="flex flex-row gap-8 items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4 text-center">ナイトの巡回</h1>
          <div className="border-4 border-black shadow-lg inline-block">
            {renderBoard()}
          </div>
        </div>

        {knightPosition && (visitedSquares.length === rowCount * colCount ? (
          <div className="pl-8">
            <p className="text-green-500 text-7xl font-bold">🏆 勝利！</p>
            {playerName && (
              <p className="text-5xl mt-2 pl-4"> スコア: {visitedSquares.length}</p>
            )}
            <button
              onClick={() => {
              if (playerName) {
                setLeaderBoard(prev => [...prev, { name: playerName, score: visitedSquares.length }])
              }
              resetGame()
              }}
              className="ml-4 mt-4 px-4 py-2 bg-blue-200 bg-opacity-40 hover:bg-violet-400 text-black"
              >リスタート
            </button>
          </div>
        ) : !hasValidMoves(knightPosition, visitedSquares) ? (
          <div className="mt-4 pl-8">
            <p className="text-red-600 text-7xl font-semibold">❌ 敗北</p>
            {playerName && (
              <p className="text-3xl mt-2 pl-20"> スコア: {visitedSquares.length}</p>
            )}
            <button
              onClick={() => {
                if (playerName) {
                  setLeaderBoard(prev => [...prev, { name: playerName, score: visitedSquares.length }]);
                }
                resetGame()
              }}
              className="ml-4 mt-4 px-4 py-2 bg-blue-200 bg-opacity-40 hover:bg-violet-400 text-black"
            >リスタート
            </button>
          </div>
        ) : null
        )}

        <div className="ml-8">
          <p className="text-3xl font-bold">🏅 Best Score: {getBestScore(playerName)}</p>
          <button
            onClick={() => {
              if (knightPosition) {
                const board: BoardDimensions = { rows: rowCount, cols: colCount }
                const next = getNextKnightMove(knightPosition, visitedSquares, board)
                setSuggestedMove(next)
              }
            }}
            className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            💡 ヒント
          </button>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">🏆 スコアボード</h2>
            <ul className="text-xl space-y-1">
            {[...leaderBoard
              .reduce((acc, curr) => {
                const existing = acc.get(curr.name);
                if (!existing || curr.score > existing.score) {
                  acc.set(curr.name, curr)
                }
                return acc;
              }, new Map<string, { name: string; score: number }>())
              .values()]
              .sort((a, b) => b.score - a.score)
              .map((entry, idx) => (
                <li key={idx}>
                  {idx + 1}. {entry.name} - {entry.score} 点
                </li>
              ))
            }
            </ul>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              サインアウト
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chessboard;
