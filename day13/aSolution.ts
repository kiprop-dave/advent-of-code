//@ts-ignore
import { readFile } from "fs/promises";
//@ts-ignore
import { join } from "path";

const parseInput = async () => {
  //@ts-ignore
  const inputStr: string = await readFile(join(__dirname, "input.txt"), {
    encoding: "utf-8",
  });
  const inputPairs = inputStr.split("\n\n").map((pair) => {
    let objectPair: pair = {};
    let prop = "left";
    let str = "";
    for (let i = 0; i < pair.length; i++) {
      const el = pair[i];
      if (el === "\n") {
        objectPair[prop] = str;
        prop = "right";
        str = "";
        continue;
      }
      str += el;
    }
    objectPair[prop] = str;
    return objectPair;
  });
  console.log(inputPairs);
  return inputPairs;
};

type pair = {
  [key: string]: string;
};

parseInput();
