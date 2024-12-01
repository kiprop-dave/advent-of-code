//@ts-expect-error
const fs = require('fs');

const partA = (left: number[], right: number[]): number => {
  if (left.length !== right.length) throw new Error('Not same length');
  right.sort((a, b) => a - b);
  return left.sort((a, b) => a - b).reduce((acc, curr, i) => {
    return acc + Math.abs(curr - right[i]);
  }, 0)
}

const partB = (left: number[], right: number[]): number => {
  const occurrences = right.reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr] += 1;
    } else {
      acc[curr] = 1;
    }
    return acc;
  }, {});

  return left.reduce((acc, curr) => {
    if (curr in occurrences) {
      acc += curr * occurrences[curr];
    }
    return acc
  }, 0)
}

const main = async () => {
  //@ts-ignore
  const cookie = process.argv[2]
  const input = (async (): Promise<string> => {
    if (cookie) {
      const input = await fetch("https://adventofcode.com/2024/day/1/input", {
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
  const left: number[] = [];
  const right: number[] = [];
  const lines = res.trim().split('\n');
  for (const line of lines) {
    const [l, r] = line.split('   ').map(Number);
    left.push(l);
    right.push(r);
  }
  console.log({ partA: partA(left, right), partB: partB(left, right) });
}

main()
