const { Ship, Gameboard } = require("./battleship.js");

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

test("Test the all sunk true functionality", () => {
  let game = Gameboard();
  game.placeShip([0, 0], [0, 3]);
  game.placeShip([1, 0], [1, 2]);
  game.receiveAttack(0, 0);
  game.receiveAttack(0, 1);
  game.receiveAttack(0, 2);
  game.receiveAttack(0, 3);
  game.receiveAttack(1, 0);
  game.receiveAttack(1, 1);
  game.receiveAttack(1, 2);
  expect(game.allSunk()).toBe(true);
});
