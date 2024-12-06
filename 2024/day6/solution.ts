// @ts-expect-error
const fs = require("fs");

type Direction = {
  change: [number, number];
  dir: string;
  next: () => Direction;
};

const RIGHT: Direction = {
  change: [1, 0],
  dir: "R",
  next: () => DOWN,
};

const DOWN: Direction = {
  change: [0, 1],
  dir: "D",
  next: () => LEFT,
};

const UP: Direction = {
  change: [0, -1],
  dir: "U",
  next: () => RIGHT,
};

const LEFT: Direction = {
  change: [-1, 0],
  dir: "L",
  next: () => UP,
};

type Input = {
  map: string[][];
  start: [number, number];
};

const parseInput = (input: string): Input => {
  const map: string[][] = [];
  let start: [number, number] = [0, 0];
  const lines = input.split("\n");
  for (let y = 0; y < lines.length; y++) {
    const line: string[] = [];
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === "^") {
        start = [x, y];
        line.push(".");
      } else {
        line.push(lines[y][x]);
      }
    }
    map.push(line);
  }
  return {
    map,
    start,
  };
};

const checkLoop = (input: Input): { size: number; loop: boolean; } => {
  let [x, y] = input.start;
  let direction: Direction = UP;
  const { map } = input;
  const visited = new Set<string>();

  while (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {
    const key = `${x},${y},${direction.dir}`;
    if (visited.has(key)) {
      return {
        size: visited.size,
        loop: true,
      };
    }
    visited.add(key);
    const nextX = x + direction.change[0];
    const nextY = y + direction.change[1];
    if (nextX < 0 || nextX >= map[0].length || nextY < 0 || nextY >= map.length)
      break;
    if (map[nextY][nextX] === ".") {
      x = nextX;
      y = nextY;
    } else {
      direction = direction.next();
    }
  }

  return {
    size: visited.size,
    loop: false,
  };
};

const partOne = (input: Input) => {
  let [x, y] = input.start;
  let direction: Direction = UP;
  const { map } = input;
  const visited = new Set<string>();

  while (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {
    visited.add(`${x},${y}`);
    const nextX = x + direction.change[0];
    const nextY = y + direction.change[1];
    if (nextX < 0 || nextX >= map[0].length || nextY < 0 || nextY >= map.length)
      break;
    if (map[nextY][nextX] === ".") {
      x = nextX;
      y = nextY;
    } else {
      direction = direction.next();
    }
  }

  return visited.size;
};

const partTwo = (input: Input) => {
  let combinations = 0;
  let x = 0;
  while (x >= 0 && x < input.map[0].length) {
    let y = 0;
    while (y >= 0 && y < input.map.length) {
      input.map[y][x] = "#";
      if (x < 2 && y < 2) {
        console.log({ x, y });
        input.map.forEach(line => console.log(line));
      }
      const { loop } = checkLoop(input);
      if (loop)
        combinations++;
      input.map[y][x] = ".";
      y++;
    }
    x++;
  }

  return combinations;
};

const main = async () => {
  // @ts-ignore
  const cookie = process.argv[2];
  const input = (async (): Promise<string> => {
    if (cookie) {
      const input = await fetch("https://adventofcode.com/2024/day/6/input", {
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
  const data = parseInput(res.trim());
  console.log({ partTwo: partTwo(data) });
};

main();
