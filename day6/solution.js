const fsPromises = require("fs").promises;
const path = require("path");

const parseInput = async () => {
  const input = await fsPromises.readFile(path.join(__dirname, "input.txt"), {
    encoding: "utf-8",
  });
  return input;
};

const startOfPacket = async () => {
  const input = await parseInput();
  //   const input = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";
  let packet = 0;
  let set = new Set();
  let i;
  for (i = 0; i < input.length; i++) {
    if (packet === 14) {
      break;
    }
    let current = input[i];
    if (set.has(current)) {
      set.clear();
      packet = 0;
      set.add(current);
      continue;
    }
    set.add(current);
    packet++;
  }
  console.log(i - 1);
  return i - 1;
};

const startOfMessage = async () => {
  const input = await parseInput();
  //   const input = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";
  let i;
  for (i = 0; i < input.length; i++) {
    let set = new Set();
    for (let j = i; j < input.length; j++) {
      if (set.size === 14) {
        console.log({ set, num: j });
        return i - 1;
      }
      if (set.has(input[j])) {
        break;
      }
      set.add(input[j]);
    }
  }
};

startOfMessage();
