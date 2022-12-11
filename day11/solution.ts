// @ts-ignore
import { readFile } from "fs/promises";
// @ts-ignore
import { join } from "path";

const parseInput = async () => {
  // @ts-ignore
  const inputStr: string = await readFile(join(__dirname, "input.txt"), {
    encoding: "utf-8",
  });
  const format = inputStr
    .split("\n\n")
    .map((line) => line.split("\n").map((el) => el.trim()));
  //   console.log(format);
  return format;
};

type monkeyObj = {
  items: number[];
  operation: string;
  test: number;
  ifTrue: string;
  ifFalse: string;
};

interface Game {
  [key: string]: monkeyObj;
}

const createGameObject = async () => {
  const input = await parseInput();
  let gameObj: Game = {};

  input.forEach((mon, i) => {
    let prop = `monkey ${i}`;
    let monkey = createProp(mon);
    gameObj[prop] = monkey;
  });
  return gameObj;
};

const createProp = (monkey: string[]) => {
  let items = monkey[1]
    .split(":")
    .filter((el) => !el.startsWith("Start"))
    .map((el) => el.split(",").map((num) => parseInt(num.trim())))
    .flat();
  let operation = monkey[2]
    .split(":")
    .filter((el) => !el.startsWith("Oper"))
    .map((el) =>
      el
        .split("=")
        .filter((el) => !el.startsWith(" new"))
        .map((el) => el.trim()),
    )
    .flat()
    .join("");
  let test = monkey[3]
    .split(":")
    .filter((el) => !el.startsWith("Test"))
    .join("")
    .split("by")
    .filter((el) => !el.startsWith(" div"))
    .map((num) => parseInt(num.trim()))
    .join();
  let ifTrue = monkey[4]
    .split(":")
    .filter((el) => !el.startsWith("If"))
    .map((el) => el.split("to").filter((str) => !str.startsWith(" throw")))
    .flat()
    .map((tr) => tr.trim())
    .join("");
  let ifFalse = monkey[5]
    .split(":")
    .filter((el) => !el.startsWith("If"))
    .map((el) => el.split("to").filter((str) => !str.startsWith(" throw")))
    .flat()
    .map((tr) => tr.trim())
    .join("");
  return {
    items,
    operation,
    test: parseInt(test),
    ifTrue,
    ifFalse,
  };
};
type results = {
  [key: string]: number;
};

const solution = async () => {
  const gameObj = await createGameObject();
  //   console.log(gameObj);
  let multiply = /old \* [1-9]/;
  let add = /old \+ [1-9]/;
  let square = /old \* old/;
  let rounds = 0;
  let results: results = {};
  while (rounds < 10000) {
    for (const key in gameObj) {
      if (!results.hasOwnProperty(key)) {
        results[key] = 0;
      }
      gameObj[key].items.forEach((item, i) => {
        results[key] += 1;
        let operation = gameObj[key].operation;
        let testNum = gameObj[key].test;
        let isTrue = gameObj[key].ifTrue;
        let isFalse = gameObj[key].ifFalse;
        if (multiply.test(operation)) {
          let num = formatString(operation, "*");
          let res = Math.floor(item * num);
          let divisible = testDivisible(res, testNum);
          if (divisible) {
            gameObj[isTrue].items.push(res);
          } else {
            gameObj[isFalse].items.push(res);
          }
        } else if (add.test(operation)) {
          let num = formatString(operation, "+");
          let res = Math.floor(item + num);
          let divisible = testDivisible(res, testNum);
          if (divisible) {
            gameObj[isTrue].items.push(res);
          } else {
            gameObj[isFalse].items.push(res);
          }
        } else if (square.test(operation)) {
          let res = Math.floor(item * item);
          let divisible = testDivisible(res, testNum);
          if (divisible) {
            gameObj[isTrue].items.push(res);
          } else {
            gameObj[isFalse].items.push(res);
          }
        }
        let current = [...gameObj[key].items];
        current.shift();
        gameObj[key].items = current;
      });
    }
    rounds++;
  }
  //   console.log(gameObj);
  console.log(results);
  let outputArr: number[] = [];
  for (const key in results) {
    outputArr.push(results[key]);
  }
  outputArr.sort((a, b) => b - a);
  let sol = outputArr[0] * outputArr[1];
  console.log(sol);
};

const formatString = (name: string, char: string) => {
  let numStr = name
    .split(char)
    .filter((el) => !el.startsWith("old"))
    .map((el) => parseInt(el.trim()))
    .join("");
  return parseInt(numStr);
};

const testDivisible = (num: number, div: number) => {
  let res = num % div === 0;
  if (res) {
    return true;
  } else {
    return false;
  }
};

solution();
