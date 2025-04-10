import { useState } from 'react';
import { getNextKnightMove } from './api/knightAPI';
const Chessboard = () => {
  const [rowCount, setRowCount] = useState(8)
  const [colCount, setColCount] = useState(8)

  const [knightPosition, setKnightPosition] = useState<[number, number] | null>(null)
  const [hasSelectedStart, setHasSelectedStart] = useState(false)
  const [visitedSquares, setVisitedSquares] = useState<[number, number] []>([])
  const [suggestedMove, setSuggestedMove] = useState<[number, number] | null>(null)

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
    } else if (
      knightPosition && isValidMove(knightPosition, nextPos) && 
      !visitedSquares.some(([x, y]) => x === i && y === j)
    ) {
      setKnightPosition(nextPos)
      setVisitedSquares((prev) => {
        const updated = [...prev, nextPos]
        setSuggestedMove(null);
        return updated
      })
    }
  }

  //位置(i, j)のマスに色を付ける関数
  const renderSquare = (i:number, j:number) => {
    const isKnight = knightPosition && knightPosition[0] === i && knightPosition[1] === j
    const isVisited = visitedSquares.some(([x, y]) => x === i && y === j)
    const isSuggested = suggestedMove && suggestedMove[0] === i && suggestedMove[1] === j;
    const isDark = (i + j) % 2 === 1

    //状態に応じた色の機能
    let squareColor = isDark ? 'bg-yellow-700' : 'bg-yellow-200'
    if (isVisited && !isKnight) squareColor = 'bg-red-500'
    if (isSuggested && !isKnight) squareColor = 'bg-green-400'
    return (
      <div
        key={`${i}-${j}`}
        className={`w-12 h-12 flex justify-center items-center cursor-pointer ${squareColor}`}
        onClick={() => handleSquareClick(i, j)}
      >
        {isKnight && <span className="text-5xl">♞</span>}

        {/* <img
          src="/bocchi.jpg"
          className='w-10 h-10'
        /> */}
      </div>
    );
  };
    
  //行ｘ列のチェス盤を描く関数
  const renderBoard = () => {
    let boards = [];
    for (let i = 0; i < rowCount; i++) {
      let row = [];
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
  }

  const handleUpdateBoard = () => {
    resetGame();
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-slate-100">

      <div className="my-4 flex items-center gap-4">
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

        {knightPosition && (
          visitedSquares.length === rowCount * colCount ? (
            <div className="pl-8">
              <p className="text-green-500 text-7xl font-bold">勝利</p>
              <button
                onClick={resetGame}
                className="ml-4 mt-4 px-4 py-2 bg-blue-200 bg-opacity-40 hover:bg-violet-400 text-black"
              >
                リスタート
              </button>
            </div>
          ) : !hasValidMoves(knightPosition, visitedSquares) ? (
            <div className="mt-4 pl-8">
              <p className="text-red-600 text-7xl font-semibold">❌ 敗北</p>
              <button
                onClick={resetGame}
                className="ml-4 mt-4 px-4 py-2 bg-blue-200 bg-opacity-40 hover:bg-violet-400 text-black"
              >
                リスタート
              </button>
            </div>
          ) : null
        )}
        
        <div className="ml-8">
          <p className="text-3xl font-bold ">スコア: {visitedSquares.length}</p>
          <button
            onClick={() => {
              if (knightPosition) {
                const next = getNextKnightMove(knightPosition, visitedSquares);
                setSuggestedMove(next);
              }
            }}
            className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            💡 ヒント
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chessboard;
