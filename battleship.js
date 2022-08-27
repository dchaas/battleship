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

  return { hit, len, isSunk };
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

  return { board, placeShip, receiveAttack, allSunk };
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

  return { name, gameBoard, guessed, guess };
};

const render = (() => {
  return {};
})();

const Game = (() => {
  return {};
})();

module.exports = { Ship, Gameboard, Player, render, Game };
