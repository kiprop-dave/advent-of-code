//@ts-ignore
import { readFile } from "fs/promises";
//@ts-ignore
import { join } from "path";

class CathodeTube {
  registerValue: number;
  cycles: number;
  sum: number[];
  constructor() {
    this.registerValue = 1;
    this.cycles = 0;
    this.sum = [];
  }

  noop() {
    this.cycles++;
    this.snapsot();
  }

  add(value: number) {
    this.cycles += 1;
    this.snapsot();
    this.cycles += 1;
    this.snapsot();
    this.registerValue += value;
  }

  snapsot() {
    let cycle = this.cycles;
    let x = this.registerValue;
    let mult = this.cycles * this.registerValue;
    const needed =
      cycle === 20 ||
      cycle === 60 ||
      cycle === 100 ||
      cycle === 140 ||
      cycle === 180 ||
      //   cycle === 219 ||
      cycle === 220;
    //   cycle === 221;
    if (needed) {
      this.sum.push(mult);
      console.log({ cycle, x, mult });
    }
  }
}

const parseInput = async () => {
  const inputStr = await readFile(join(import.meta.dir, "input.txt"), {
    encoding: "utf-8",
  });
  const formated = inputStr.split("\n");
  return formated.slice(0, -1);
};

const solution = async () => {
  const input = await parseInput() as string[];
  console.log(input.length);
  const crt = new CathodeTube();
  input.forEach((el, i) => {
    if (el === "noop") {
      crt.noop();
    } else {
      let command = el.split(" ").map((el, i) => (i === 1 ? parseInt(el) : el));
      if (typeof command[1] !== "number") {
        console.log(command, i);
        throw new Error(" exception ");
      } else {
        crt.add(command[1]);
      }
    }
  });
  const initial = 0;
  const sumValues = crt.sum.reduce((prev, curr) => prev + curr, initial);
  console.log(sumValues);
};

solution();
