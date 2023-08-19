const fsPromises = require("fs").promises;
const path = require("path");

const readInput = async () => {
  const inputData = await fsPromises.readFile(
    path.join(__dirname, "input.txt"),
    { encoding: "utf-8" },
  );
  let arrayData = inputData.split("\n\n");
  const removeNewLine = arrayData.map((el) => el.split("\n"));
  return removeNewLine;
};

const addGroup = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += parseInt(arr[i]);
  }
  return sum;
};

const add = (bigArr) => {
  let largest = 0;
  const allSums = [];
  for (let i = 0; i < bigArr.length; i++) {
    const current = addGroup(bigArr[i]);
    allSums.push(current);
    if (current > largest) {
      largest = current;
    }
  }
  console.log(largest);
  allSums.sort((a, b) => a - b);
  let sumOfTopThree = 0;
  const topThree = [];
  for (let i = allSums.length - 1; i > allSums.length - 4; i--) {
    sumOfTopThree += allSums[i];
    topThree.push(allSums[i]);
  }
  console.log(topThree);
  console.log(sumOfTopThree);
  return largest;
};

const solution = async () => {
  try {
    const input = await readInput();
    add(input);
  } catch (error) {
    console.log(error);
  }
};

solution();
