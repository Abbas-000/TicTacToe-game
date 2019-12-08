let tttBoard;
let huPlayer = "X";
let comPlayer = "O";
const combWin = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8]
];
var winner = document.getElementById("win");
var losser = document.getElementById("lose");
var draw = document.getElementById("draw");

const cells = document.querySelectorAll(".cell");

function selection(selected) {
  huPlayer = selected;
  document.getElementById("you").innerText = huPlayer;
  comPlayer = selected === "X" ? "O" : "X";
  document.getElementById("computer").innerText = comPlayer;
  document.querySelector(".option").style.display = "none";
  startGame();
}


function startGame() {
  tttBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.backgroundColor = "darkolivegreen";
    cells[i].addEventListener("click", hit, false);
  }
}

function hit(square) {
  if (typeof tttBoard[square.target.id] === "number") {
    turn(square.target.id, huPlayer);
    if (!checkTie()) {
      turn(bestSpot(), comPlayer);
    }
  }
}

function turn(squareId, player) {
  tttBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(tttBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let played = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of combWin.entries()) {
    if (win.every(elem => played.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of combWin[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", hit, false);
  }
  gameWon.player == huPlayer
    ? (winner.style.display = "block")
    : (losser.style.display = "block");
  setTimeout(clearing, 2000);
}

function emptySquares() {
  return tttBoard.filter(s => typeof s == "number");
}

function bestSpot() {
  return minimax(tttBoard, comPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "yellow";
      cells[i].removeEventListener("click", hit, false);
    }
    draw.style.display = "block";
    setTimeout(clearing, 2000);
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, comPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    var move = {};

    move.index = newBoard[availSpots[i]];

    newBoard[availSpots[i]] = player;

    if (player === comPlayer) move.score = minimax(newBoard, huPlayer).score;
    else move.score = minimax(newBoard, comPlayer).score;

    newBoard[availSpots[i]] = move.index;

    if (
      (player === comPlayer && move.score === 10) ||
      (player === huPlayer && move.score === -10)
    )
      return move;
    else moves.push(move);
  }
  let bestMove, bestScore;

  if (player === comPlayer) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function clearing() {
  winner.style.display = "none";
  losser.style.display = "none";
  draw.style.display = "none";
  startGame();
}
