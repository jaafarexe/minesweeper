import { CellData } from '../types/minesweeper';

export function createEmptyBoard(rows: number, cols: number): CellData[][] {
  const board: CellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        neighborMines: 0,
        state: 'hidden',
      });
    }
    board.push(row);
  }
  return board;
}

export function getNeighbors(row: number, col: number, rows: number, cols: number): [number, number][] {
  const neighbors: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }
  return neighbors;
}

/**
 * Places mines with first-click safety.
 * Guarantees that the first clicked cell (and if possible its immediate 8 neighbors)
 * are completely mine-free, creating an opening.
 */
export function populateMines(
  board: CellData[][],
  rows: number,
  cols: number,
  mineCount: number,
  safeRow: number,
  safeCol: number
): CellData[][] {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const totalCells = rows * cols;
  const clampedMineCount = Math.min(mineCount, totalCells - 1);

  // Collect 3x3 surrounding cells
  const safeCoords = new Set<string>();
  safeCoords.add(`${safeRow},${safeCol}`);

  const neighborCoords = getNeighbors(safeRow, safeCol, rows, cols);
  // Check if we can keep all 8 neighbors safe as well
  if (totalCells - (1 + neighborCoords.length) >= clampedMineCount) {
    for (const [nr, nc] of neighborCoords) {
      safeCoords.add(`${nr},${nc}`);
    }
  }

  // Create list of candidate cells for mines
  const candidateCells: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeCoords.has(`${r},${c}`)) {
        candidateCells.push([r, c]);
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = candidateCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = candidateCells[i];
    candidateCells[i] = candidateCells[j];
    candidateCells[j] = temp;
  }

  // Place mines
  for (let i = 0; i < clampedMineCount; i++) {
    const [mr, mc] = candidateCells[i];
    newBoard[mr][mc].isMine = true;
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) {
        newBoard[r][c].neighborMines = 0;
        continue;
      }
      let count = 0;
      const neighbors = getNeighbors(r, c, rows, cols);
      for (const [nr, nc] of neighbors) {
        if (newBoard[nr][nc].isMine) {
          count++;
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

export interface RevealResult {
  newBoard: CellData[][];
  hitMine: boolean;
  cellsRevealedCount: number;
}

/**
 * Reveals a cell and cascades if it is 0.
 */
export function revealCell(
  board: CellData[][],
  row: number,
  col: number,
  rows: number,
  cols: number
): RevealResult {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const target = newBoard[row][col];

  // If already revealed or flagged, do nothing
  if (target.state === 'revealed' || target.state === 'flagged') {
    return { newBoard, hitMine: false, cellsRevealedCount: 0 };
  }

  // If hit mine
  if (target.isMine) {
    target.state = 'revealed';
    target.isExploded = true;
    return { newBoard, hitMine: true, cellsRevealedCount: 1 };
  }

  // Flood fill algorithm using queue
  let cellsRevealedCount = 0;
  const queue: [number, number][] = [[row, col]];
  target.state = 'revealed';
  cellsRevealedCount++;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    const currCell = newBoard[currR][currC];

    // If this cell has 0 neighboring mines, cascade into all unrevealed unflagged neighbors
    if (currCell.neighborMines === 0) {
      const neighbors = getNeighbors(currR, currC, rows, cols);
      for (const [nr, nc] of neighbors) {
        const neighbor = newBoard[nr][nc];
        if (neighbor.state === 'hidden' || neighbor.state === 'question') {
          neighbor.state = 'revealed';
          cellsRevealedCount++;
          if (neighbor.neighborMines === 0) {
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return { newBoard, hitMine: false, cellsRevealedCount };
}

/**
 * Chord operation: When clicking an already revealed cell with number N,
 * if there are exactly N flagged neighbors, reveal all remaining unflagged neighbors.
 */
export function chordCell(
  board: CellData[][],
  row: number,
  col: number,
  rows: number,
  cols: number
): RevealResult {
  const cell = board[row][col];
  if (cell.state !== 'revealed' || cell.neighborMines === 0) {
    return { newBoard: board, hitMine: false, cellsRevealedCount: 0 };
  }

  const neighbors = getNeighbors(row, col, rows, cols);
  let flagCount = 0;
  for (const [nr, nc] of neighbors) {
    if (board[nr][nc].state === 'flagged') {
      flagCount++;
    }
  }

  // Only chord if flags match the exact number
  if (flagCount !== cell.neighborMines) {
    return { newBoard: board, hitMine: false, cellsRevealedCount: 0 };
  }

  let currentBoard = board;
  let hitMine = false;
  let totalRevealed = 0;

  for (const [nr, nc] of neighbors) {
    const neighbor = currentBoard[nr][nc];
    if (neighbor.state === 'hidden' || neighbor.state === 'question') {
      const result = revealCell(currentBoard, nr, nc, rows, cols);
      currentBoard = result.newBoard;
      totalRevealed += result.cellsRevealedCount;
      if (result.hitMine) {
        hitMine = true;
      }
    }
  }

  return { newBoard: currentBoard, hitMine, cellsRevealedCount: totalRevealed };
}

/**
 * Toggles flag / question / hidden
 */
export function toggleCellFlag(
  board: CellData[][],
  row: number,
  col: number,
  allowQuestionMarks: boolean
): { newBoard: CellData[][]; action: 'flag' | 'unflag' | 'question' | 'none' } {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const cell = newBoard[row][col];

  if (cell.state === 'revealed') {
    return { newBoard, action: 'none' };
  }

  let action: 'flag' | 'unflag' | 'question' = 'unflag';

  if (cell.state === 'hidden') {
    cell.state = 'flagged';
    action = 'flag';
  } else if (cell.state === 'flagged') {
    if (allowQuestionMarks) {
      cell.state = 'question';
      action = 'question';
    } else {
      cell.state = 'hidden';
      action = 'unflag';
    }
  } else if (cell.state === 'question') {
    cell.state = 'hidden';
    action = 'unflag';
  }

  return { newBoard, action };
}

/**
 * Check if the game is won:
 * All non-mine cells must be revealed.
 */
export function isGameWon(board: CellData[][], rows: number, cols: number, mines: number): boolean {
  let revealedCount = 0;
  const targetReveals = rows * cols - mines;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].state === 'revealed' && !board[r][c].isMine) {
        revealedCount++;
      }
    }
  }

  return revealedCount === targetReveals;
}

/**
 * Reveals all mines and flags when the player loses.
 * Highlights misflagged cells.
 */
export function revealAllMinesOnLoss(
  board: CellData[][],
  explodedRow: number,
  explodedCol: number
): CellData[][] {
  return board.map((rowArr, r) =>
    rowArr.map((cell, c) => {
      const copy = { ...cell };
      if (r === explodedRow && c === explodedCol) {
        copy.state = 'revealed';
        copy.isExploded = true;
      } else if (cell.isMine) {
        if (cell.state !== 'flagged') {
          copy.state = 'revealed';
        }
      } else if (cell.state === 'flagged') {
        // Misflagged non-mine!
        copy.isMisflagged = true;
      }
      return copy;
    })
  );
}

/**
 * On victory, flags all remaining unflagged mines.
 */
export function flagAllMinesOnWin(board: CellData[][]): CellData[][] {
  return board.map(rowArr =>
    rowArr.map(cell => {
      if (cell.isMine) {
        return { ...cell, state: 'flagged' };
      }
      return cell;
    })
  );
}
