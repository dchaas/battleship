const Ship = (start, end) => {
  let len = Math.abs(start - end) + 1;
  let deck = (() => {
    let tmp = {};
    for (let i = start; i <= end; i++) {
      tmp[i] = "";
    }
    return tmp;
  })();

  const hit = (pos) => {
    deck[pos] = "hit";
  };

  const isSunk = () => {
    let sunk = true;
    Object.keys(deck).forEach((pos) => {
      if (deck[pos] !== "hit") {
        sunk = false;
      }
    });
    return sunk;
  };

  return { hit, len, isSunk, deck };
};

const Gameboard = () => {
  let board = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => "")
  );

  const placeShip = (start, end) => {
    let ship = {};
    if (start[0] === end[0]) {
      ship = Ship(start[1], end[1]);
      for (let i = start[1]; i <= end[1]; i++) {
        board[start[0]][i] = ship;
      }
    } else {
      ship = Ship(start[0], end[0]);
      for (let i = start[0]; i <= end[0]; i++) {
        board[i][start[1]] = ship;
      }
    }
    return ship;
  };

  const _checkShipValid = (start, end) => {
    if (start[0] > 9 || start[1] > 9 || end[0] > 9 || end[1] > 9) {
      return false;
    }
    for (let i = start[0]; i <= end[0]; i++) {
      if (typeof board[i][end[1]] === "object") {
        return false;
      }
    }
    for (let j = start[1]; j <= end[1]; j++) {
      if (typeof board[end[0]][j] === "object") {
        return false;
      }
    }
    return true;
  };

  const _randomShip = (length) => {
    let dir = Math.round(Math.random()); // 0 = horizontal, 1 = vertical
    // get starting x,y
    let x1 = Math.floor(Math.random() * 10);
    let y1 = Math.floor(Math.random() * 10);
    let x2 = 0;
    let y2 = 0;
    if (dir === 0) {
      y2 = y1;
      x2 = length - 1 + x1 < 10 ? x1 + length - 1 : x1 - length - 1;
    } else {
      x2 = x1;
      y2 = length - 1 + y1 < 10 ? y1 + length - 1 : y1 - length - 1;
    }
    let start = [Math.min(x1, x2), Math.min(y1, y2)];
    let end = [Math.max(x1, x2), Math.max(y1, y2)];
    return { start, end };
  };

  const randomPlaceAllShips = () => {
    let shipTypes = [5, 4, 3, 3, 2];
    shipTypes.forEach((ship) => {
      let valid = false;
      while (!valid) {
        let { start, end } = _randomShip(ship);
        if (_checkShipValid(start, end)) {
          placeShip(start, end);
          valid = true;
        }
        console.log(valid);
      }
    });
  };

  const receiveAttack = (x, y) => {
    if (typeof board[x][y] === "object") {
      let tmp = board[x][y];
      if (
        (x < 9 && tmp == board[x + 1][y]) ||
        (x > 0 && tmp == board[x - 1][y])
      ) {
        board[x][y].hit(x);
        return "hit";
      } else {
        board[x][y].hit(y);
        return "hit";
      }
    } else {
      board[x][y] = "x";
      return "x";
    }
  };

  const allSunk = () => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (typeof board[i][j] === "object") {
          if (!board[i][j].isSunk()) {
            return false;
          }
        }
      }
    }
    return true;
  };

  return { board, placeShip, receiveAttack, allSunk, randomPlaceAllShips };
};

const Player = (_name, _ai = false) => {
  let name = _name;
  let gameBoard = Gameboard();
  let ai = _ai;
  let guessed = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => "")
  );

  const guess = (opponent, _x, _y) => {
    let x = _x;
    let y = _y;
    if (ai) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      while (guessed[x][y] !== "") {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }
    }
    guessed[x][y] = opponent.gameBoard.receiveAttack(x, y);
  };

  return { name, gameBoard, guessed, guess, ai };
};

