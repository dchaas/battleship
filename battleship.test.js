const { Ship, Gameboard, Player, render, Game } = require("./battleship.js");

// beforeAll(() => {
//   let ship = Ship();
// });

test("Test the ships hit and sunk function not sunk", () => {
  let ship = Ship(3, 7);
  ship.hit(3);
  ship.hit(4);
  expect(ship.isSunk()).toBe(false);
});

test("Test the ships hit and sunk function sunk", () => {
  let ship = Ship(0, 2);
  ship.hit(0);
  ship.hit(1);
  ship.hit(2);
  expect(ship.isSunk()).toBe(true);
});

test("Test the place ship functionality", () => {
  let game = Gameboard();
  let ship = game.placeShip([0, 0], [0, 3]);
  expect(game.board[0][3]).toEqual(ship);
});

test("Test the receive attack functionality", () => {
  let game = Gameboard();
  let ship = game.placeShip([0, 0], [0, 3]);
  game.receiveAttack(0, 0);
  game.receiveAttack(0, 1);
  game.receiveAttack(0, 2);
  game.receiveAttack(0, 3);
  expect(game.board[0][2].isSunk()).toBe(true);
});

test("Test the all sunk failed functionality", () => {
  let game = Gameboard();
  game.placeShip([0, 0], [0, 3]);
  game.placeShip([1, 0], [1, 3]);
  game.receiveAttack(0, 0);
  game.receiveAttack(0, 1);
  game.receiveAttack(0, 2);
  game.receiveAttack(0, 3);
  expect(game.allSunk()).toBe(false);
});

test("Test the player guess functionality", () => {
  let player = Player("Daniel", false);
  let opp = Player("wall-e", true);

  opp.gameBoard.placeShip([4, 4], [4, 5]);

  player.guess(opp, 1, 0);
  player.guess(opp, 4, 4);
  expect(player.guessed[1][0]).toBe("x");
  expect(player.guessed[4][4]).toBe("hit");
});
