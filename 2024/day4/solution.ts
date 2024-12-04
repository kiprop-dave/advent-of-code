// @ts-expect-error
const fs = require("fs");

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

const DIAGONALS = [[[1, -1], [0, 0], [-1, 1]], [[-1, -1], [0, 0], [1, 1]]];

const findXmas = (
  matrix: string[][],
  point: { x: number; y: number; },
): number => {
  let xmasCount = 0;

  for (const [dx, dy] of DIRECTIONS) {
    let x = point.x;
    let y = point.y;
    let word = "";
    while (
      x >= 0 && x < matrix.length && y >= 0 && y < matrix[0]
        .length && word
          .length < 4
    ) {
      const char = matrix[x][y];
      word += char;
      x += dx;
      y += dy;
    }

    if (word === "XMAS")
      xmasCount++;
  }

  return xmasCount;
};

const isXmas = (
  matrix: string[][],
  point: { x: number; y: number; },
): boolean => {
  const diags = {
    0: "",
    1: "",
  };

  let d = 0;

  const checkMas = (s: string) => {
    return s === "MAS" || s === "SAM";
  };

  for (const diagonal of DIAGONALS) {
    let c = "";
    let i = 0;

    while (i < diagonal.length) {
      const [dx, dy] = diagonal[i];
      const x = point.x + dx;
      const y = point.y + dy;
      if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length)
        break;
      c += matrix[x][y];
      i++;
    }

    diags[d] = c;

    d++;
  }

  return checkMas(diags[0]) && checkMas(diags[1]);
};

const partA = (matrix: string[][]): number => {
  return matrix.reduce(
    (acc, row, y) =>
      acc + row.reduce((acc, _, x) => acc + findXmas(matrix, { x, y }), 0),
    0,
  );
};

const partB = (matrix: string[][]): number => {
  return matrix.reduce((acc, row, y) => {
    return acc + row.reduce((acc, _, x) => {
      if (matrix[x][y] === "A" && isXmas(matrix, { x, y }))
        return acc + 1;
      return acc;
    }, 0);
  }, 0);
};

const main = async () => {
  // @ts-ignore
  const cookie = process.argv[2];
  const input = (async (): Promise<string> => {
    if (cookie) {
      const input = await fetch("https://adventofcode.com/2024/day/4/input", {
        headers: {
          cookie: `session=${cookie}`,
        },
      });
      return await input.text();
    } else {
      return fs.readFileSync("./example.txt", { encoding: "utf-8" });
    }
  })();
  const res = await input;
  const matrix = res.trim().split("\n").map(line => line.split(""));
  console.log({ partA: partA(matrix), partB: partB(matrix) });
};

main();
