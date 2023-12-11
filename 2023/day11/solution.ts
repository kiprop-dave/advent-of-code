//@ts-ignore
const fs = require("fs");

function parseInputFile(): { image: string[][], galaxies: Record<number, [number, number]> } {
  const file: string[] = fs.readFileSync("input.txt", "utf8").trim().split("\n");
  const lines = file.map((line) => line.split(""));
  for (let i = 0; i < lines.length; i++) {
    const allDots = lines[i].every((char) => char === ".");
    if (allDots) {
      const newLine = Array<string>(lines[i].length).fill(".");
      lines.splice(i, 0, newLine);
      i += 2;
    }
  }
  const emptyCols: number[] = [];
  for (let j = 0; j < lines[0].length; j++) {
    let allDots = true;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i][j] !== ".") {
        allDots = false;
        break;
      }
    }
    if (allDots) {
      emptyCols.push(j);
      j++;
    }
  }
  //  console.log(emptyCols);
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < emptyCols.length; j++) {
      const index = emptyCols[j] + j;
      lines[i].splice(index, 0, ".");
    }
  }
  const galaxies: Record<number, [number, number]> = {};
  let num = 1;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "#") {
        galaxies[num] = [i, j];
        num++;
      }
    }
  }
  return {
    image: lines,
    galaxies
  };
}

const part1 = (galaxies: Record<number, [number, number]>): number => {
  let distanceSum = 0;
  const accounted: Record<string, boolean> = {};
  for (const key in galaxies) {
    for (const key2 in galaxies) {
      if (key === key2 || accounted[`${key}-${key2}`] || accounted[`${key2}-${key}`]) {
        continue;
      }
      const [x1, y1] = galaxies[key];
      const [x2, y2] = galaxies[key2];
      const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      //      console.log(key, "->", key2, distance);
      distanceSum += distance;
      accounted[`${key}-${key2}`] = true;
    }
  }
  return distanceSum;
}

function main() {
  const lines = parseInputFile();
  console.log(part1(lines.galaxies));
}
main();
