//@ts-ignore
const fs = require("fs");

const readFile = (filename: string): number[][] => {
  const file: string = fs.readFileSync(filename, "utf8").trim();
  return file.split("\n").map((line) => line.split("").map(Number));
}

const main = () => {
  //@ts-ignore
  const filePath: string = process.argv[2];
  const heatMap = readFile(filePath);
  partOne(heatMap);
}

type Direction = "U" | "D" | "L" | "R";
type Coord = [number, number];
type State = {
  position: Coord,
  direction: Direction,
  remainingSteps: number,
  heatCost: number
}

class PriorityQueue {
  private queue: State[] = [];

  enqueue(state: State) {
    this.queue.push(state);
    this.queue.sort((a, b) => a.heatCost - b.heatCost);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

const aStar = (heatMap: number[][], startingPosition: Coord, endingPosition: Coord) => {
  const queue = new PriorityQueue();
  const visited = new Set<string>();
  queue.enqueue({
    position: [0, 1],
    direction: "R",
    remainingSteps: 2,
    heatCost: 0
  });
  queue.enqueue({
    position: [1, 0],
    direction: "D",
    remainingSteps: 2,
    heatCost: 0
  })
  visited.add(`0,0,0,1R`);
  visited.add(`0,0,1,0D`);

  while (!queue.isEmpty()) {
    const cheapest = queue.dequeue()!;
    const [x, y] = cheapest.position;

    if (x === endingPosition[0] && y === endingPosition[1]) {
      //reached goal
      return cheapest.heatCost + heatMap[x][y];
    }

    const stepsRemaining = cheapest.remainingSteps;
    const direction = cheapest.direction;
    let cost = cheapest.heatCost;

    if (direction === "R") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (y + i > heatMap[x].length - 1) break;
        cost += heatMap[x][y + i];
        if (x - 1 >= 0 && !visited.has(`${x},${y},${x - 1},${y + i}U`)) {
          queue.enqueue({
            position: [x - 1, y + i],
            direction: "U",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x - 1},${y + i}U`);
        }
        if (x + 1 < heatMap.length && !visited.has(`${x},${y},${x + 1},${y + i}D`)) {
          queue.enqueue({
            position: [x + 1, y + i],
            direction: "D",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x + 1},${y + i}D`);
        }
      }
    } else if (direction === "L") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (y - i < 0) break;
        cost += heatMap[x][y - i];
        if (x + 1 < heatMap.length && !visited.has(`${x},${y},${x + 1},${y - i}D`)) {
          queue.enqueue({
            position: [x + 1, y - i],
            direction: "D",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x + 1},${y - i}D`);
        }
        if (x - 1 >= 0 && !visited.has(`${x},${y},${x - 1},${y - i}U`)) {
          queue.enqueue({
            position: [x - 1, y - i],
            direction: "U",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x - 1},${y - i}U`);
        }
      }
    } else if (direction === "U") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (x - i < 0) break;
        cost += heatMap[x - i][y];
        if (y + 1 < heatMap[x].length && !visited.has(`${x},${y},${x - i},${y + 1}R`)) {
          queue.enqueue({
            position: [x - i, y + 1],
            direction: "R",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x - i},${y + 1}R`);
        }
        if (y - 1 >= 0 && !visited.has(`${x},${y},${x - i},${y - 1}L`)) {
          queue.enqueue({
            position: [x - i, y - 1],
            direction: "L",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x - i},${y - 1}L`);
        }
      }
    } else if (direction === "D") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (x + i > heatMap.length - 1) break;
        cost += heatMap[x + i][y];
        if (y + 1 < heatMap[x].length && !visited.has(`${x},${y},${x + i},${y + 1}R`)) {
          queue.enqueue({
            position: [x + i, y + 1],
            direction: "R",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x + i},${y + 1}R`);
        }
        if (y - 1 >= 0 && !visited.has(`${x},${y},${x + i},${y - 1}L`)) {
          queue.enqueue({
            position: [x + i, y - 1],
            direction: "L",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x},${y},${x + i},${y - 1}L`);
        }
      }
    }
  }
  return -1;
}

const partOne = (heatMap: number[][]) => {
  const startingPosition: Coord = [0, 0];
  const endingPosition: Coord = [heatMap.length - 1, heatMap[0].length - 1];
  const cost = aStar(heatMap, startingPosition, endingPosition);
  console.log(cost);
}

main();
