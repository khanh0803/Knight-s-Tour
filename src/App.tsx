import { useState } from 'react';
const Chessboard = () => {
  const [knightPosition, setKnightPosition] = useState<[number, number] | null>(null)
  const [hasSelectedStart, setHasSelectedStart] = useState(false)
  const [visitedSquares, setVisitedSquares] = useState<[number, number] []>([])

  const knightMoves = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]

  const isValidMove = (from: [number, number], to: [number, number]) => {
    const dx = Math.abs(from[0] - to[0])
    const dy = Math.abs(from[1] - to[1])
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2)
  }

  const handleSquareClick = (i: number, j: number) => {
    const nextPos: [number, number] = [i, j]
    if (!hasSelectedStart) {
      setKnightPosition(nextPos);
      setHasSelectedStart(true);
      setVisitedSquares([nextPos]);
    } else if (
      knightPosition && isValidMove(knightPosition, nextPos) && !visitedSquares.some(([x, y]) => x === i && y === j)
    ) {
      setKnightPosition(nextPos);
      setVisitedSquares((prev) => [...prev, nextPos]);
    }
  };
  

  const renderSquare = (i:number, j:number) => {
    const isKnight = knightPosition && knightPosition[0] === i && knightPosition[1] === j
    const isVisited = visitedSquares.some(([x, y]) => x === i && y === j)
    const isDark = (i + j) % 2 === 1

    let squareColor = isDark ? 'bg-yellow-700' : 'bg-yellow-200'
    if (isVisited && !isKnight) squareColor = 'bg-red-500'
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
      );
    }
    return squares
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-100">
      
      <div>
        <h1 className="text-3xl font-bold mb-4 text-center">Knight's Tour</h1>
        <div className="grid grid-rows-8 border-4 border-black shadow-lg">
          {renderBoard()}          </div>
        </div>
      <div>
        <h2 className="text-3xl font-bold pl-20">Information</h2>
        <p className="text-3xl font-bold pt-5 pl-20">Score: {visitedSquares.length}</p>
        {/*<p className="text-4xl font-bold pt-5 pl-20">You dumb lost</p> */}
      </div>  
    </div>
    
  )
};

export default Chessboard;