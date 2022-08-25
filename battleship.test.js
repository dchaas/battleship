const { Ship } = require("./battleship.js");

// beforeAll(() => {
//   let ship = Ship();
// });

test("Test the ships hit function", () => {
  let ship = Ship(5);
  expect(ship.hit()).toBe("hello");
});
