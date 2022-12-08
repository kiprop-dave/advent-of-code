const fsPromises = require("fs").promises;
const path = require("path");

const parseInput = async () => {
  const inputStr = await fsPromises.readFile(
    path.join(__dirname, "input.txt"),
    { encoding: "utf-8" },
  );
  const inputMatrix = inputStr
    .split("\n")
    .map((line) => line.split("").map((num) => parseInt(num)));
  return inputMatrix;
};

const countVisible = async () => {
  const inputMatrix = await parseInput();
  const columnLength = inputMatrix.length;
  const rowLength = inputMatrix[0].length;
  let visible = 0;
  let outer = (columnLength - 2) * 4 + 4;
  visible += outer;
  let scenic = 0;

  for (let i = 1; i < columnLength - 1; i++) {
    for (let j = 1; j < rowLength - 1; j++) {
      //   const seen = checkVisible(i, j, rowLength, columnLength, inputMatrix);
      //   console.log(seen);
      //   if (seen) {
      //     visible += 1;
      //   }
      const { up, down, left, right } = countScenic(
        i,
        j,
        rowLength,
        columnLength,
        inputMatrix,
      );
      const score = up * down * left * right;
      if (score > scenic) {
        scenic = score;
      }
    }
  }
  //   console.log(visible);
  console.log(scenic);
};

const checkVisible = (row, column, rLength, cLength, matrix) => {
  let current = matrix[row][column];
  for (let u = row - 1; u >= 0; u--) {
    let pointer = matrix[u][column];
    if (u === 0 && pointer < current) {
      return true;
    }
    if (pointer >= current) {
      break;
    }
  }
  for (let u = row + 1; u < cLength; u++) {
    let pointer = matrix[u][column];
    if (u === cLength - 1 && pointer < current) {
      return true;
    }
    if (pointer >= current) {
      break;
    }
  }
  for (let u = column - 1; u >= 0; u--) {
    let pointer = matrix[row][u];
    if (u === 0 && pointer < current) {
      return true;
    }
    if (pointer >= current) {
      break;
    }
  }
  for (let u = column + 1; u < rLength; u++) {
    let pointer = matrix[row][u];
    if (u === rLength - 1 && pointer < current) {
      return true;
    }
    if (pointer >= current) {
      break;
    }
  }
  return false;
};

const countScenic = (row, column, rLength, cLength, matrix) => {
  const score = { up: 0, down: 0, left: 0, right: 0 };
  let current = matrix[row][column];
  let up = 0,
    down = 0,
    left = 0,
    right = 0;

  for (let u = row - 1; u >= 0; u--) {
    up += 1;
    let pointer = matrix[u][column];
    if (pointer >= current || u === 0) {
      score.up = up;
      break;
    }
  }
  for (let u = row + 1; u < cLength; u++) {
    down += 1;
    let pointer = matrix[u][column];
    if (pointer >= current || u === cLength - 1) {
      score.down = down;
      break;
    }
  }
  for (let u = column - 1; u >= 0; u--) {
    left += 1;
    let pointer = matrix[row][u];
    if (pointer >= current || u === 0) {
      score.left = left;
      break;
    }
  }
  for (let u = column + 1; u < rLength; u++) {
    right += 1;
    let pointer = matrix[row][u];
    if (pointer >= current || u === rLength - 1) {
      score.right = right;
      break;
    }
  }
  return score;
};

countVisible();
