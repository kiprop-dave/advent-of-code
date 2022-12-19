//@ts-ignore
import { readFile } from "fs/promises";
//@ts-ignore
import { join } from "path";

class TreeNode {
  name: string;
  parent: null | TreeNode;
  children: null | TreeNode[];
  constructor(root: string, parent: TreeNode | null = null) {
    this.name = root;
    this.parent = parent;
    this.children = null;
  }
}

class FileSystemTree {
  root: TreeNode;
  pointer: TreeNode;
  dirSums: NodeCount[];
  constructor(rootDir: string) {
    this.root = new TreeNode(rootDir);
    this.pointer = this.root;
    this.dirSums = [];
  }

  list(children: string[]) {
    children.forEach((child) => {
      let parent = this.pointer;
      let node = new TreeNode(child, parent);
      if (!this.pointer.children) {
        this.pointer.children = [];
      }
      this.pointer.children.push(node);
    });
  }

  moveIntoDir(subDir: string) {
    if (!this.pointer.children) {
      throw new Error("No children directories");
    }

    let child = this.pointer.children.find((el) => el.name === subDir);
    if (!child) {
      throw new Error("No sub dir with that name");
    }
    this.pointer = child;
  }

  moveUpDir() {
    if (!this.pointer.parent) {
      throw new Error("No parent directory");
    }
    this.pointer = this.pointer.parent;
  }

  preOrder(root: TreeNode) {
    if (!root) {
      // return { nodes: [], summations: [] };
      return [];
    }
    let current = root;
    let sum = 0;
    let dir = /dir/;

    let nodesTest: NodeCount[] = [];

    if (!dir.test(current.name) && current.name.length > 1) {
      let format = current.name.split(" ");
      sum += parseInt(format[0]);
    }

    let currentNode: NodeCount = {
      node: current.name,
      sum: sum,
    };

    nodesTest.push(currentNode);

    if (current.children) {
      current.children.forEach((child) => {
        nodesTest.push(...this.preOrder(child));
      });
    }

    if (nodesTest.length > 1) {
      let dir = nodesTest[0].node;
      let init = 0;
      const dirSum = nodesTest.reduce((prev, curr) => prev + curr.sum, init);
      this.dirSums.push({ node: dir, sum: dirSum });
    }
    return nodesTest;
  }
}

type NodeCount = {
  node: string;
  sum: number;
};

const parseInput = async () => {
  //@ts-ignore
  const input = await readFile(join(__dirname, "input.txt"), {
    encoding: "utf-8",
  });
  const format = input.split("\n");
  return format;
};

const createFileTree = async () => {
  const input = await parseInput();
  const fsTree = new FileSystemTree("/");
  for (let i = 1; i < input.length; i++) {
    const comm = input[i];
    if (comm.startsWith("$ ls")) {
      let subDirs: string[] = [];
      for (let j = i + 1; j < input.length; j++) {
        const subDir = input[j];
        if (subDir.startsWith("$")) {
          break;
        } else {
          subDirs.push(subDir);
          i = j;
        }
      }
      fsTree.list(subDirs);
    } else if (comm.startsWith("$ cd") && !comm.endsWith("..")) {
      let command = comm.split(" ");
      let dirName = command[command.length - 1].trim();
      let subDir = `dir ${dirName}`;
      fsTree.moveIntoDir(subDir);
    } else if (comm === "$ cd ..") {
      fsTree.moveUpDir();
    }
  }
  fsTree.preOrder(fsTree.root);
  // const less = fsTree.dirSums // first part
  //   .filter((node) => node.sum <= 100000)
  //   .reduce((prev, curr) => prev + curr.sum, 0);
  // console.log(less);
  let nodes = [...fsTree.dirSums];
  const totalSpace = 70000000;
  const neededSpace = 30000000;
  const spaceUsed = nodes[nodes.length - 1].sum;
  const rem = totalSpace - spaceUsed;
  if (rem < neededSpace) {
    let bigEnough = nodes
      .filter((el) => {
        if (rem + el.sum > neededSpace) {
          return true;
        } else {
          return false;
        }
      })
      .sort((a, b) => a.sum - b.sum)[0];

    console.log(bigEnough.sum);
  }
};

createFileTree();
