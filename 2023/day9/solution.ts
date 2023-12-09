//@ts-ignore
const fs = require('fs');

function findPattern(line: number[]): number[][] {
  const pattern: number[][] = [line];
  let currentLevel = 0;
  const allSame = () => pattern[currentLevel].every(x => x === pattern[currentLevel][0]);
  while (!allSame()) {
    const nextLevel: number[] = [];
    for (let i = 0; i < pattern[currentLevel].length - 1; i++) {
      nextLevel.push(pattern[currentLevel][i + 1] - pattern[currentLevel][i]);
    }
    pattern.push(nextLevel);
    currentLevel++;
  }

  return pattern;
}

function exptrapolateForward(pattern: number[][], next: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < next; i++) {
    let nextDiff = 0;
    for (let j = pattern.length - 1; j >= 0; j--) {
      nextDiff += pattern[j][pattern[j].length - 1];
      pattern[j].push(nextDiff);
    }
    result.push(nextDiff);
  }
  return result;
}

function exptrapolateBackward(pattern: number[][], next: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < next; i++) {
    let nextDiff = 0;
    for (let j = pattern.length - 1; j >= 0; j--) {
      nextDiff = pattern[j][0] - nextDiff;
      pattern[j].unshift(nextDiff);
    }
    result.unshift(nextDiff);
  }
  return result;
}

function parseInput(): number[][] {
  const input: string = fs.readFileSync("input.txt", { encoding: 'utf-8' }).trim();
  return input.split('\n').map(x => x.split(' ').map(y => parseInt(y)));
}

const partOne = (patterns: number[][][]): number => {
  const nextValues = patterns.map(x => exptrapolateForward(x, 1)[0]);
  return nextValues.reduce((a, b) => a + b, 0);
}

const partTwo = (patterns: number[][][]): number => {
  const nextValues = patterns.map(x => exptrapolateBackward(x, 1)[0]);
  return nextValues.reduce((a, b) => a + b, 0);
}

function main() {
  const input = parseInput();
  const patterns = input.map(x => findPattern(x));
  const resultOne = partOne(patterns);
  const resultTwo = partTwo(patterns);
  console.log(`Part 1: ${resultOne}\nPart 2: ${resultTwo}`);
}

main();
