// @ts-ignore
import { readFile } from "fs/promises";
// @ts-ignore
import { join } from "path";

const parseInput = async () => {
  // @ts-ignore
  const inputStr: string = await readFile(join(__dirname, "input.txt"), {
    encoding: "utf-8",
  });
  const format = inputStr.split("\n").map((line) => parseInt(line));
  return format.slice(0, -1);
};

const mixArray = async () => {
  const input = await parseInput();
  let _copy = [...input];
  const len = input.length;
  let p = 0;
  for (let i = 0; i < len; i++) {
    let pos = p + input[i];
    while (Math.abs(pos) > len - 1) {
      if (pos > 0) {
        pos = pos - len;
      } else {
        pos = pos + len;
      }
    }
    if (pos < 0) {
      pos = pos + len - 1;
    }
    if (input[i] && pos !== 0) {
      if (pos < p) {
        for (let j = p; j > pos + 1; j--) {
          _copy[j] = _copy[j - 1];
          _copy[j - 1] = input[i];
        }
      } else {
        for (let j = p + 1; j <= pos; j++) {
          _copy[j - 1] = _copy[j];
          _copy[j] = input[i];
        }
      }
    }
    if (pos === 0) {
      let num = _copy.splice(p, 1)[0];
      _copy.push(num);
    }
    if (i !== len - 1) {
      let el = _copy.findIndex((v) => v === input[i + 1]);
      if (el === -1) {
        throw new Error("Couldn't find number");
      } else {
        p = el;
      }
    }
    // console.log(i, _copy);
  }
  //   console.log(_copy);
  return _copy;
};

const findCoordinates = async () => {
  const arr = await mixArray();
  const ln = arr.length;
  const zero = arr.findIndex((v) => v === 0);
  const first = 1000 % ln,
    second = 2000 % ln,
    third = 3000 % ln;
  let i = zero + first,
    j = zero + second,
    k = zero + third;
  if (i > ln - 1) {
    i = i - ln;
  }
  if (j > ln - 1) {
    j = j - ln;
  }
  if (k > ln - 1) {
    k = k - ln;
  }
  console.log({ "1000": arr[i], "2000": arr[j], "3000": arr[k] });
  let output = arr[i] + arr[j] + arr[k];
  console.log(output);
  return output;
};

findCoordinates();
// const checkDuplicates = async () => {
//   const input = await parseInput();
//   let set = new Set<number>();
//   input.forEach((el) => {
//     if (set.has(el)) {
//       return "duplicate found";
//     } else {
//       set.add(el);
//     }
//   });
//   console.log("no duplicate");
// };

// checkDuplicates();
