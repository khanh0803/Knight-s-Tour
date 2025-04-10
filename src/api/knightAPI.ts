export type Position = [number, number];
export interface BoardDimensions {
  rows: number;
  cols: number;
}

const knightMoves: Position[] = [
  [2, 1], [1, 2], [-1, 2], [-2, 1],
  [-2, -1], [-1, -2], [1, -2], [2, -1],
];

export const isInsideBoard = (pos: Position, board: BoardDimensions): boolean =>
  pos[0] >= 0 && pos[0] < board.rows && pos[1] >= 0 && pos[1] < board.cols;

const getOnwardMovesCount = (pos: Position, visited: Position[], board: BoardDimensions): number => {
  return knightMoves.filter(([dx, dy]) => {
    const [nx, ny] = [pos[0] + dx, pos[1] + dy];
    return isInsideBoard([nx, ny], board) &&
           !visited.some(([vx, vy]) => vx === nx && vy === ny);
  }).length;
};

export const getNextKnightMove = (
  current: Position,
  visited: Position[],
  board: BoardDimensions
): Position | null => {

  const candidates = knightMoves
    .map(([dx, dy]) => [current[0] + dx, current[1] + dy] as Position)
    .filter(pos =>
      isInsideBoard(pos, board) &&
      !visited.some(([x, y]) => x === pos[0] && y === pos[1])
    );

  if (candidates.length === 0) return null;

  const next = candidates.reduce((best, move) => {
    const countBest = getOnwardMovesCount(best, [...visited, best], board);
    const countMove = getOnwardMovesCount(move, [...visited, move], board);
    return countMove < countBest ? move : best;
  });

  return next;
};

export const getValidKnightMoves = (
  current: Position,
  visited: Position[],
  board: BoardDimensions
): Position[] => {
  return knightMoves
    .map(([dx, dy]) => [current[0] + dx, current[1] + dy] as Position)
    .filter(pos =>
      isInsideBoard(pos, board) &&
      !visited.some(([x, y]) => x === pos[0] && y === pos[1])
    );
};
