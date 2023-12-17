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
  // const start = performance.now();
  //  partOne(heatMap);
  //console.log(performance.now() - start);
  partTwo(heatMap);
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

const walkThree = (heatMap: number[][], startingPosition: Coord, endingPosition: Coord) => {
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
  visited.add(`0,1,R,2`);
  visited.add(`1,0,D,2`);

  while (!queue.isEmpty()) {
    const cheapest = queue.dequeue()!;
    const [x, y] = cheapest.position;

    // if (x % 5 === 0 || y % 5 === 0) {
    //   console.log(x, y)
    // }

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
        if (x - 1 >= 0 && !visited.has(`${x - 1},${y + i}U${3 - i}`)) {
          queue.enqueue({
            position: [x - 1, y + i],
            direction: "U",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x - 1},${y + i}U${3 - i}`);
        }
        if (x + 1 < heatMap.length && !visited.has(`${x + 1},${y + i}D${3 - i}`)) {
          queue.enqueue({
            position: [x + 1, y + i],
            direction: "D",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x + 1},${y + i}D${3 - i}`);
        }
      }
    } else if (direction === "L") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (y - i < 0) break;
        cost += heatMap[x][y - i];
        if (x + 1 < heatMap.length && !visited.has(`${x + 1},${y - i}D${3 - i}`)) {
          queue.enqueue({
            position: [x + 1, y - i],
            direction: "D",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x + 1},${y - i}D${3 - i}`);
        }
        if (x - 1 >= 0 && !visited.has(`${x - 1},${y - i}U${3 - i}`)) {
          queue.enqueue({
            position: [x - 1, y - i],
            direction: "U",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x - 1},${y - i}U${3 - i}`);
        }
      }
    } else if (direction === "U") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (x - i < 0) break;
        cost += heatMap[x - i][y];
        if (y + 1 < heatMap[x].length && !visited.has(`${x - i},${y + 1}R${3 - i}`)) {
          queue.enqueue({
            position: [x - i, y + 1],
            direction: "R",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x - i},${y + 1}R${3 - i}`);
        }
        if (y - 1 >= 0 && !visited.has(`${x - i},${y - 1}L${3 - i}`)) {
          queue.enqueue({
            position: [x - i, y - 1],
            direction: "L",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x - i},${y - 1}L${3 - i}`);
        }
      }
    } else if (direction === "D") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (x + i > heatMap.length - 1) break;
        cost += heatMap[x + i][y];
        if (y + 1 < heatMap[x].length && !visited.has(`${x + i},${y + 1}R${3 - i}`)) {
          queue.enqueue({
            position: [x + i, y + 1],
            direction: "R",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x + i},${y + 1}R${3 - i}`);
        }
        if (y - 1 >= 0 && !visited.has(`${x + i},${y - 1}L${3 - i}`)) {
          queue.enqueue({
            position: [x + i, y - 1],
            direction: "L",
            remainingSteps: 3,
            heatCost: cost
          })
          visited.add(`${x + i},${y - 1}L${3 - i}`);
        }
      }
    }
  }
  return -1;
}

const walkTen = (heatMap: number[][], startingPosition: Coord, endingPosition: Coord) => {
  const queue = new PriorityQueue();
  const visited = new Set<string>();
  queue.enqueue({
    position: [0, 1],
    direction: "R",
    remainingSteps: 9,
    heatCost: 0
  });
  queue.enqueue({
    position: [1, 0],
    direction: "D",
    remainingSteps: 9,
    heatCost: 0
  })
  visited.add(`0,1,R,9`);
  visited.add(`1,0,D,9`);

  while (!queue.isEmpty()) {
    const cheapest = queue.dequeue()!;
    const [x, y] = cheapest.position;

    // if (x % 5 === 0 || y % 5 === 0) {
    //   console.log(x, y)
    // }

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
        if (x === endingPosition[0] && y + i === endingPosition[1]) {
          //reached goal
          return cost;
        }
        if (i < 3) continue;
        if (x - 1 >= 0 && !visited.has(`${x - 1},${y + i}U${10 - i}`)) {
          queue.enqueue({
            position: [x - 1, y + i],
            direction: "U",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x - 1},${y + i}U${10 - i}`);
        }
        if (x + 1 < heatMap.length && !visited.has(`${x + 1},${y + i}D${10 - i}`)) {
          queue.enqueue({
            position: [x + 1, y + i],
            direction: "D",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x + 1},${y + i}D${10 - i}`);
        }
      }
    } else if (direction === "L") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (y - i < 0) break;
        cost += heatMap[x][y - i];
        if (x === endingPosition[0] && y - i === endingPosition[1]) {
          //reached goal
          return cost;
        }
        if (i < 3) continue;
        if (x + 1 < heatMap.length && !visited.has(`${x + 1},${y - i}D${10 - i}`)) {
          queue.enqueue({
            position: [x + 1, y - i],
            direction: "D",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x + 1},${y - i}D${10 - i}`);
        }
        if (x - 1 >= 0 && !visited.has(`${x - 1},${y - i}U${10 - i}`)) {
          queue.enqueue({
            position: [x - 1, y - i],
            direction: "U",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x - 1},${y - i}U${10 - i}`);
        }
      }
    } else if (direction === "U") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (x - i < 0) break;
        cost += heatMap[x - i][y];
        if (x - i === endingPosition[0] && y === endingPosition[1]) {
          //reached goal
          return cost;
        }
        if (i < 3) continue;
        if (y + 1 < heatMap[x].length && !visited.has(`${x - i},${y + 1}R${10 - i}`)) {
          queue.enqueue({
            position: [x - i, y + 1],
            direction: "R",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x - i},${y + 1}R${10 - i}`);
        }
        if (y - 1 >= 0 && !visited.has(`${x - i},${y - 1}L${10 - i}`)) {
          queue.enqueue({
            position: [x - i, y - 1],
            direction: "L",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x - i},${y - 1}L${10 - i}`);
        }
      }
    } else if (direction === "D") {
      for (let i = 0; i < stepsRemaining; i++) {
        if (x + i > heatMap.length - 1) break;
        cost += heatMap[x + i][y];
        if (x + i === endingPosition[0] && y === endingPosition[1]) {
          //reached goal
          return cost;
        }
        if (i < 3) continue;
        if (y + 1 < heatMap[x].length && !visited.has(`${x + i},${y + 1}R${10 - i}`)) {
          queue.enqueue({
            position: [x + i, y + 1],
            direction: "R",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x + i},${y + 1}R${10 - i}`);
        }
        if (y - 1 >= 0 && !visited.has(`${x + i},${y - 1}L${10 - i}`)) {
          queue.enqueue({
            position: [x + i, y - 1],
            direction: "L",
            remainingSteps: 10,
            heatCost: cost
          })
          visited.add(`${x + i},${y - 1}L${10 - i}`);
        }
      }
    }
  }
  return -1;
}

const partOne = (heatMap: number[][]) => {
  const startingPosition: Coord = [0, 0];
  const endingPosition: Coord = [heatMap.length - 1, heatMap[0].length - 1];
  const cost = walkThree(heatMap, startingPosition, endingPosition);
  console.log(cost);
}

const partTwo = (heatMap: number[][]) => {
  const startingPosition: Coord = [0, 0];
  const endingPosition: Coord = [heatMap.length - 1, heatMap[0].length - 1];
  const cost = walkTen(heatMap, startingPosition, endingPosition);
  console.log(cost);
}

main();
