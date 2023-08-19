const fsPromises = require("fs").promises;
const path = require("path");

let stacks = {
  1: ["G", "F", "V", "H", "P", "S"],
  2: ["G", "J", "F", "B", "V", "D", "Z", "M"],
  3: ["G", "M", "L", "J", "N"],
  4: ["N", "G", "Z", "V", "D", "W", "P"],
  5: ["V", "R", "C", "B"],
  6: ["V", "R", "S", "M", "P", "W", "L", "Z"],
  7: ["T", "H", "P"],
  8: ["Q", "R", "S", "N", "C", "H", "Z", "V"],
  9: ["F", "L", "G", "P", "V", "Q", "J"],
};

const parseInstructions = async () => {
  const instructions = (
    await fsPromises.readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    })
  ).split("\n");
  const format = instructions.map((el) => {
    let strArr = el.split(" ");
    return strArr
      .filter((el) => {
        if (el === "move" || el === "from" || el === "to") {
          return false;
        }
        return true;
      })
      .map((item) => parseInt(item));
  });
  //   console.log(format);
  return format;
};

const rearrangeStacks = async () => {
  const instructions = await parseInstructions();
  instructions.forEach((inst, i) => {
    if (i === 0 || i === 1) {
      console.log(stacks);
    }
    moveCrates(inst);
  });
  //   console.log(stacks);
  let topCrates = "";
  for (const stack in stacks) {
    const st = stacks[stack];
    topCrates += st[st.length - 1];
  }
  console.log(topCrates);
};

// const moveCrates = (array) => {
//   let numToRemove = array[0];
//   let from = array[1];
//   let to = array[2];
//   while (numToRemove > 0) {
//     let removed = stacks[from].pop();
//     stacks[to].push(removed);
//     numToRemove--;
//   }
// };
const moveCrates = (array) => {
  let numToRemove = array[0];
  let from = array[1];
  let to = array[2];
  let start = stacks[from].length - numToRemove;
  let removed = stacks[from].splice(start);
  let replacement = [...stacks[to], ...removed];
  stacks[to] = replacement;
};

rearrangeStacks();
