let curBoard;
let curPlayer;
let curHeldPiece;
let curHeldPieceStartingPosition;


let whiteTime = 600; 
let blackTime = 600;
let timerInterval;
let isWhiteTurn = true;


function startGame() {
    const starterPosition = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];

    const starterPlayer = 'white';
    loadPosition(starterPosition, starterPlayer);
    initTimers();
}

function loadPosition(position, playerToMove) {
    curBoard = position;
    curPlayer = playerToMove;
    isWhiteTurn = playerToMove === 'white';

    
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => piece.remove());

    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (position[i][j] !== '.') {
                loadPiece(position[i][j], [i + 1, j + 1]);
            }
        }
    }
}

function loadPiece(piece, position) {
    const squareElement = document.getElementById(`${position[0]}${position[1]}`);
    const pieceElement = document.createElement('img');
    
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = false;
    pieceElement.src = getPieceImageSource(piece);
    
    squareElement.appendChild(pieceElement);
}

function getPieceImageSource(piece) {
    const pieceImages = {
        'R': 'assets/black_rook.png',
        'N': 'assets/black_knight.png',
        'B': 'assets/black_bishop.png',
        'Q': 'assets/black_queen.png',
        'K': 'assets/black_king.png',
        'P': 'assets/black_pawn.png',
        'r': 'assets/white_rook.png',
        'n': 'assets/white_knight.png',
        'b': 'assets/white_bishop.png',
        'q': 'assets/white_queen.png',
        'k': 'assets/white_king.png',
        'p': 'assets/white_pawn.png'
    };
    return pieceImages[piece];
}


function initTimers() {
    updateTimerDisplay();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval); 
    timerInterval = setInterval(() => {
        if (isWhiteTurn) {
            whiteTime--;
        } else {
            blackTime--;
        }
        
        updateTimerDisplay();
        
        if (whiteTime <= 0) {
            endGame("Черные выиграли по времени!");
        } else if (blackTime <= 0) {
            endGame("Белые выиграли по времени!");
        }
    }, 1000);
}

function updateTimerDisplay() {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    document.getElementById('white-time').textContent = formatTime(whiteTime);
    document.getElementById('black-time').textContent = formatTime(blackTime);
}


function highlightPossibleMoves(position) {
    clearHighlights();
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (validateMovement(position, [i, j])) {
                const square = document.getElementById(`${i + 1}${j + 1}`);
                square.classList.add('possible-move');
            }
        }
    }
}

function clearHighlights() {
    document.querySelectorAll('.square').forEach(square => {
        square.classList.remove('possible-move');
    });
}


function endGame(message) {
    clearInterval(timerInterval);
    document.getElementById('game-result-text').textContent = message;
    document.getElementById('game-over-modal').style.display = 'block';
}

function restartGame() {
   
    whiteTime = 600;
    blackTime = 600;
    isWhiteTurn = true;
    
    
    document.querySelectorAll('.piece').forEach(piece => piece.remove());
    
  
    startGame();
   
    document.getElementById('game-over-modal').style.display = 'none';
}

function isFriendlyPieceOnEndingPosition(endingPosition, pieceColor) {
    const piece = curBoard[endingPosition[0]][endingPosition[1]];
    if (piece === '.') return false;
    return (piece === piece.toUpperCase() && pieceColor === 'black') || 
           (piece === piece.toLowerCase() && pieceColor === 'white');
}

function isEnemyPieceOnEndingPosition(endingPosition, pieceColor) {
    const piece = curBoard[endingPosition[0]][endingPosition[1]];
    if (piece === '.') return false;
    return (piece === piece.toUpperCase() && pieceColor === 'white') || 
           (piece === piece.toLowerCase() && pieceColor === 'black');
}

function validatePathIsBlocked(start, end) {
    const dx = Math.sign(end[1] - start[1]);
    const dy = Math.sign(end[0] - start[0]);
    let x = start[1] + dx;
    let y = start[0] + dy;
    
    while (x !== end[1] || y !== end[0]) {
        if (curBoard[y][x] !== '.') return true;
        x += dx;
        y += dy;
    }
    return false;
}

function validateRookMovement(start, end) {
    const piece = curBoard[start[0]][start[1]];
    const pieceColor = piece === piece.toUpperCase() ? 'black' : 'white';
    
    
    if (start[0] !== end[0] && start[1] !== end[1]) return false;
    
   
    if (validatePathIsBlocked(start, end)) return false;
    
   
    if (isFriendlyPieceOnEndingPosition(end, pieceColor)) return false;
    
    return true;
}

function validateKnightMovement(start, end) {
    const piece = curBoard[start[0]][start[1]];
    const pieceColor = piece === piece.toUpperCase() ? 'black' : 'white';
    const dx = Math.abs(start[1] - end[1]);
    const dy = Math.abs(start[0] - end[0]);
    
   
    if (!((dx === 2 && dy === 1) || (dx === 1 && dy === 2))) return false;
    
   
    if (isFriendlyPieceOnEndingPosition(end, pieceColor)) return false;
    
    return true;
}

function validateBishopMovement(start, end) {
    const piece = curBoard[start[0]][start[1]];
    const pieceColor = piece === piece.toUpperCase() ? 'black' : 'white';
    const dx = Math.abs(start[1] - end[1]);
    const dy = Math.abs(start[0] - end[0]);
    
   
    if (dx !== dy) return false;
    
   
    if (validatePathIsBlocked(start, end)) return false;
    
    
    if (isFriendlyPieceOnEndingPosition(end, pieceColor)) return false;
    
    return true;
}

