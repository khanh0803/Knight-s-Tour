import { useState } from 'react';

<h1>Bấm ngẫu nhiên một ô để bắt đầu</h1>
const Chessboard = () => {
  const [knightPosition, setKnightPosition] = useState<[number, number] | null>(null)
  const [hasSelectedStart, setHasSelectedStart] = useState(false)
  const [visitedSquares, setVisitedSquares] = useState<[number, number] []>([]);

  const handleSquareClick = (i: number, j: number) => {
    if (!hasSelectedStart) {
      setKnightPosition([i, j]);
      setHasSelectedStart(true);
      setVisitedSquares([[i, j]]);
    } else {
      setKnightPosition([i, j]);
      setVisitedSquares((prev: [number, number][]) => {
        const alreadyVisited = prev.some(([x, y]) => x === i && y === j);
        if (alreadyVisited) return prev;
        return [...prev, [i, j] as [number, number]];
      });
      
    }
  };
  const renderSquare = (i:number, j:number) => {
    const isKnight = knightPosition && knightPosition[0] === i && knightPosition[1] === j
    const isVisited = visitedSquares.some(([x, y]) => x === i && y === j)
    const isDark = (i + j) % 2 === 1

    let squareColor = isDark ? 'bg-yellow-700' : 'bg-yellow-200';
    if (isVisited && !isKnight) squareColor = 'bg-red-500';
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
    return squares;
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Knight's Tour</h1>
      <div className="grid border-4 border-black">
        {renderBoard()}
      </div>
    </div>
  );

};

export default Chessboard;  