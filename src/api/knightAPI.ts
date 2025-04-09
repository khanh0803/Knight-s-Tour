// src/api/knightApi.ts
export type Position = [number, number];

const knightMoves: Position[] = [
  [2, 1], [1, 2], [-1, 2], [-2, 1],
  [-2, -1], [-1, -2], [1, -2], [2, -1],
];

const isInsideBoard = ([x, y]: Position) =>
  x >= 0 && x < 8 && y >= 0 && y < 8;

const getOnwardMovesCount = (pos: Position, visited: Position[]) => {
  return knightMoves.filter(([dx, dy]) => {
    const [nx, ny] = [pos[0] + dx, pos[1] + dy];
    return isInsideBoard([nx, ny]) &&
      !visited.some(([vx, vy]) => vx === nx && vy === ny);
  }).length;
};

export const getNextKnightMove = (
  current: Position,
  visited: Position[]
): Position | null => {
  const candidates = knightMoves
    .map(([dx, dy]) => [current[0] + dx, current[1] + dy] as Position)
    .filter(pos =>
      isInsideBoard(pos) &&
      !visited.some(([x, y]) => x === pos[0] && y === pos[1])
    );

  if (candidates.length === 0) return null;

  const next = candidates.reduce((best, move) => {
    const countBest = getOnwardMovesCount(best, [...visited, best]);
    const countMove = getOnwardMovesCount(move, [...visited, move]);
    return countMove < countBest ? move : best;
  });

  return next;
};
