const fsPromises = require("fs").promises;
const path = require("path");

// Parse the input string to an array
const parseInput = async () => {
  const inputStr = await fsPromises.readFile(
    path.join(__dirname, "input.txt"),
    { encoding: "utf-8" },
  );
  const inputData = inputStr.split("\n");
  return inputData;
};

// find all repeating characters in each string
const allRepeats = async () => {
  const input = await parseInput();
  const grouped = groupThree(input);
  const repeatedChars = [];
  let i = 0;
  //   for (i = 0; i < input.length; i++) { // for the first part
  //     const duplicate = repeatingChar(input[i]);
  //     repeatedChars.push(duplicate);
  //   }
  for (i = 0; i < grouped.length; i++) {
    const duplicate = repeatingCharGroup(grouped[i]);
    repeatedChars.push(duplicate);
  }
  //   console.log(repeatedChars);
  const dict = {};
  let sum = 0;
  repeatedChars.forEach((el) => {
    if (el in dict) {
      sum += dict[el];
      return;
    }
    const index = hashMap(el);
    sum += index;
    dict[el] = index;
  });
  console.log(sum);
  console.log(dict);
  return repeatedChars;
};

// find repeating character in string
const repeatingChar = (str) => {
  const length = str.length;
  let firstHalf = new Set();
  let secondHalf = new Set();
  let i = 0,
    j = length / 2;
  while (i < length / 2 && j < str.length) {
    firstHalf.add(str[i]);
    secondHalf.add(str[j]);
    if (firstHalf.has(str[j])) {
      return str[j];
    }
    if (secondHalf.has(str[i])) {
      return str[i];
    }
    i++;
    j++;
  }
};

// find repeating character in group of three
const repeatingCharGroup = (group) => {
  let first = new Set();
  let second = new Set();
  let third = new Set();

  let l1 = group[0].length;
  let l2 = group[1].length;
  let l3 = group[2].length;
  let i = 0,
    j = 0,
    k = 0;
  while (i < l1 && j < l2 && k < l3) {
    const p1 = group[0][i],
      p2 = group[1][j],
      p3 = group[2][k];
    first.add(p1);
    second.add(p2);
    third.add(p3);
    const condition1 = first.has(p1) && second.has(p1) && third.has(p1);
    const condition2 = first.has(p2) && second.has(p2) && third.has(p2);
    const condition3 = first.has(p3) && second.has(p3) && third.has(p3);
    if (condition1) {
      return p1;
    }
    if (condition2) return p2;
    if (condition3) return p3;
    i++;
    j++;
    k++;
  }
  while (i < l1) {
    const p1 = group[0][i];
    first.add(p1);
    const condition1 = first.has(p1) && second.has(p1) && third.has(p1);
    if (condition1) {
      return p1;
    }
    i++;
  }
  while (j < l2) {
    const p2 = group[1][j];
    second.add(p2);
    const condition2 = first.has(p2) && second.has(p2) && third.has(p2);
    if (condition2) return p2;
    j++;
  }
  while (k < l3) {
    const p3 = group[2][k];
    third.add(p3);
    const condition3 = first.has(p3) && second.has(p3) && third.has(p3);
    if (condition3) return p3;
    k++;
  }
};

// Character value hashmap
const hashMap = (letter) => {
  const allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const index = allChars.indexOf(letter);
  return index + 1;
};

// group strings in sets of three
const groupThree = (input) => {
  let groups = [];
  let group = [];
  let first = true;
  for (let i = 0; i <= input.length; i++) {
    if (first) {
      group.push(input[i]);
      first = false;
      continue;
    }
    let three = i % 3;
    if (three === 0) {
      groups.push(group);
      group = [];
      if (i !== input.length) {
        group.push(input[i]);
      }
      continue;
    }
    group.push(input[i]);
    // tracker++;
  }
  //   console.log(groups);
  return groups;
};

allRepeats();
