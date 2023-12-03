//@ts-ignore
const fs = require('fs')

const parseFileInput = (): string[][] => {
  const input: string = fs.readFileSync('input.txt', 'utf8').trim()
  const lines = input.split('\n')
  return lines.map((line) => {
    return line.split('')
  })
}

const isNeighbourSymbol = (matrix: string[][], i: number, j: number): { symbol: string, isPossiblePart: boolean, coordinates: string } => {
  const symbolRgx = /[^\w\s.]/;

  const numRows = matrix.length
  const numCols = matrix[0]?.length || 0
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];
  let ret = { symbol: '', isPossiblePart: false, coordinates: "" };
  for (const [dx, dy] of directions) {
    const px = i + dx;
    const py = j + dy;
    if (px >= 0 && px < numRows && py >= 0 && py < numCols) {
      if (symbolRgx.test(matrix[px][py])) {
        ret.symbol = matrix[px][py];
        ret.isPossiblePart = true;
        ret.coordinates = `${px}:${py}`;
        break
      }
    }
  }
  return ret;
}

const aSolution = () => {
  const matrix = parseFileInput();
  const engineNumbers: number[] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].charCodeAt(0) >= 48 && matrix[i][j].charCodeAt(0) <= 57) {
        let num = '';
        let isPossiblePart = false;
        while ((j < matrix[i].length) && matrix[i][j].charCodeAt(0) >= 48 && matrix[i][j].charCodeAt(0) <= 57) {
          num += matrix[i][j];
          if (!isPossiblePart) {
            const checkNeighbour = isNeighbourSymbol(matrix, i, j);
            isPossiblePart = checkNeighbour.isPossiblePart;
          }
          j++;
        }
        if (isPossiblePart) {
          engineNumbers.push(parseInt(num));
        }
      }
    }
  }
  const ans = engineNumbers.reduce((a, b) => a + b);
  console.log(ans);
}

const bSolution = () => {
  const matrix = parseFileInput();
  const engineGears: Record<string, number[]> = {};
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].charCodeAt(0) >= 48 && matrix[i][j].charCodeAt(0) <= 57) {
        let num = '';
        let isPossibleGear = false;
        let coordinates = '';
        while ((j < matrix[i].length) && matrix[i][j].charCodeAt(0) >= 48 && matrix[i][j].charCodeAt(0) <= 57) {
          num += matrix[i][j];
          if (!isPossibleGear) {
            const checkNeighbour = isNeighbourSymbol(matrix, i, j);
            if (checkNeighbour.symbol === '*') {
              isPossibleGear = true;
              coordinates = checkNeighbour.coordinates;
            }
          }
          j++;
        }
        if (isPossibleGear) {
          (engineGears[coordinates] || (engineGears[coordinates] = [])).push(parseInt(num));
        }
      }
    }
  }
  const ans = Object.keys(engineGears).reduce((acc, curr) => {
    if (engineGears[curr].length === 2) {
      return acc + engineGears[curr][0] * engineGears[curr][1];
    }
    return acc
  }, 0)
  console.log(ans);
}

//aSolution()
bSolution()
