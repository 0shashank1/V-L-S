

const gameBoard = function () {
    let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let turn = 0;

    const boardReset = () => {
      board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      turn = 0;
    };

    const playMove = function (x) {
      if (/[1-9]/.test(x.toString())) {
        if (board[x - 1] === 'X' || board[x - 1] === 'O') return;
        board[x - 1] = turn === 0 ? 'X' : 'O';
        turn = 1 - turn;
      }
    };

    const readBoard = () => board;

    const checkStatus = function () {
      let str = readBoard().join("");

      const winChecker = (p) => {
        const lines = [
          str.slice(0, 3),
          str.slice(3, 6),
          str.slice(6, 9),
          str[0] + str[3] + str[6],
          str[1] + str[4] + str[7],
          str[2] + str[5] + str[8],
          str[0] + str[4] + str[8],
          str[2] + str[4] + str[6],
        ];
        return lines.includes(p + p + p);
      };

      if (winChecker('X')) return 1;
      if (winChecker('O')) return 2;
      if (!/[1-9]/.test(str)) return 3;
      return 0;
    };

    return { playMove, boardReset, readBoard, checkStatus };
}(); //game Board




const Player = function (str) {
  let name = str;
  const id = str;
  let score = 0;
  const plusScore = () => { score++; };
  const readScore = () => score;
  return { name, plusScore, readScore, id };
};

const player1 = Player('player1');
const player2 = Player('player2');




const displayController = function () {
  let freezeGame = false;

  const getColor = (playerIndex) => {
    return document.getElementById(playerIndex === 0 ? 'player1Color' : 'player2Color').value;
  };

  const renderGame = function () {
    if (!freezeGame) {
      let board = gameBoard.readBoard();
      let nodes = document.querySelectorAll("#gameBoard input");

      for (let i = 0; i < 9; i++) {
        nodes[i].value = board[i];

        if (board[i] === 'X') {
          nodes[i].style.backgroundColor = getColor(0);
          nodes[i].style.color = "#fff";
        } else if (board[i] === 'O') {
          nodes[i].style.backgroundColor = getColor(1);
          nodes[i].style.color = "#fff";
        } else {
          nodes[i].style.backgroundColor = "#fff";
          nodes[i].style.color = "#333";
        }
      }

      let status = gameBoard.checkStatus();
      if (status) {
        freezeGame = true;
        let div = document.querySelector('.gameMessage');
        if (status === 1) {
          div.innerHTML = `${player1.name} wins!`;
          player1.plusScore();
        } else if (status === 2) {
          div.innerHTML = `${player2.name} wins!`;
          player2.plusScore();
        } else {
          div.innerHTML = `It's a tie.`;
        }
      }
    }

    const changeName = function (player) {
      let btn = document.createElement('input');
      btn.type = 'button';
      btn.value = 'Change Name';
      btn.addEventListener('click', () => {
        let playerDiv = document.getElementById(player.id);
        playerDiv.innerHTML = '';
        let inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.className = `${player.id}Change`;

        let inputBtn = document.createElement('input');
        inputBtn.type = 'button';
        inputBtn.value = 'Submit';

        inputBtn.addEventListener('click', () => {
          player.name = document.querySelector(`.${player.id}Change`).value;
          playerDiv.innerHTML = player.name + ': ' + player.readScore() ;
          playerDiv.append(changeName(player));
        });

        playerDiv.append(inputText, inputBtn);
      });
      return btn;
    }; //change Name

    const showPlayer = (player) => {
      let div = document.getElementById(player.id);
      div.innerHTML = player.name + ': ' + player.readScore();
      div.append(changeName(player));
    }; //show player

    showPlayer(player1);
    showPlayer(player2);
  }; //render game

  const createBoard = function () {
    let div = document.getElementById("gameBoard");
    div.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
      let btn = document.createElement('input');
      btn.type = 'button';
      btn.value = i;

      btn.addEventListener('click', function () {
        if (freezeGame) return;
        let index = parseInt(this.value) - 1;
        if (!['X', 'O'].includes(gameBoard.readBoard()[index])) {
          gameBoard.playMove(this.value);
          renderGame();
        }
      });

      div.append(btn);
    }
    renderGame();
  };  //createBoard

  const addResetBtn = function () {
    let resetBtn = document.getElementById('reset');
    let inputBtn = document.createElement('input');
    inputBtn.type = 'button';
    inputBtn.value = 'RESET';

    inputBtn.addEventListener('click', () => {
      gameBoard.boardReset();
      freezeGame = false;
      document.querySelector('.gameMessage').innerHTML = '';
      renderGame();
    });  //end of addResetBtn

    resetBtn.append(inputBtn);
  };

  createBoard();
  addResetBtn();
}();   //displayController;
