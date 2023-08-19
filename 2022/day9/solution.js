const fsPromises = require("fs").promises;
const path = require("path");

class Matrix {
  constructor(matrix) {
    this.matrix = matrix;
    this.head = {
      row: matrix.length - 1,
      col: 0,
    };
    this.tail = {
      row: matrix.length - 1,
      col: 0,
    };
  }

  setStart() {
    this.matrix[this.matrix.length - 1][0] = 1;
  }

  moveHead(dir, num) {
    // let { row: hRow, col: hCol } = this.head;
    // let { row: tRow, col: tCol } = this.tail;
    // if (dir === "R") {
    //   this.head.col += num;
    // } else if (dir === "L") {
    //   this.head.col -= num;
    // } else if (dir === "U") {
    //   this.head.row -= num;
    // } else {
    //   this.head.row += num;
    // }
    let count = 0;

    let isClose = false;
    let dif = num - count;
    while (!isClose && dif !== 0) {
      if (dir === "R") {
        this.head.col += 1;
        count++;
        dif = num - count;
      } else if (dir === "L") {
        this.head.col -= 1;
        count++;
        dif = num - count;
      } else if (dir === "U") {
        this.head.row -= 1;
        count++;
        dif = num - count;
      } else {
        this.head.row += 1;
        count++;
        dif = num - count;
      }
      const { close, colDiff, rowDif } = this.areClose();
      if (close && dif !== 0) {
        // isClose = true;
        continue;
      }
      if (close && dif === 0) {
        break;
      }
      if (dir === "R") {
        if (colDiff > 1 && rowDif === 1) {
          this.tail.col += 1;
          this.tail.row += 1;
        } else if (colDiff > 1 && rowDif === -1) {
          this.tail.col += 1;
          this.tail.row -= 1;
        } else {
          this.tail.col += 1;
        }
      } else if (dir === "L") {
        if (colDiff < -1 && rowDif === 1) {
          this.tail.col -= 1;
          this.tail.row += 1;
        } else if (colDiff < -1 && rowDif === -1) {
          this.tail.col -= 1;
          this.tail.row -= 1;
        } else {
          this.tail.col -= 1;
        }
      } else if (dir === "U") {
        if (rowDif < -1 && colDiff === 1) {
          this.tail.col += 1;
          this.tail.row -= 1;
        } else if (rowDif < -1 && colDiff === -1) {
          this.tail.col -= 1;
          this.tail.row -= 1;
        } else {
          this.tail.row -= 1;
        }
      } else if (dir === "D") {
        if (rowDif < 1 && colDiff === 1) {
          this.tail.col += 1;
          this.tail.row += 1;
        } else if (rowDif < 1 && colDiff === -1) {
          this.tail.col -= 1;
          this.tail.row += 1;
        } else {
          this.tail.row += 1;
        }
      }
      //   console.log(this.tail.row);
      // this.matrix[this.tail.row][this.tail.col] = 1;
    }
    // console.log(this.matrix);
    return true;
  }

  areClose() {
    let { row: hRow, col: hCol } = this.head;
    let { row: tRow, col: tCol } = this.tail;
    const colDiff = hCol - tCol;
    const rowDif = hRow - tRow;
    let close1 = colDiff <= 1 && colDiff >= -1;
    let close2 = rowDif <= 1 && rowDif >= -1;
    if (close1 && close2) {
      return { close: true, colDiff, rowDif };
    } else {
      return { close: false, colDiff, rowDif };
    }
  }
}

const parseInstructions = async () => {
  const inputStr = await fsPromises.readFile(
    path.join(__dirname, "input.txt"),
    { encoding: "utf-8" },
  );

  const formated = inputStr
    .split("\n")
    .map((line) => line.split(" ").map((v, i) => (i === 1 ? parseInt(v) : v)));
  //   console.log(formated);
  return formated;
};

const traverseMatrix = async () => {
  const input = await parseInstructions();
  let largestR = 0;
  let largestC = 0;
  let rLength = 0;
  let cLength = 0;
  const testMatrix = [];

  input.forEach((row) => {
    const dir = row[0];
    const num = row[1];
    if (dir === "R") {
      if (num > largestR) {
        largestR = num;
      }
      rLength += num;
      return;
    } else if (dir === "L") {
      rLength -= num;
      return;
    } else if (dir === "U") {
      if (num > largestC) {
        largestC = num;
      }
      cLength += num;
      return;
    } else {
      cLength -= num;
      return;
    }
  });

  if (rLength > 0) {
    rLength = rLength + largestR;
  } else {
    rLength = largestR - rLength;
  }
  if (cLength > 0) {
    cLength = cLength + largestC;
  } else {
    cLength = largestC - cLength;
  }
  for (let i = 0; i < cLength; i++) {
    testMatrix.push([]);
    for (let j = 0; j < rLength; j++) {
      testMatrix[i].push(0);
    }
  }
  console.log(testMatrix);

  const matrix = new Matrix(testMatrix);
  matrix.setStart();
  input.forEach((move) => {
    let dir = move[0];
    let num = move[1];
    matrix.moveHead(dir, num);
    // console.log(matrix.matrix);
  });
};

traverseMatrix();
