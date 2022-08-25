const Ship = (_length) => {
  let len = _length;
  const hit = () => {
    return "hello";
  };

  return { hit, len };
};

module.exports = { Ship };

ship = Ship(5);
console.log(ship);
