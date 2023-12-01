//@ts-ignore
const fs = require("fs");

const parseInput = (): string[] => {
  const input: string = fs.readFileSync("./input.txt", { encoding: "utf8", flag: "r" }).slice(0, -1);
  return input.split("\n");
}

const aSolution = () => {
  const input = parseInput();
  const data = input.map((line) => {
    const numbers = line.split("").filter((char) => {
      return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57
    })
    return numbers.reduce((acc, curr) => {
      return acc.concat(curr)
    }, "")
  }).map((line) => {
    if (line.length === 1) {
      return Number(line.concat(line))
    }
    return Number(line.charAt(0).concat(line.charAt(line.length - 1)))
  })
  const ans = data.reduce((acc, curr) => {
    return acc + curr
  }, 0);
  console.log(ans)
}

function extractNumbersFromString(inputString: string): Record<number, string> {
  const wordToNumberMap: { [key: string]: string } = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9'
  };

  const indexNumber: Record<number, string> = {}

  Object.keys(wordToNumberMap).forEach(word => {
    const regex = new RegExp(word, 'g');
    let match: RegExpExecArray | null = null;
    while (match = regex.exec(inputString)) {
      const index = match.index;
      indexNumber[index] = wordToNumberMap[word];
      regex.lastIndex = index + 1;
    }
  });

  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i].charCodeAt(0) >= 48 && inputString[i].charCodeAt(0) <= 57) {
      indexNumber[i] = inputString[i]
    }
  }

  return indexNumber
}

const bSolution = () => {
  const input = parseInput();
  const data = input.map((line) => {
    const indexNumbers = extractNumbersFromString(line)
    const keyNumbers = Object.keys(indexNumbers).map((key) => {
      return Number(key)
    }).sort((a, b) => {
      return a - b;
    })
    const nums = keyNumbers.reduce((acc, curr) => {
      return acc.concat(indexNumbers[curr])
    }, "")

    return Number(nums.charAt(0).concat(nums.charAt(nums.length - 1)))
  })
  const ans = data.reduce((acc, curr) => {
    return acc + Number(curr)
  }, 0)
  console.log(ans)
}

//aSolution()
bSolution()
