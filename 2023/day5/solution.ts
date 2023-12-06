//@ts-ignore
const fs = require('fs');

type InputData = {
  seed: { data: number[], next: "seed-to-soil" },
  "seed-to-soil": { data: number[][], next: "soil-to-fertilizer" },
  "soil-to-fertilizer": { data: number[][], next: "fertilizer-to-water" },
  "fertilizer-to-water": { data: number[][], next: "water-to-light" },
  "water-to-light": { data: number[][], next: "light-to-temperature" },
  "light-to-temperature": { data: number[][], next: "temperature-to-humidity" },
  "temperature-to-humidity": { data: number[][], next: "humidity-to-location" },
  "humidity-to-location": { data: number[][], next: "none" }
}

function parseFile(): InputData {
  const data: string = fs.readFileSync('./input.txt', { encoding: 'utf8' }).trim().split('\n\n');
  const parsed: InputData = {
    seed: { data: [], next: "seed-to-soil" },
    "seed-to-soil": { data: [], next: "soil-to-fertilizer" },
    "soil-to-fertilizer": { data: [], next: "fertilizer-to-water" },
    "fertilizer-to-water": { data: [], next: "water-to-light" },
    "water-to-light": { data: [], next: "light-to-temperature" },
    "light-to-temperature": { data: [], next: "temperature-to-humidity" },
    "temperature-to-humidity": { data: [], next: "humidity-to-location" },
    "humidity-to-location": { data: [], next: "none" }
  }
  const nums = data[0].split(': ')[1].split(' ').map(Number);
  parsed.seed.data = nums;
  for (let i = 1; i < data.length; i++) {
    const content = data[i].trim().split('\n');
    const key = content[0].split(' ')[0] as keyof InputData;
    for (let j = 1; j < content.length; j++) {
      const nums = content[j].split(' ').map(Number);
      // @ts-ignore
      parsed[key].data.push(nums);
    }
  }
  //console.log(parsed);
  return parsed;
}

const aSolution = (data: InputData): number[] => {
  const finalLocations: number[] = [];
  for (let i = 0; i < data.seed.data.length; i++) {
    const queue: { num: number, next: keyof InputData | 'none' }[] = [{ num: data.seed.data[i], next: data.seed.next }];
    while (queue.length > 0) {
      const { num, next } = queue.shift()!;
      const key = data[next] ? next : 'humidity-to-location';
      const nextVal = { isOneToOne: true, val: 0 };
      for (let j = 0; (j < data[key].data.length); j++) {
        // @ts-ignore
        const [destination, source, range] = data[key].data[j];
        const upperBound = source + range;
        if (source <= num && num < upperBound) {
          nextVal.isOneToOne = false;
          nextVal.val = num + (destination - source);
          break;
        }
      }
      if (next in data) {
        if (nextVal.isOneToOne) {
          queue.push({ num: num, next: data[key].next });
          if (key === 'humidity-to-location') {
            finalLocations.push(num);
          }
        } else {
          if (key === 'humidity-to-location') {
            finalLocations.push(nextVal.val);
          }
          //console.log(nextVal.val);
          queue.push({ num: nextVal.val, next: data[key].next });
        }
      }
    }
  }
  return finalLocations.sort((a, b) => a - b);
}

const bSolution = (data: InputData): number => {
  const seeds: number[] = [];
  for (let i = 0; i < data.seed.data.length; i += 2) {
    const lowerBound = data.seed.data[i];
    const upperBound = lowerBound + data.seed.data[i + 1];
    for (let j = lowerBound; j < upperBound; j++) {
      seeds.push(j);
    }
  }
  seeds.sort((a, b) => a - b);
  let smallest = Infinity;
  for (let i = 0; i < seeds.length; i++) {
    const queue: { num: number, next: keyof InputData | 'none' }[] = [{ num: seeds[i], next: data.seed.next }];
    while (queue.length > 0) {
      const { num, next } = queue.shift()!;
      const key = data[next] ? next : 'humidity-to-location';
      const nextVal = { isOneToOne: true, val: 0 };
      for (let j = 0; (j < data[key].data.length); j++) {
        // @ts-ignore
        const [destination, source, range] = data[key].data[j];
        const upperBound = source + range;
        if (source <= num && num < upperBound) {
          nextVal.isOneToOne = false;
          nextVal.val = num + (destination - source);
          break;
        }
      }
      if (next in data) {
        if (nextVal.isOneToOne) {
          queue.push({ num: num, next: data[key].next });
          if (key === 'humidity-to-location' && num < smallest) {
            smallest = num;
          }
        } else {
          if (key === 'humidity-to-location' && nextVal.val < smallest) {
            smallest = nextVal.val;
          }
          //console.log(nextVal.val);
          queue.push({ num: nextVal.val, next: data[key].next });
        }
      }
    }
  }
  return smallest;
}

function main() {
  const data = parseFile();
  //const partOne = aSolution(data);
  //console.log(partOne);
  const partTwo = bSolution(data);
  console.log(partTwo);
}

main();

