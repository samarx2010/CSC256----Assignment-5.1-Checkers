// constant variables to use for the game
const SQUARES = 8;
const gameDiv = document.getElementById('game');
let board, turn, selected, moves;

// Initialize the game
function resetGame() {
    board = [];
    turn = 'red';
    selected = null;
    moves = [];
    for (let row = 0; row < SQUARES; row++) {
        board[row] = [];
        for (let col = 0; col < SQUARES; col++) {
            if ((row + col) % 2 === 1) {
                if (row < 3) board[row][col] = 'black';
                else if (row > 4) board[row][col] = 'red';
                else board[row][col] = null;
            } else {
                board[row][col] = null;
            }
        }
    }
    drawBoard();
}

// initialize the board
function drawBoard() {
    gameDiv.innerHTML = '';
    const boardDiv = document.createElement('div');
    boardDiv.className = 'board';
    for (let row = 0; row < SQUARES; row++) {
        for (let col = 0; col < SQUARES; col++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;
            if (selected && selected[0] === row && selected[1] === col) {
                square.classList.add('selected');
            }
            if (board[row][col]) {
                const piece = document.createElement('div');
                const type = board[row][col];
                let pieceClass = 'piece ' + (type.includes('red') ? 'red' : 'black');
                if (type.includes('king')) pieceClass += ' king';
                piece.className = pieceClass;
                square.appendChild(piece);
            }
            square.onclick = () => onSquareClick(row, col);
            boardDiv.appendChild(square);
        }
    }
    gameDiv.appendChild(boardDiv);
    showTurn();
}

// Show text of who's turn it is
function showTurn() {
    let h2 = document.getElementById('turnInfo');
    if (!h2) {
        h2 = document.createElement('h2');
        h2.id = 'turnInfo';
        document.body.insertBefore(h2, gameDiv);
    }
    h2.textContent = turn.charAt(0).toUpperCase() + turn.slice(1) + "'s turn";
}

// When clicking on a square using the pointer
function onSquareClick(row, col) {
    if (selected) {
        // Try to move piece to new location
        if (isValidMove(selected[0], selected[1], row, col)) {
            makeMove(selected[0], selected[1], row, col);
            selected = null;
        } else if (board[row][col] && board[row][col].includes(turn)) {
            selected = [row, col];
        } else {
            selected = null;
        }
    } else if (board[row][col] && board[row][col].includes(turn)) {
        selected = [row, col];
    }
    drawBoard();
}

// to check to see if the move is valid for a checkers game
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece || board[toRow][toCol]) return false;
    const dir = piece.includes('red') ? -1 : 1;
    const king = piece.includes('king');
    // Normal move
    if (Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 1) {
        if ((toRow - fromRow === dir) || (king && Math.abs(toRow - fromRow) === 1)) {
            return true;
        }
    }
    // Capture moves of both red and black pieces
    if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        const midPiece = board[midRow][midCol];
        if (midPiece && !midPiece.includes(turn)) {
            if ((toRow - fromRow === 2 * dir) || (king && Math.abs(toRow - fromRow) === 2)) {
                return true;
            }
        }
    }
    return false;
}

// Capture pieces and promotion of pieces to king pieces and handles a loop for who's turn it is
function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;
    // Promotion of pieces
    if (piece === 'red' && toRow === 0) board[toRow][toCol] = 'red king';
    else if (piece === 'black' && toRow === SQUARES-1) board[toRow][toCol] = 'black king';
    else board[toRow][toCol] = piece;

    // Handle captures of pieces
    if (Math.abs(toRow - fromRow) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        board[midRow][midCol] = null;
    }
    // Switch turns based on either red or black pieces
    turn = (turn === 'red') ? 'black' : 'red';
}

// Initialize on load
resetGame();