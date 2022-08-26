const Ship = (_length) => {
  let deck = Array(parseFloat(_length)).fill("");
  let len = deck.length;

  const hit = (pos) => {
    deck[pos] = "hit";
  };

  const isSunk = () => {
    let sunk = true;
    deck.forEach((pos) => {
      if (pos !== "hit") {
        sunk = false;
      }
    });
    return sunk;
  };

  return { hit, len, isSunk };
};

module.exports = { Ship };

ship = Ship(5);
console.log(ship);
