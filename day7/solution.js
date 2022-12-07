const fsPromises = require("fs").promises;
const path = require("path");

class Node {
  constructor(name, parent = null) {
    this.dirName = name;
    this.parent = parent;
    this.children = null;
  }
}

class FileSystem {
  constructor(rootNode) {
    this.root = new Node(rootNode);
    this.pointer = this.root;
    this.visited = new Set();
    this.count = 0;
  }

  listAndInsert(children) {
    children.forEach((child) => {
      let newNode = new Node(child, this.pointer);
      if (!this.pointer.children) {
        this.pointer.children = [newNode];
        return;
      }
      this.pointer.children.push(newNode);
    });
  }

  moveIntoDir(dirName) {
    let dir = this.pointer.children.find((el) => el.dirName === dirName);
    this.pointer = dir;
  }

  moveUpDir() {
    let parent = this.pointer.parent;
    this.pointer = parent;
  }

  moveToRoot() {
    this.pointer = this.root;
  }

  printPreOrder(node) {
    if (node === null) {
      return [];
    }
    const nodes = [];
    const sums = [];
    let sum = 0;
    let format = node.dirName.split(" ");
    if (format.length > 1 && format[0] !== "dir") {
      sum += parseInt(format[0]);
      sums.push(sum);
      // console.log(sum);
    }
    nodes.push(node.dirName);

    if (node.children !== null) {
      node.children.forEach((child) => {
        // console.log(node);
        let subDirs = [...this.printPreOrder(child).nodes];
        let addition = [...this.printPreOrder(child).sums];
        // console.log([...sums]);
        sums.push(...addition);
        nodes.push(...subDirs);
      });
    }
    // console.log(sums);
    if (format[0] === "dir" || format.length === 1) {
      if (!this.visited.has(node.dirName)) {
        // console.log(node.dirName);
        let init = 0;
        const sumWith = sums.reduce((acc, current) => acc + current, init);
        if (sumWith <= 100000) {
          this.count += sumWith;
        }
        console.log(this.count);
        // console.log(sumWith);
        this.visited.add(node.dirName);
      } else {
        // console.log("not here");
      }
    }
    return { nodes, sums };
  }
}

const parseInput = async () => {
  const inputStr = await fsPromises.readFile(
    path.join(__dirname, "realInput.txt"),
    {
      encoding: "utf-8",
    },
  );
  const input = inputStr.split("\n");
  return input;
};

const createFs = async () => {
  const input = await parseInput();
  const fileTree = new FileSystem("/");

  for (let i = 1; i < input.length; i++) {
    if (input[i] === "$ ls") {
      let children = [];
      for (let j = i + 1; j < input.length; j++) {
        if (input[j].startsWith("$")) {
          break;
        }
        children.push(input[j]);
        i = j;
      }
      console.log(children);
      fileTree.listAndInsert(children);
    }
    if (input[i].startsWith("$ cd") && !input[i].endsWith("..")) {
      let dir = input[i][input[i].length - 1];
      let target = `dir ${dir}`;
      fileTree.moveIntoDir(target);
    }
    if (input[i] === "$ cd ..") {
      fileTree.moveUpDir();
    }
    // console.log(fileTree);
  }
  fileTree.moveToRoot();
  fileTree.printPreOrder(fileTree.root);
};

createFs();
