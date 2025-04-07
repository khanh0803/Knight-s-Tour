import React, { useState } from 'react';

const Chessboard = () => {
  const [knightPosition, setKnightPosition] = useState([0, 0]);

  const renderSquare = (i:number, j:number) => {
    const isKnight = knightPosition[0] === i && knightPosition[1] === j;
    const isDark = (i + j) % 2 === 1;

    return (
      <div
        key={`${i}-${j}`}
        className={`w-12 h-12 flex justify-center items-center ${
          isDark ? 'bg-yellow-700' : 'bg-yellow-200'
        }`}
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
        row.push(renderSquare(i, j));
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
    <div className="flex justify-center items-center h-screen">
      <div className="inline-block border-2 border-gray-800">
        {renderBoard()}
      </div>
    </div>
  );
};

export default Chessboard;  