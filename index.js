let board;
let ctx;
let bug;
let intervalID;

const GAME_STATE_NEW = "NEW";
const GAME_STATE_STARTED = "STARTED";

const GAME_SPEED = 2000;

const CELL_HEIGHT = 100;
const CELL_WIDTH = 100;
const BUG_URL = "./img/charizard.png";

const NUM_ROW = 4;
const NUM_COL = 9;

let game = {
  board: [],
  row: 0,
  column: 7,
  score: 0,
  interval: GAME_SPEED,
  gameState: GAME_STATE_NEW,
};

let btn_start;
let btn_reset_speed;
let btn_reset_score;
let score;
let gameStatus;

window.onload = () => {
  console.log("Window loaded...");

  // Initialize the board
  board = document.getElementById("board");
  ctx = board.getContext("2d");

  // Set game board dimensions
  board.width = 900;
  board.height = 400;
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, board.width, board.height);

  board.addEventListener("mousedown", (e) => {
    if (game.gameState == GAME_STATE_STARTED) {
      let { x, y } = getMouseCoords(board, e);

      // Calculate mouse click row and column
      [mouseCol, mouseRow] = [Math.floor(x / 100), Math.floor(y / 100)];

      // Check if there's a hit
      if (mouseCol == game.column && mouseRow == game.row) {
        clearInterval(intervalID);
        game.score++;
        scoreUpdate();
        reset();
        draw(game.column, game.row);

        setTimer();
      }
    }
  });

  btn_start = document.getElementById("start");
  btn_reset_score = document.getElementById("reset_score");
  btn_reset_speed = document.getElementById("reset_speed");
  score = document.getElementById("score");
  gameStatus = document.getElementById("gameStatus");

  // Set event listeners
  btn_start.addEventListener("click", (e) => {
    if (game.gameState == GAME_STATE_NEW) {
      game.score = 0;
      game.gameState = GAME_STATE_STARTED;
      reset();
      start();
    }
  });

  btn_reset_score.addEventListener("click", (e) => {
    game.score = 0;
    scoreUpdate();
    console.log("score");
  });

  btn_reset_speed.addEventListener("click", (e) => {
    if ((game.gameState = GAME_STATE_STARTED)) {
      resetSpeed();
      clearInterval(intervalID);
      setTimer();
    }
  });

  updateGameStatus();
};

// Start game
const start = () => {
  updateGameStatus();
  draw(game.column, game.row);
};

// Clean up board and reset for new render
const reset = () => {
  clearOldPosition(game.column, game.row);
  generateNewPosition();
};

// Update game score
const scoreUpdate = () => {
  score.innerHTML = game.score;

  // Update speed
  game.interval -= 100;
};

// Reset speed
const resetSpeed = () => {
  game.interval = GAME_SPEED;
};

// Update Game Status
const updateGameStatus = () => {
  if (game.gameState == GAME_STATE_STARTED) {
    gameStatus.innerHTML = "GO GET CHARIZARD!";
  } else {
    gameStatus.innerHTML = "PRESS START TO PLAY!";
  }
};

// Set random generation
const setTimer = () => {
  intervalID = setInterval(() => {
    reset();
    draw(game.column, game.row);
  }, game.interval);
};

// Draw the bug
const draw = (i, j) => {
  // Generate bug
  bug = new Image();
  bug.src = BUG_URL;
  bug.onload = () => {
    ctx.fillRect(i * 100, j * 100, CELL_WIDTH, CELL_HEIGHT);
    ctx.drawImage(bug, i * 100, j * 100, CELL_WIDTH, CELL_HEIGHT);
  };
};

// Clear old position
const clearOldPosition = (i, j) => {
  ctx.clearRect(i * 100, j * 100, CELL_WIDTH, CELL_HEIGHT);
};

// Create a new random location for the bug
const generateNewPosition = () => {
  let currentRow = game.row;
  let currentColumn = game.column;
  let newRow, newColumn;

  do {
    newRow = getRandomInt(0, NUM_ROW);
    newColumn = getRandomInt(0, NUM_COL);
  } while (newRow != currentRow && newColumn != currentColumn);

  game.row = newRow;
  game.column = newColumn;
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Get mouse coords inside canvas
const getMouseCoords = (board, e) => {
  let rect = board.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};
