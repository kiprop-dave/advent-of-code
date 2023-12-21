//@ts-ignore
const fs = require("fs");
//@ts-ignore
const readLine = require("readline");

type InputData = {
  startingPosition: [number, number],
  map: string[][]
}

const parseInputFile = (filename: string): Promise<InputData> => {
  const rl = readLine.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  })
  return new Promise(resolve => {
    const map: string[][] = []
    let startingPosition: [number, number] = [0, 0]
    let foundStartingPosition = false
    rl.on("line", (line: string) => {
      const lineArray = line.split("")
      lineArray.forEach((c, i) => {
        if (c === "S") {
          startingPosition[1] = i;
          foundStartingPosition = true;
          lineArray[i] = ".";
        }
      })
      map.push(lineArray)
      if (!foundStartingPosition) startingPosition[0]++
    })
    rl.on("close", () => {
      resolve({
        startingPosition,
        map
      })
    })
  })
}

const main = async () => {
  //@ts-ignore
  const args: string[] = process.argv;
  if (args.length < 3) {
    console.log("Please provide a file name")
    return
  }
  const filename = args[2]
  const lines = await parseInputFile(filename)
  //const partOneAnswer = partOne(lines)
  const partTwoAnswer = partTwo(lines)
  console.log(partTwoAnswer)
}

const countSteps = (input: InputData, remainingSteps: number): number => {
  let totalPlots = 0;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]
  const queue: [number, number][] = [[input.startingPosition[0], input.startingPosition[1]]];
  for (let i = 0; (i < remainingSteps && queue.length > 0); i++) {
    const l = queue.length;
    const visited = new Set<string>();
    for (let j = 0; j < l; j++) {
      const nextPosition = queue.shift()!;
      for (const [dx, dy] of directions) {
        const nextX = nextPosition[0] + dx
        const nextY = nextPosition[1] + dy
        if (nextX < 0 || nextX >= input.map.length || nextY < 0 || nextY >= input.map[0].length) continue;
        if (input.map[nextX][nextY] === "#") continue;
        if (input.map[nextX][nextY] === "." && !visited.has(`${nextX},${nextY}`)) {
          queue.push([nextX, nextY])
          visited.add(`${nextX},${nextY}`)
        }
      }
    }
    totalPlots = queue.length;
  }

  return totalPlots;
}

const partOne = (input: InputData) => {
  return countSteps(input, 64)
}

const partTwo = (input: InputData) => {
  //return countSteps(input, 26501365)
  //return countSteps(input, 202300)
}

main()
