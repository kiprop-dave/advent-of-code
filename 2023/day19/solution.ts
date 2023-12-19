//@ts-ignore
const fs = require("fs");

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
}

type WorkFlow = Record<string, string[][]>;

const parseInput = (path: string): { parts: Part[], workflows: WorkFlow } => {
  const [workflowSplit, partsSplit] = fs.readFileSync(path, "utf-8").trim().split("\n\n");
  const parts: Part[] = partsSplit.split("\n").map((line: string) => {
    const [x, m, a, s] = line.slice(1, -1).split(",").map((rating) => {
      const ratingSplit = rating.split("=");
      return Number(ratingSplit[1]);
    });
    return {
      x,
      m,
      a,
      s
    }
  });
  const workflows: WorkFlow = workflowSplit.split("\n").reduce((acc: WorkFlow, line: string) => {
    const [key, rulesString] = line.split("{");
    const rules = rulesString.slice(0, -1).split(",").map((rule) => {
      const ruleSplit = rule.split(":");
      if (ruleSplit.length === 1) {
        return ruleSplit;
      }
      return [ruleSplit[0][0], ruleSplit[0][1], ruleSplit[0].slice(2), ruleSplit[1]];
    })
    acc[key] = rules;
    return acc
  }, {});
  return {
    parts,
    workflows
  }
}

const main = () => {
  //@ts-ignore
  const args: string[] = process.argv;
  if (args.length < 3) {
    throw new Error("Pass in path to input");
  }
  const { parts, workflows } = parseInput(args[2]);
  const partOneResult = partOne(parts, workflows);
  const partTwoResult = partTwo(workflows);
  console.log(partOneResult, partTwoResult);
}

const sortPart = (part: Part, workflows: WorkFlow): "A" | "R" => {
  const queue: string[] = ["in"]
  while (queue.length) {
    const next = queue.shift()!;
    if (next === "A") {
      return "A"
    } else if (next === "R") {
      return "R"
    }
    const workflow = workflows[next];
    for (const rule of workflow) {
      if (rule.length === 1) {
        queue.push(rule[0]);
        break;
      } else {
        const value: number = part[rule[0]];
        if (rule[1] === ">") {
          if (value > Number(rule[2])) {
            queue.push(rule[3]);
            break;
          }
        } else if (rule[1] === "<") {
          if (value < Number(rule[2])) {
            queue.push(rule[3]);
            break;
          }
        }
      }
    }
  }
  return "R"
}

const partOne = (parts: Part[], workflows: WorkFlow): number => {
  const accepted: number[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const result = sortPart(part, workflows);
    if (result === "A") {
      accepted.push(i);
    }
  }
  return accepted.reduce((acc, index) => {
    const sum = Object.values(parts[index]).reduce((acc, value) => {
      return acc + value
    }, 0)
    return acc + sum
  }, 0);
}

const partTwo = (workflows: WorkFlow): number => {
  let acceptedCombinations = 0;
  const part: Part = {
    x: 1,
    m: 1,
    a: 1,
    s: 1
  }
  return acceptedCombinations;
}

main()
