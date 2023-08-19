//@ts-ignore
import { readFile } from "fs/promises";
//@ts-ignore
import { join } from "path";

const parseInput = async () => {
  //@ts-ignore
  const inputStr: string = await readFile(join(__dirname, "input.txt"), {
    encoding: "utf-8",
  });
  const format = inputStr
    .split("\n")
    .map((el) => el.split(":").map((v) => v.trim()));
  let numTest = /[0-9]/;
  const dict: Dict = {};
  format.forEach((el) => {
    let key = el[0];
    let val = el[1];
    if (numTest.test(val)) {
      dict[key] = parseInt(val);
    } else {
      dict[key] = val;
    }
  });
  const output = calculateRoot("root", dict);
  console.log(output);
};

type Dict = {
  [key: string]: string | number;
};

function calculateRoot(key: string, dict: Dict, memo: Dict = {}) {
  if (key === "humn") {
    return 3429411069028; // This is correct for part 2, but I found it using trial and error
  }
  let val = dict[key];
  if (typeof val === "number") {
    return val;
  }
  if (key === "root") {
    let values = val.split("+").map((el) => el.trim());
    let firsts = calculateRoot(values[0], dict);
    let second = calculateRoot(values[1], dict);
    return { firsts, second };
  }
  let add = /\+/,
    sub = /\-/,
    div = /\//,
    mult = /\*/;
  if (add.test(val)) {
    let [key1, key2] = val.split("+").map((el) => el.trim());
    memo[key] =
      calculateRoot(key1, dict, memo) + calculateRoot(key2, dict, memo);
    return memo[key];
  } else if (sub.test(val)) {
    let values = val.split("-").map((el) => el.trim());
    return calculateRoot(values[0], dict) - calculateRoot(values[1], dict);
  } else if (div.test(val)) {
    let values = val.split("/").map((el) => el.trim());
    return calculateRoot(values[0], dict) / calculateRoot(values[1], dict);
  } else if (mult.test(val)) {
    let values = val.split("*").map((el) => el.trim());
    return calculateRoot(values[0], dict) * calculateRoot(values[1], dict);
  }
}

parseInput();
