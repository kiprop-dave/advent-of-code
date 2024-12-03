// @ts-expect-error
const fs = require("fs");

const partA = (input: string): number => {
  const rgx = /mul\((\d+),(\d+)\)/g;
  let sum = 0;
  while (true) {
    const match = rgx.exec(input);
    if (!match)
      break;
    sum += parseInt(match[1]) * parseInt(match[2]);
  }
  return sum;
};

const findMatches = (
  input: string,
  rgx: RegExp,
): { match: string; pos: number; }[] => {
  const matches: { match: string; pos: number; }[] = [];
  while (true) {
    const match = rgx.exec(input);
    if (!match)
      break;
    matches.push({ match: match[0], pos: match.index });
  }
  return matches;
};

const partB = (input: string): number => {
  const rgx = /mul\((\d+),(\d+)\)|don't|do()/g;
  const tokens = findMatches(input, rgx).sort((a, b) => a.pos - b.pos);
  const mulExpressions: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    let cannotDo = tokens[i].match === "don't";
    while (cannotDo && i < tokens.length) {
      if (tokens[i].match === "do")
        cannotDo = false;
      i++;
    }
    if (i >= tokens.length)
      break;
    if (tokens[i].match === "do")
      i++;
    else {
      mulExpressions.push(tokens[i].match);
      i++;
    }
  }

  return partA(mulExpressions.join(""));
};

const main = async () => {
  // @ts-ignore
  const cookie = process.argv[2];
  const input = (async (): Promise<string> => {
    if (cookie) {
      const input = await fetch("https://adventofcode.com/2024/day/3/input", {
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
  console.log({ partA: partA(res), partB: partB(res) });
};

main();
