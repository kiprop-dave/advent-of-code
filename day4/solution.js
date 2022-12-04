const fsPromises = require("fs").promises;
const path = require("path");

// Parse the input string to an array
const parseInput = async () => {
  const inputStr = await fsPromises.readFile(
    path.join(__dirname, "input.txt"),
    { encoding: "utf-8" },
  );
  const inputData = inputStr.split("\n");
  const formated = inputData.map((el) =>
    el.split(",").map((range) => range.split("-").map((str) => parseInt(str))),
  );
  //   console.log(formated);
  return formated;
};

const outerLoop = async () => {
  const data = await parseInput();
  let sum = 0;
  data.forEach((el, i) => {
    // sum += overlapFully(el[0], el[1]); // first part
    sum += dontOverlap(el[0], el[1]); // second part
  });
  console.log(sum);
};

const overlapFully = (arr1, arr2) => {
  const overlap1 = arr1[0] <= arr2[0] && arr1[1] >= arr2[1];
  const overlap2 = arr1[0] >= arr2[0] && arr1[1] <= arr2[1];
  if (overlap1 || overlap2) {
    return 1;
  } else {
    return 0;
  }
};

const dontOverlap = (arr1, arr2) => {
  const noOverlap1 = arr1[0] < arr2[0] && arr2[0] > arr1[1];
  const noOverlap2 = arr2[0] < arr1[0] && arr1[0] > arr2[1];
  if (noOverlap1 || noOverlap2) {
    return 0;
  } else return 1;
};

outerLoop();
