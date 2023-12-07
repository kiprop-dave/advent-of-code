//@ts-ignore
const fs = require("fs");

type Hand = {
  cards: string;
  bid: number;
}

function parseInput(): Hand[] {
  const input: string = fs.readFileSync("input.txt", "utf8").trim();
  return input
    .split("\n")
    .map((line) => {
      const [cards, bid] = line.split(" ");
      return {
        cards,
        bid: parseInt(bid),
      };
    });
}

// const valueMap = {
//   '2': 0.3846,
//   '3': 0.7692,
//   '4': 1.1538,
//   '5': 1.5385,
//   '6': 1.923,
//   '7': 2.3076,
//   '8': 2.6922,
//   '9': 3.076,
//   'T': 3.4614,
//   'J': 3.846,
//   'Q': 4.2306,
//   'K': 4.6152,
//   'A': 4.9998,
// }
const valueMap = {
  '2': 0,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 5,
  '8': 6,
  '9': 7,
  'T': 8,
  'J': 9,
  'Q': 10,
  'K': 11,
  'A': 12,
}

const combinationMap = {
  "5": 7,
  "41": 6,
  "32": 5,
  "311": 4,
  "221": 3,
  "2111": 2,
  "11111": 1,
}

const calculateHand = (hand: Hand): number => {
  let handScore = 0;
  const combination = hand.cards.split("").reduce((acc: Record<string, number>, card) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {})
  const key = Object.values(combination).sort((a, b) => b - a).join("") as keyof typeof combinationMap;
  handScore += combinationMap[key];
  return handScore;
}

const compareHands = (a: Hand, b: Hand) => {
  const drawScore = calculateHand(a) - calculateHand(b);
  if (drawScore === 0) {
    for (let i = 0; i < a.cards.length; i++) {
      if (valueMap[a.cards[i]] > valueMap[b.cards[i]]) {
        return 1;
      } else if (valueMap[a.cards[i]] < valueMap[b.cards[i]]) {
        return -1;
      }
    }
    return 0;
  }
  return drawScore;
}

const partA = (input: Hand[]): number => {
  const sortedInput = input.sort(compareHands);
  return sortedInput.reduce((acc, hand, i) => {
    acc += hand.bid * (i + 1);
    return acc
  }, 0)
}

const main = () => {
  const input = parseInput();
  const resultPartA = partA(input);
  console.log(resultPartA);
}

main();
