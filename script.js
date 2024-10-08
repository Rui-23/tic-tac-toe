function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const putToken = (row, column, playerToken) => {
    if (board[row][column].getValue() === ' ') {
      board[row][column].addToken(playerToken);
    } else {
      return;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  };

  return {getBoard, putToken, printBoard};
}

function Cell() {
  let value = ' ';
  const addToken = (playerToken) => {
    value = playerToken;
  };
  const getValue = () => value;
  return {addToken, getValue};
}

function getPlayerName() {
  name = prompt("What's your name?");
  return name;
}

function getOpponentName() {
  name = prompt("What's your opponent's name?");
  return name;
}

function GameController(playerOneName = "Player A",
  playerTwoName = "Player B") {
  const board = GameBoard();
  const players = [
    {
      name: getPlayerName(),
      token: 'O'
    },
    {
      name: getOpponentName(),
      token: 'X'
    }
  ];

  let activePlayer = players[0];
  let gameOver = false;
  players[0].win = 0;
  players[1].win = 0;
  let tie = 0;

  const switchPlayerTurn = () => {
    activePlayer = 
      activePlayer === players[0] ? 
      players[1]: players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    document.querySelector('.turn').textContent = `${getActivePlayer().name}'s turn...`;
    
    document.querySelector('.playerOne').textContent = `🤠 ${players[0].name}: ${players[0].win}`;
    document.querySelector('.playerTwo').textContent = `🤖 ${players[1].name}: ${players[1].win}`;
    document.querySelector('.tie').textContent = "☃️ Tie: " + tie;
  };

  const playRound = (row, column) => {
    if(gameOver) return;

    board.putToken(row, column, getActivePlayer().token);
    console.log(`Dropping ${getActivePlayer().name}'s token into row ${row} column ${column}.`);
    
    const winner = checkWinnerOrTie();
    if(winner) {
      if(winner === "tie") {
        tie += 1;
        document.querySelector('.winner').textContent = "It's a tie!";
        document.querySelector('.tie').textContent = `☃️ Tie: ${tie}`;
        console.log("It's a tie!");
      } else {
        document.querySelector('.winner').textContent = `${winner.name} wins!`;
        getActivePlayer().win += 1;
        document.querySelector('.playerOne').textContent = `🤠 ${players[0].name}: ${players[0].win}`;
        document.querySelector('.playerTwo').textContent = `🤖 ${players[1].name}: ${players[1].win}`;
        console.log(`${winner.name} wins!`);
      }
      document.querySelector('.turn').style.display = "none";
      document.querySelector('.restart').style.display = 'block';
      gameOver = true;
      return;
    }
    switchPlayerTurn();
    printNewRound();
  }; 
  
  const checkWinnerOrTie= () => {
    const boardData = board.getBoard();
    const numRows = boardData.length;
    const numCols = boardData[0].length;

    //check for horizontal win
    for (let row = 0; row < numRows; row++) {
      let col = 0;
      if (boardData[row][col].getValue() !== ' ' && boardData[row][col].getValue() === boardData[row][col + 1].getValue() && 
      boardData[row][col].getValue() === boardData[row][col + 2].getValue()) {
        return getActivePlayer();
      }
    }

    //check for vertical win
    for (let col = 0; col < numCols; col++) {
      let row = 0;
      if (boardData[row][col].getValue() !== ' ' &&
      boardData[row][col].getValue() === boardData[row + 1][col].getValue() &&
      boardData[row][col].getValue() === boardData[row + 2][col].getValue()) {
        return getActivePlayer();
      }
    }

    //check for positive slope win 
    for (let row = 0; row <= numRows - 3; row++) {
      let col = row;
      if (boardData[row][col].getValue() !== ' ' && 
      boardData[row][col].getValue() === boardData[row + 1][col + 1].getValue() && 
      boardData[row][col].getValue() === boardData[row + 2][col + 2].getValue()) {
        return getActivePlayer();
      }
    }

    //check for negtive slope win
    for (let col = 2; col < numCols; col++) {
      let row = 0;
      if (boardData[row][col].getValue() !== ' ' &&
      boardData[row][col].getValue() === boardData[row + 1][col - 1].getValue() &&
      boardData[row][col].getValue() === boardData[row + 2][col - 2].getValue()) {
        return getActivePlayer();
      }
    }

    //check for tie
    if (isBoardFull()) {
      return 'tie';
    }
    //if no winner or tie yet
    return null;
  };

  const isBoardFull = () => {
    const boardData = board.getBoard();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if(boardData[row][col].getValue() === ' ') {
          return false;
        }
      }
    }
    return true;
  };

  const restart = () => {
    gameOver = false;
    board.getBoard().forEach(row => row.forEach(cell => cell.addToken(' ')));
    document.querySelector('.winner').textContent = "";
    document.querySelector('.restart').style.display = 'none';
    document.querySelector('.turn').style.display = "block";

    printNewRound();
  };
  printNewRound();

  return {getActivePlayer, restart, playRound, getBoard: board.getBoard};
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const winnerDiv = document.querySelector('.winner');
  const restartButton = document.querySelector('.restart');

  const updateScreen = () => {
    boardDiv.textContent = "";

    const boardData = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Render board squares     
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = row;
        cellButton.dataset.column = col;
        cellButton.textContent = boardData[row][col].getValue();
        boardDiv.appendChild(cellButton);
      }
    }
  };

  // Add event listener for the board
  boardDiv.addEventListener("click", clickHandlerBoard);
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow && !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  // Restart button click handler
  restartButton.addEventListener("click", () => {
    winnerDiv.textContent = "";
    game.restart();
    updateScreen();
  });

  // Initial render
  updateScreen();
}

ScreenController();