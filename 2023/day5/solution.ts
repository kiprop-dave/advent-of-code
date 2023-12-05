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
  const nums = data[0].split(': ')[1].split(' ').map(Number).sort((a, b) => a - b);
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
    let final = queue[0].num;
    while (queue.length > 0) {
      const { num, next } = queue.shift()!;
      const key = data[next] ? next : 'humidity-to-location';
      //console.log(next);
      for (let j = 0; (j < data[key].data.length); j++) {
        // @ts-ignore
        const [destination, source, range] = data[key].data[j];
        const upperBound = source + range;
        //console.log(j, upperBound, destination, source, range);
        if (next !== "none") {
          if (source <= num && num <= upperBound) {
            // @ts-ignore
            queue.push({ num: num + (destination - source), next: data[key].next });
          } else {
            // @ts-ignore
            queue.push({ num: num, next: data[key].next });
          }
        } else {
          final = num;
        }
      }
    }
    console.log(final);
  }
  return []
}

function main() {
  const data = parseFile();
  const partOne = aSolution(data);
}

main();