function validateQueenMovement(start, end) {
   
    return validateRookMovement(start, end) || validateBishopMovement(start, end);
}

function validateKingMovement(start, end) {
    const piece = curBoard[start[0]][start[1]];
    const pieceColor = piece === piece.toUpperCase() ? 'black' : 'white';
    const dx = Math.abs(start[1] - end[1]);
    const dy = Math.abs(start[0] - end[0]);
    
    
    if (dx > 1 || dy > 1) return false;
    
    
    if (isFriendlyPieceOnEndingPosition(end, pieceColor)) return false;
    
    return true;
}

function validatePawnMovement(color, start, end) {
    const piece = curBoard[start[0]][start[1]];
    const pieceColor = piece === piece.toUpperCase() ? 'black' : 'white';
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    const dx = end[1] - start[1];
    const dy = end[0] - start[0];
    
  
    if (dx === 0 && dy === direction && curBoard[end[0]][end[1]] === '.') {
        return true;
    }
    
    
    if (dx === 0 && dy === 2 * direction && start[0] === startRow && 
        curBoard[start[0] + direction][start[1]] === '.' && 
        curBoard[end[0]][end[1]] === '.') {
        return true;
    }
    
    
    if (Math.abs(dx) === 1 && dy === direction && 
        isEnemyPieceOnEndingPosition(end, pieceColor)) {
        return true;
    }
    
    return false;
}

function validateMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
    
    switch (boardPiece) {
        case 'r':
        case 'R': return validateRookMovement(startingPosition, endingPosition);
        case 'n':
        case 'N': return validateKnightMovement(startingPosition, endingPosition);
        case 'b':
        case 'B': return validateBishopMovement(startingPosition, endingPosition);
        case 'q':
        case 'Q': return validateQueenMovement(startingPosition, endingPosition);
        case 'k': 
        case 'K': return validateKingMovement(startingPosition, endingPosition);
        case 'p': return validatePawnMovement('white', startingPosition, endingPosition);
        case 'P': return validatePawnMovement('black', startingPosition, endingPosition);
        default: return false;
    }
}


function setPieceHoldEvents() {
    let mouseX = 0, mouseY = 0;
    let movePieceInterval;
    let hasIntervalStarted = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        clearInterval(movePieceInterval);
        
        if (curHeldPiece) {
            const boardElement = document.querySelector('.board');
            const boardRect = boardElement.getBoundingClientRect();
            
            if (mouseX >= boardRect.left && mouseX <= boardRect.right &&
                mouseY >= boardRect.top && mouseY <= boardRect.bottom) {
                
                const squareSize = boardRect.width / 8;
                const col = Math.floor((mouseX - boardRect.left) / squareSize);
                const row = Math.floor((mouseY - boardRect.top) / squareSize);
                
                const releasePos = [row, col];
                
                if (!(releasePos[0] === curHeldPieceStartingPosition[0] && 
                      releasePos[1] === curHeldPieceStartingPosition[1])) {
                    if (validateMovement(curHeldPieceStartingPosition, releasePos)) {
                        movePiece(curHeldPiece, curHeldPieceStartingPosition, releasePos);
                    }
                }
            }
            
            curHeldPiece.style.position = 'static';
            curHeldPiece.style.zIndex = 'auto';
            curHeldPiece = null;
            clearHighlights();
        }
        
        hasIntervalStarted = false;
    });

    document.querySelectorAll('.piece').forEach(piece => {
        piece.addEventListener('mousedown', (e) => {
            if (hasIntervalStarted) return;
            
            
            const pieceColor = piece.id === piece.id.toUpperCase() ? 'black' : 'white';
            if (pieceColor !== curPlayer) return;
            
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            piece.style.position = 'absolute';
            piece.style.zIndex = '1000';
            curHeldPiece = piece;
            
            const parentId = piece.parentElement.id;
            curHeldPieceStartingPosition = [
                parseInt(parentId[0]) - 1,
                parseInt(parentId[1]) - 1
            ];
            
            
            highlightPossibleMoves(curHeldPieceStartingPosition);
            
            movePieceInterval = setInterval(() => {
                piece.style.top = `${mouseY - piece.offsetHeight / 2}px`;
                piece.style.left = `${mouseX - piece.offsetWidth / 2}px`;
            }, 10);
            
            hasIntervalStarted = true;
        });
    });
}

function movePiece(piece, startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
    
    if (boardPiece !== '.') {
        
        if ((boardPiece === boardPiece.toUpperCase() && curPlayer === 'black') ||
            (boardPiece === boardPiece.toLowerCase() && curPlayer === 'white')) {
            
           
            const destSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);
            if (destSquare.firstChild) {
                destSquare.removeChild(destSquare.firstChild);
            }
            
           
            curBoard[startingPosition[0]][startingPosition[1]] = '.';
            curBoard[endingPosition[0]][endingPosition[1]] = boardPiece;
            
            
            piece.style.position = 'static';
            piece.style.zIndex = 'auto';
            destSquare.appendChild(piece);
            
            
            curPlayer = curPlayer === 'white' ? 'black' : 'white';
            isWhiteTurn = !isWhiteTurn;
            startTimer(); 
            
            
            if (isCheckmate()) {
                endGame(`${curPlayer === 'white' ? 'Черные' : 'Белые'} выиграли по мату!`);
            }
        }
    }
}

function isCheckmate() {
    
    return false;
}


document.addEventListener('DOMContentLoaded', () => {
    startGame();
    setPieceHoldEvents();
    document.getElementById('restart-button').addEventListener('click', restartGame);
});
