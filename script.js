document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudokuGrid');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetBtn = document.getElementById('resetBtn');
    const numberSelector = document.getElementById('numberSelector');
    const numberButtons = document.querySelectorAll('.numberBtn');
  
    let puzzle = generateSudoku();  // Generates the initial Sudoku puzzle
    let originalPuzzle = [];  // Stores the original puzzle (to reset later)
    let selectedCell = null;  // Tracks the currently selected cell
  
    startGameBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
  
    function startGame() {
      document.getElementById('menu').style.display = 'none';
      document.getElementById('game').style.display = 'block';
      initializeGrid();
    }
  
    function initializeGrid() {
      sudokuGrid.innerHTML = '';  // Clear the grid for new game
      numberSelector.style.display = 'none';  // Hide the number selector initially
  
      puzzle.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          const cell = document.createElement('div');
  
          if (value !== 0) {
            // Pre-filled cells, can't be changed
            cell.textContent = value;
            cell.classList.add('fixed');
          } else {
            // Empty cells for user input
            cell.addEventListener('click', () => {
              selectCell(cell, rowIndex, colIndex);
            });
          }
  
          sudokuGrid.appendChild(cell);
        });
      });
  
      // Store the original puzzle for resetting
      originalPuzzle = puzzle.map(row => row.slice());
    }
  
    function selectCell(cell, rowIndex, colIndex) {
      // Deselect previous cell
      if (selectedCell) {
        selectedCell.classList.remove('selected');
      }
  
      selectedCell = cell;
      selectedCell.classList.add('selected');
      numberSelector.style.display = 'flex';  // Show the number selector
  
      // Handle number selection
      numberButtons.forEach(btn => {
        btn.onclick = () => {
          const num = btn.textContent;
  
          if (num === 'Clear') {
            // Clear the cell
            cell.textContent = '';
            puzzle[rowIndex][colIndex] = 0;
          } else if (isValidMove(puzzle, rowIndex, colIndex, parseInt(num))) {
            // Place the number in the grid if valid
            cell.textContent = num;
            puzzle[rowIndex][colIndex] = parseInt(num);
            if (checkWin()) {
              alert('Congratulations! You completed the puzzle!');
            }
          } else {
            // Add shake and pulse-red animation for invalid moves
            cell.classList.add('shake', 'pulse-red');
            setTimeout(() => {
              cell.classList.remove('shake', 'pulse-red');
            }, 500);  // Remove animations after half a second
          }
        };
      });
    }
  
    // Check if the player has completed the puzzle
    function checkWin() {
      // Check rows, columns, and 3x3 subgrids
      for (let i = 0; i < 9; i++) {
        if (!isUnique(puzzle[i])) return false;  // Check row
        if (!isUnique(puzzle.map(row => row[i]))) return false;  // Check column
  
        // Check 3x3 subgrids
        let subgrid = [];
        const rowStart = Math.floor(i / 3) * 3;
        const colStart = (i % 3) * 3;
        for (let r = rowStart; r < rowStart + 3; r++) {
          for (let c = colStart; c < colStart + 3; c++) {
            subgrid.push(puzzle[r][c]);
          }
        }
        if (!isUnique(subgrid)) return false;
      }
      return true;
    }
  
    // Helper function to check if an array contains unique numbers 1-9
    function isUnique(arr) {
      const filteredArr = arr.filter(num => num !== 0);
      const uniqueSet = new Set(filteredArr);
      return filteredArr.length === uniqueSet.size && uniqueSet.size === 9;
    }
  
    // Check if placing the number is valid in the row, column, and box
    function isValidMove(grid, row, col, num) {
      // Check row and column
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
          return false;
        }
      }
  
      // Check the 3x3 box
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
          if (grid[r][c] === num) {
            return false;
          }
        }
      }
  
      return true;
    }
  
    // Reset the game to the original puzzle state
    function resetGame() {
      puzzle = originalPuzzle.map(row => row.slice());  // Reset puzzle
      initializeGrid();
    }
  
    function generateSudoku() {
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        fillBoard(board);
        removeNumbers(board, 40); // Adjust the number of removed cells for difficulty
        return board;
    }
    
    function fillBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = shuffleArray([...Array(9).keys()].map(x => x + 1)); // Randomly shuffle numbers 1-9
                    for (const num of numbers) {
                        if (isValidMove(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard(board)) {
                                return true;
                            }
                            board[row][col] = 0; // Backtrack
                        }
                    }
                    return false; // No valid number found
                }
            }
        }
        return true; // Board is completely filled
    }
    
    function removeNumbers(board, count) {
        let removed = 0;
        while (removed < count) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (board[row][col] !== 0) {
                const backup = board[row][col];
                board[row][col] = 0; // Remove the number
    
                // Check if the board is still solvable
                const tempBoard = board.map(r => r.slice()); // Create a copy of the board
                if (!isSolvable(tempBoard)) {
                    board[row][col] = backup; // Restore the number if not solvable
                } else {
                    removed++;
                }
            }
        }
    }
    
    function isSolvable(board) {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) return true; // No empty cells means it's solved
    
        const [row, col] = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
                board[row][col] = num;
                if (isSolvable(board)) {
                    return true;
                }
                board[row][col] = 0; // Backtrack
            }
        }
        return false;
    }
    
    function findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return [row, col];
            }
        }
        return null;
    }
    
    // Helper function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
  });
  