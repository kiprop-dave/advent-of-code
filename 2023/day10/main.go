package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"
)

type PipeMaze struct {
	Beginning [2]int
	Maze      [][]string
}

func main() {
	f, err := os.Open("input.txt")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	directions := directionMap()
	maze := parseInput(f)
	fmt.Println(maze)
}

func parseInput(r io.Reader) *PipeMaze {
	maze := [][]string{}
	starting := [2]int{}
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		line := strings.Split(scanner.Text(), "")
		maze = append(maze, line)
		for i, c := range line {
			if c == "S" {
				starting[0] = len(maze) - 1
				starting[1] = i
			}
		}
	}
	return &PipeMaze{starting, maze}
}

func directionMap() map[string][2][2]int {
	directions := make(map[string][2][2]int)
	directions["|"] = [2][2]int{
		{-1, 0},
		{1, 0},
	}
	directions["-"] = [2][2]int{
		{0, -1},
		{0, 1},
	}
	directions["L"] = [2][2]int{
		{-1, 0},
		{0, 1},
	}
	directions["J"] = [2][2]int{
		{-1, 0},
		{0, -1},
	}
	directions["7"] = [2][2]int{
		{-1, 0},
		{0, -1},
	}
	directions["F"] = [2][2]int{
		{1, 0},
		{0, 1},
	}

	return directions
}

func markLoop(maze *PipeMaze, directions map[string][2][2]int) {
	queue := [][2]int{
		maze.Beginning,
	}
	surrounding := [4][2]int{
		{0, -1},
		{0, 1},
		{-1, 0},
		{1, 0},
	}
	for len(queue) > 0 {
	}

}
