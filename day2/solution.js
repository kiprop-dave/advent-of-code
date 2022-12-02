const fsPromises = require("fs").promises;
const path = require("path");

const parseInput = async () => {
  const inputString = await fsPromises.readFile(
    path.join(__dirname, "input.txt"),
    { encoding: "utf-8" },
  );
  const inputData = inputString.split("\n");
  const input = inputData.map((el) => el.split(" "));
  return input;
};

const makeChoice = (str) => {
  let choices = { win: "", draw: "", lose: "" };
  if (str === "A") {
    choices.win = "Y";
    choices.draw = "X";
    choices.lose = "Z";
  } else if (str === "B") {
    choices.win = "Z";
    choices.draw = "Y";
    choices.lose = "X";
  } else {
    choices.win = "X";
    choices.draw = "Z";
    choices.lose = "Y";
  }
  return choices;
};

const checkWinner = (str1, str2) => {
  const playerOneWin =
    (str1 === "A" && str2 === "Z") ||
    (str1 === "B" && str2 === "X") ||
    (str1 === "C" && str2 === "Y");
  const draw =
    (str1 === "A" && str2 === "X") ||
    (str1 === "B" && str2 === "Y") ||
    (str1 === "C" && str2 === "Z");
  const player2Win =
    (str1 === "A" && str2 === "Y") ||
    (str1 === "B" && str2 === "Z") ||
    (str1 === "C" && str2 === "X");
  return { player1: playerOneWin, draw, player2: player2Win };
};

const makePlay = (str1, str2) => {
  let choices = { player1: str1, player2: "" };
  const { win, draw, lose } = makeChoice(str1);

  switch (str2) {
    case "X":
      choices.player2 = lose;
      break;
    case "Y":
      choices.player2 = draw;
      break;
    default:
      choices.player2 = win;
      break;
  }
  //   console.log(choices);
  return choices;
};

const calculateScore = (str1, str2) => {
  let roundScore = { player1: 0, player2: 0 };
  if (str1 === "A") {
    roundScore.player1 += 1;
  }
  if (str1 === "B") {
    roundScore.player1 += 2;
  }
  if (str1 === "C") {
    roundScore.player1 += 3;
  }
  if (str2 === "X") {
    roundScore.player2 += 1;
  }
  if (str2 === "Y") {
    roundScore.player2 += 2;
  }
  if (str2 === "Z") {
    roundScore.player2 += 3;
  }
  const { player1, draw, player2 } = checkWinner(str1, str2);
  if (player1) {
    roundScore.player1 += 6;
  } else if (player2) {
    roundScore.player2 += 6;
  } else if (draw) {
    roundScore.player1 += 3;
    roundScore.player2 += 3;
  }
  //   console.log(roundScore);
  return roundScore;
};

const solution = async () => {
  let opponentScore = 0;
  let userScore = 0;
  const inputData = await parseInput();

  for (let i = 0; i < inputData.length; i++) {
    let current = inputData[i];
    // const { player1, player2 } = calculateScore(current[0], current[1]); first part
    const { player2: userChoice } = makePlay(current[0], current[1]); // not needed in first part
    const { player1, player2 } = calculateScore(current[0], userChoice); // not needed in first part
    opponentScore += player1;
    userScore += player2;
  }
  console.log({ opponentScore, userScore });
};

solution();
