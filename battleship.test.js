const { Ship } = require("./battleship.js");

// beforeAll(() => {
//   let ship = Ship();
// });

test("Test the ships hit and sunk function not sunk", () => {
  let ship = Ship(3);
  ship.hit(0);
  ship.hit(1);
  expect(ship.isSunk()).toBe(false);
});

test("Test the ships hit and sunk function sunk", () => {
  let ship = Ship(3);
  ship.hit(0);
  ship.hit(1);
  ship.hit(2);
  expect(ship.isSunk()).toBe(true);
});
