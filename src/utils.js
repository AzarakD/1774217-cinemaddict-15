const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

const getRandomFloat = (a = 0, b = 1, signs = 1) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const divider = Math.pow(10, signs);

  return Math.floor((Math.random() * (max - min + (1 / divider)) + min) * divider) / divider;
};

const getRandomUniqElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  const randomElement = array[randomIndex];
  array.splice(randomIndex, 1);

  return randomElement;
};

const getRandomElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomArray = (array) => {
  const tempArray = array.slice();
  let newArray = new Array(getRandomInteger(1, array.length)).fill('');
  newArray = newArray.map(() => getRandomUniqElement(tempArray));

  return newArray;
};

export {
  getRandomInteger,
  getRandomFloat,
  getRandomUniqElement,
  getRandomElement,
  getRandomArray
};
