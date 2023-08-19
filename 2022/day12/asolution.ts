// @ts-ignore
import { readFile } from "fs/promises";
// @ts-ignore
import { join } from "path";

const parseInput = async () => {
  // @ts-ignore
  const input: string = await readFile(join(__dirname, "input.txt"), {
    encoding: "utf-8",
  });
  const format = input.split("\n").map((line) => line.split(""));
  return format;
};

interface Imap {
  [key: string]: number;
}
function createMap() {
  let letters = "abcdefghijklmnopqrstuvwxyz";
  const map: Imap = {};
  for (let i = 0; i < letters.length; i++) {
    let key = letters[i];
    map[key] = i;
  }
  console.log(map);
  return map;
}

createMap();