const render = (() => {
  const _p1Name = document.querySelector("#name1");
  const _p2Name = document.querySelector("#name2");

  const _p1Card = document.querySelector("#player1");
  const _p2Card = document.querySelector("#player2");

  const _processGuess = (event, player, opp) => {
    let guessString = event.target.getAttribute("data");
    let x = parseInt(guessString[0]);
    let y = parseInt(guessString[1]);
    player.guess(opp, x, y);
    Boards(player, opp);
  };

  const _Board = (player, opp, board, card) => {
    // clear the board's content first
    card.innerHTML = "";
    // populate dynamically
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let tile = document.createElement("div");
        tile.classList.add("space");
        tile.setAttribute("data", `${i}${j}`);
        tile.addEventListener("click", function (ev) {
          _processGuess(ev, player, opp);
        });
        if (board[i][j] === "") {
          tile.innerHTML = ` `;
        } else if (typeof board[i][j] === "object") {
          if (board[i][j].deck[i] === "hit" || board[i][j].deck[j] === "hit") {
            tile.innerHTML = `x`;
          } else {
            tile.innerHTML = ``;
          }
          tile.classList.add("ship");
        } else if (board[i][j] === "hit") {
          tile.innerHTML = `✓`;
          tile.classList.add("hit");
        } else {
          tile.innerHTML = `${board[i][j]}`;
        }

        card.appendChild(tile);
      }
    }
  };

  const Boards = (player, opp) => {
    _Board(player, opp, player.gameBoard.board, _p1Card);
    _Board(player, opp, player.guessed, _p2Card);
  };

  return { Boards };
})();

const Game = (() => {
  let p1 = {};
  let p2 = {};
  let p1Ready = false;
  let p2Ready = false;

  let guessBoard = document.querySelector("#player2");
  guessBoard.addEventListener("click", () => {
    p1Ready = true;
    p2Ready = true;
    console.log(p1Ready, p2Ready);
  });
  const initGame = () => {
    // create the players
    p1 = Player("Human");
    p2 = Player("PC", true);
    // for now, place ships in advance
    // p1.gameBoard.placeShip([0, 0], [0, 4]);
    // p1.gameBoard.placeShip([1, 5], [1, 9]);
    // p1.gameBoard.placeShip([2, 0], [5, 0]);
    // p1.gameBoard.placeShip([7, 5], [9, 5]);
    // p1.gameBoard.placeShip([4, 4], [4, 7]);

    // p2.gameBoard.placeShip([0, 0], [4, 0]);
    // p2.gameBoard.placeShip([1, 2], [1, 5]);
    // p2.gameBoard.placeShip([5, 5], [8, 5]);
    // p2.gameBoard.placeShip([9, 5], [9, 7]);
    // p2.gameBoard.placeShip([8, 6], [8, 9]);
    p1.gameBoard.randomPlaceAllShips();
    p2.gameBoard.randomPlaceAllShips();

    render.Boards(p1, p2);
    return { p1, p2 };
  };

  async function loop() {
    let { p1, p2 } = initGame();

    let p1Sunk = p1.gameBoard.allSunk();
    let p2Sunk = p2.gameBoard.allSunk();

    render.Boards(p1, p2);
    // // continue while the ships aren't sunk yet
    while (!p1Sunk && !p2Sunk) {
      // player 1's turn
      while (!p1Ready) {
        if (p1.ai) {
          p1.guess(p2);
          render.Boards(p2, p1);
          p1Ready = true;
        } else {
          await new Promise((res) => {
            setTimeout(res, 1000);
          });
        }
      }
      p1Ready = false;
      p2Ready = false;
      // player 1's turn
      while (!p2Ready) {
        if (p2.ai) {
          p2.guess(p1);
          render.Boards(p1, p2);
          p2Ready = true;
        } else {
          await new Promise((res) => {
            setTimeout(res, 1000);
          });
        }
      }
      p1Ready = false;
      p2Ready = false;

      p1Sunk = p1.gameBoard.allSunk();
      p2Sunk = p2.gameBoard.allSunk();
    }
  }

  return { loop };
})();

Game.loop();

module.exports = { Ship, Gameboard, Player, render, Game };
