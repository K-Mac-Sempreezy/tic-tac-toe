const players = (() => {
  const createPlayer = (name, marker) => {
    return { name, marker };
  };

  return {
    createPlayer,
  };
})();

const gameBoard = (() => {
  //  board = [
  //    0,1,2
  //    3,4,5
  //    6,7,8
  //  ]

  const board = ['', '', '', '', '', '', '', '', ''];

  let grid = document.querySelector('.grid');

  let gameOver = true;

  const buildBoard = () => {
    board.forEach((box, index) => {
      let square = document.createElement('div');
      square.classList.add('square');
      square.classList.add('square_hover');
      square.dataset.index = index;
      square.addEventListener('click', (e) => {
        // game is over, or square has already been marked: do nothing.
        if (gameOver || square.textContent !== '') {
          return;
        } 
        let player = game.activePlayer();
        square.classList.remove('square_hover');
        square.textContent = player.marker;
        board[e.target.dataset.index] = player.marker;
        game.checkWinner();
        game.updateSquareCount();
        game.alertPlayer();
      });
      grid.appendChild(square);
    });
    displayController.displayHandler();
    displayController.submitNames();
  };

  const passResult = (val) => {
    return val ? (gameOver = true) : (gameOver = false);
  };

  const resetBoard = () => {
    while (grid.firstElementChild) {
      grid.firstElementChild.remove();
    }

    board.splice(0, board.length);
    for (let i = 0; i < 9; i++) {
      board[i] = '';
    }

    gameOver = false;
    displayController.displayHandler();
    buildBoard();
  };

  return {
    board,
    passResult,
    resetBoard,
    buildBoard,
  };
})();

const game = (() => {
  //starting variables
  let remainingSquares = 9;
  let winner = false;
  let tie = false;

  const alertPlayer = () => {
    if (winner || tie) {
      alertResult();
      return;
    } else {
      displayController.updatePlayerTurn();
    }
  };

  const activePlayer = () => {
    return displayController.updatePlayer(remainingSquares);
  };

  const updateSquareCount = () => {
    if (winner === true) {
      return;
    }
    remainingSquares -= 1;
    if (remainingSquares < 1) {
      tie = true;
    }
  };

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const checkWinner = () => {
    let activePlayer = displayController.checkPlayer();
    winningCombos.forEach((combo, index) => {
      if (
        gameBoard.board[combo[0]] === activePlayer.marker &&
        gameBoard.board[combo[1]] === activePlayer.marker &&
        gameBoard.board[combo[2]] === activePlayer.marker
      ) {
        winner = true;
      } else {
        return;
      }
    });
  };

  const alertResult = () => {
    if (winner) {
      displayController.displayWin();
      gameBoard.passResult(winner);
    } else if (tie) {
      displayController.displayTie();
      gameBoard.passResult(tie);
    }
    displayController.playAgain();
  };

  const reset = () => {
    gameBoard.resetBoard();
    remainingSquares = 9;
    winner = false;
    tie = false;
    displayController.resetPlayers();
    displayController.displayReset();
  };

  return {
    activePlayer,
    checkWinner,
    updateSquareCount,
    alertPlayer,
    reset,
  };
})();

const displayController = (() => {
  const button = document.querySelector('button');
  const p1 = document.getElementById('p1-label');
  const p2 = document.getElementById('p2-label');
  const player1Input = document.getElementById('p1');
  const player2Input = document.getElementById('p2');
  const submit1 = document.getElementById('submit1');
  const submit2 = document.getElementById('submit2');

  //players
  let playerOne;
  let playerTwo;
  let currentPlayer;

  const submitNames = () => {
    submit1.addEventListener('click', playerNames);
    submit2.addEventListener('click', playerNames);
  };

  const playerNames = (e) => {
    e.preventDefault();
    if (e.target.id === 'submit1') {
      if (player1Input.value === '') {
        player1Input.value = 'Player One';
      }
      playerOne = players.createPlayer(player1Input.value, 'x');
      displayName(e);
    } else {
      if (player2Input.value === '') {
        player2Input.value = 'Player Two';
      }
      playerTwo = players.createPlayer(player2Input.value, 'o');
      displayName(e);
    }
    currentPlayer = playerOne;
    player1Input.value = '';
    player2Input.value = '';
  };

  const updatePlayer = (remainingSquares) => {
    if (remainingSquares === 9) {
      currentPlayer = playerOne;
    } else {
      currentPlayer === playerOne
        ? (currentPlayer = playerTwo)
        : (currentPlayer = playerOne);
    }
    return currentPlayer;
  };

  const checkPlayer = () => {
    return currentPlayer;
  };

  const playAgainButton = () => {
    button.addEventListener('click', game.reset);
    button.style.visibility = 'visible';
  };

  const displayHandler = () => {
    button.style.visibility = 'hidden';
  };

  const displayWin = () => {
    if (currentPlayer === playerOne) {
      p1.textContent = `${currentPlayer.name.toUpperCase()} WINS!!`;
    } else {
      p2.textContent = `${currentPlayer.name.toUpperCase()} WINS!!`;
    }
  };

  const displayTie = () => {
    p1.classList.remove('inactive');
    p2.classList.remove('inactive');
    p1.textContent = 'Tie Game';
    p2.textContent = 'Tie Game';
  };

  const displayName = (e) => {
    if (e.target.id === 'submit1') {
      p1.textContent = playerOne.name;
      player1Input.style.visibility = 'hidden';
      submit1.style.visibility = 'hidden';
    } else if (e.target.id === 'submit2') {
      p2.textContent = playerTwo.name;
      player2Input.style.visibility = 'hidden';
      submit2.style.visibility = 'hidden';
    }

    startGame();
  };

  const startGame = () => {
    if (!playerOne || !playerTwo) {
      return;
    }
    game.reset();
  };

  const playAgain = () => {
    button.style.visibility = 'visible';
    button.removeEventListener('click', displayHandler);
    button.addEventListener('click', game.reset);
    button.addEventListener('click', displayReset);
  };

  const displayReset = () => {
    button.style.visibility = 'hidden';
    p1.textContent = `${currentPlayer.name} your move`;
    p2.textContent = playerTwo.name;
    p1.classList.remove('inactive');
    p2.classList.add('inactive');
  };

  const resetPlayers = () => {
    currentPlayer = playerOne;
  };

  const updatePlayerTurn = () => {
    if (currentPlayer === playerOne) {
      p2.textContent = `${playerTwo.name} your move`;
      p2.classList.remove('inactive');
      p1.classList.add('inactive');
      p1.textContent = playerOne.name;
    } else {
      p1.textContent = `${playerOne.name} your move`;
      p1.classList.remove('inactive');
      p2.classList.add('inactive');
      p2.textContent = playerTwo.name;
    }
  };

  return {
    displayHandler,
    playAgain,
    displayTie,
    displayWin,
    playAgainButton,
    displayReset,
    playerNames,
    resetPlayers,
    submitNames,
    updatePlayer,
    checkPlayer,
    updatePlayerTurn,
  };
})();

const init = (() => {
  gameBoard.buildBoard();
})();
