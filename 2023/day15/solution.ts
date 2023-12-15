//@ts-ignore
const fs = require('fs');

type Operation = { method: "delete" } | { method: "upsert", length: number }
type Segment = { key: string } & Operation

function parseInputFile(path: string): string[] {
  return fs.readFileSync(path, 'utf8').trim().split(',');
}

function main() {
  //@ts-ignore
  const fileName = process.argv[2];
  const input = parseInputFile(fileName);
  const partOneResult = partOne(input);
  const partTwoResult = partTwo(input);
  console.table([
    { part: 1, result: partOneResult },
    { part: 2, result: partTwoResult }
  ])
}

const segmentInput = (input: string[]): Segment[] => {
  return input.map((seg) => {
    let segParts: string[] = seg.split('=');
    if (segParts.length === 2) {
      return {
        key: segParts[0],
        method: "upsert",
        length: parseInt(segParts[1])
      }
    } else {
      segParts = seg.split('-');
      return {
        key: segParts[0],
        method: "delete"
      }
    }
  })
}

const partOne = (input: string[]): number => {
  let hashSum = 0;
  for (let i = 0; i < input.length; i++) {
    hashSum += hashSegment(input[i], 0);
  }
  return hashSum;
}

const partTwo = (input: string[]): number => {
  const segments = segmentInput(input);
  const boxes = Array.from({ length: 256 }, () => {
    return new OrderedHashMap<string, number>();
  });
  segments.forEach((segment) => {
    const index = hashSegment(segment.key, 0);
    if (index >= 256 || index < 0) {
      throw new Error("Index out of bounds");
    }
    if (segment.method === "upsert") {
      boxes[index].set(segment.key, segment.length);
    } else {
      boxes[index].delete(segment.key);
    }
  });
  return boxes.reduce((acc, box, i) => {
    for (const key of box) {
      const { value, slotIndex } = box.get(key)!;
      acc += (i + 1) * slotIndex * value;
    }
    return acc
  }, 0);
}

const hashSegment = (segment: string, current: number): number => {
  for (let i = 0; i < segment.length; i++) {
    current += (segment.charCodeAt(i));
    current *= 17;
    current = current % 256;
  }
  return current
}

class OrderedHashMap<K, V>{
  private map = new Map<K, V>();
  private keySet = new Set<K>();

  get(key: K): { value: V; slotIndex: number } | undefined {
    let i = 1;
    for (const k of this.keySet) {
      if (k === key) {
        return {
          value: this.map.get(key)!,
          slotIndex: i
        }
      }
      i++;
    }
  }

  set(key: K, value: V) {
    this.map.set(key, value);
    this.keySet.add(key);
  }

  delete(key: K) {
    this.map.delete(key);
    this.keySet.delete(key);
  }

  [Symbol.iterator]() {
    return this.keySet[Symbol.iterator]();
  }
}

main()
