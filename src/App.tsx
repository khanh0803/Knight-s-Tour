import { useState } from 'react';
import { getNextKnightMove } from './api/knightAPI';
const Chessboard = () => {
  const [knightPosition, setKnightPosition] = useState<[number, number] | null>(null)
  const [hasSelectedStart, setHasSelectedStart] = useState(false)
  const [visitedSquares, setVisitedSquares] = useState<[number, number] []>([])
  const [suggestedMove, setSuggestedMove] = useState<[number, number] | null>(null)

  const knightMoves = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
  
  const hasValidMoves = (pos: [number, number], visited: [number, number][]) => {
    return knightMoves.some(([dx, dy]) => {
      const [x, y] = [pos[0] + dx, pos[1] + dy]
      return (
        x >= 0 && x < 8 &&
        y >= 0 && y < 8 &&
        !visited.some(([vx, vy]) => vx === x && vy === y)
      )
    })
  }

  const isValidMove = (from: [number, number], to: [number, number]) => {
    const dx = Math.abs(from[0] - to[0])
    const dy = Math.abs(from[1] - to[1])
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2)
  }

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

  const renderSquare = (i:number, j:number) => {
    const isKnight = knightPosition && knightPosition[0] === i && knightPosition[1] === j
    const isVisited = visitedSquares.some(([x, y]) => x === i && y === j)
    const isSuggested = suggestedMove && suggestedMove[0] === i && suggestedMove[1] === j;
    const isDark = (i + j) % 2 === 1

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
      </div>
    );
  };
    
  const renderBoard = () => {
    let squares = [];
    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        row.push(renderSquare(i, j))
      }
      squares.push(
        <div key={i} className="flex">
          {row}
        </div>
      )
    }
    return squares
  }

  const resetGame = () => {
    setKnightPosition(null)
    setVisitedSquares([])
    setHasSelectedStart(false)
    setSuggestedMove(null)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-100">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-center">Knight's Tour</h1>
        <div className="grid grid-rows-8 border-4 border-black shadow-lg">
          {renderBoard()}          </div>
      </div>
      {knightPosition && (visitedSquares.length === 64 ? (
      <div>
        <p className='pl-8 text-green-500 text-7xl font-bold  '>You win</p>
        <button onClick={resetGame}
          className="ml-20 mt-4 px-4 py-2 bg-blue-200 bg-opacity-40 hover:bg-violet-400 text-black"
        >Restart the game
        </button>
      </div>  ) : 
      !hasValidMoves(knightPosition, visitedSquares) ? (
      <div className="mt-4 pl-20">
        <p className="text-red-600 text-7xl font-semibold">❌ You lost</p>
        <button onClick={resetGame}
          className="ml-20 mt-4 px-4 py-2 bg-blue-200 bg-opacity-40 hover:bg-violet-400 text-black"
        >Restart the game
        </button>
      </div>) : null)
      }

      <div>
        <h2 className="text-3xl font-bold pl-20">Information</h2>
        <p className="text-3xl font-bold pt-5 pl-20">Score: {visitedSquares.length}</p>
        <button onClick={() => {
          if (knightPosition) {
            const next = getNextKnightMove(knightPosition, visitedSquares);
            setSuggestedMove(next);
          }
        }}
        className="mt-6 ml-20 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
        >
        💡 Hint
        </button>

      </div>  
    </div>
  )
}

export default Chessboard