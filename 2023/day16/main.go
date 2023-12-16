package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type Beam struct {
	Location  [2]int
	Direction string
}

func main() {
	args := os.Args
	if len(args) < 2 {
		panic("Pass the name of the file")
	}
	filePath := args[1]
	f, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	floor := [][]string{}
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := sc.Text()
		floor = append(floor, strings.Split(line, ""))
	}
	partOneResult := partOne(floor, [2]int{0, 0}, "right")
	partTwoResult := partTwo(floor)
	fmt.Printf("Part 1: %d\nPart 2: %d\n", partOneResult, partTwoResult)
}

func partOne(floor [][]string, startingPoint [2]int, initialDirection string) int {
	return walkFloor(floor, startingPoint, initialDirection)
}

func partTwo(floor [][]string) int {
	energies := []int{}
	for i := 0; i < len(floor); i++ {
		for j := 0; j < len(floor[i]) && (i == 0 || i == len(floor)-1); j++ {
			if i == 0 {
				energies = append(energies, walkFloor(floor, [2]int{i, j}, "down"))
			} else if i == len(floor)-1 {
				energies = append(energies, walkFloor(floor, [2]int{i, j}, "up"))
			}
		}
		energies = append(energies, walkFloor(floor, [2]int{i, 0}, "right"))
		energies = append(energies, walkFloor(floor, [2]int{i, len(floor[i]) - 1}, "left"))
	}
	largest := 0
	for _, energy := range energies {
		if energy > largest {
			largest = energy
		}
	}
	return largest
}

func walkFloor(floor [][]string, startingPoint [2]int, initialDirection string) int {
	beamQueue := []Beam{
		{Location: startingPoint, Direction: initialDirection},
	}
	marks := make([][]string, len(floor))
	for i := 0; i < len(marks); i++ {
		marks[i] = make([]string, len(floor[i]))
		for j := 0; j < len(marks[i]); j++ {
			marks[i][j] = "."
		}
	}
	visitedTiles := map[[2]int]bool{}
	junctions := map[string]struct{}{}
	for len(beamQueue) > 0 {
		next := beamQueue[0]
		beamQueue = beamQueue[1:]

		x, y := next.Location[0], next.Location[1]
		if x < 0 || x >= len(floor) || y < 0 || y >= len(floor[x]) {
			continue
		}

		key := fmt.Sprintf("%d,%d,%s", x, y, next.Direction)
		if _, ok := junctions[key]; ok {
			continue
		}
		junctions[key] = struct{}{}

		if next.Direction == "right" {
			currentTile := floor[x][y]
			for (currentTile == "." || currentTile == "-") && y < len(floor[x])-1 {
				if _, ok := visitedTiles[[2]int{x, y}]; !ok {
					visitedTiles[[2]int{x, y}] = true
					marks[x][y] = ">"
				}
				y++
				currentTile = floor[x][y]
			}
			if _, ok := visitedTiles[[2]int{x, y}]; !ok {
				visitedTiles[[2]int{x, y}] = true
				marks[x][y] = ">"
			}
			if y >= len(floor[x]) {
				continue
			}
			if currentTile == "|" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x + 1, y}, Direction: "down"}, Beam{Location: [2]int{x - 1, y}, Direction: "up"})
				marks[x][y] = "|"
			} else if currentTile == "/" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x - 1, y}, Direction: "up"})
				marks[x][y] = "/"
			} else if currentTile == "\\" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x + 1, y}, Direction: "down"})
				marks[x][y] = "\\"
			}
		} else if next.Direction == "left" {
			currentTile := floor[x][y]
			for (currentTile == "." || currentTile == "-") && y > 0 {
				if _, ok := visitedTiles[[2]int{x, y}]; !ok {
					visitedTiles[[2]int{x, y}] = true
					marks[x][y] = "<"
				}
				y--
				currentTile = floor[x][y]
			}
			if _, ok := visitedTiles[[2]int{x, y}]; !ok {
				visitedTiles[[2]int{x, y}] = true
				marks[x][y] = "<"
			}
			if y == 0 {
				continue
			}
			if currentTile == "|" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x + 1, y}, Direction: "down"}, Beam{Location: [2]int{x - 1, y}, Direction: "up"})
				marks[x][y] = "|"
			} else if currentTile == "/" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x + 1, y}, Direction: "down"})
				marks[x][y] = "/"
			} else if currentTile == "\\" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x - 1, y}, Direction: "up"})
				marks[x][y] = "\\"
			}
		} else if next.Direction == "down" {
			currentTile := floor[x][y]
			for (currentTile == "." || currentTile == "|") && x < len(floor)-1 {
				if _, ok := visitedTiles[[2]int{x, y}]; !ok {
					visitedTiles[[2]int{x, y}] = true
					marks[x][y] = "v"
				}
				x++
				currentTile = floor[x][y]
			}
			if _, ok := visitedTiles[[2]int{x, y}]; !ok {
				visitedTiles[[2]int{x, y}] = true
				marks[x][y] = "v"
			}
			if x == len(floor)-1 {
				continue
			}
			if currentTile == "-" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x, y + 1}, Direction: "right"}, Beam{Location: [2]int{x, y - 1}, Direction: "left"})
				marks[x][y] = "-"
			} else if currentTile == "/" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x, y - 1}, Direction: "left"})
				marks[x][y] = "/"
			} else if currentTile == "\\" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x, y + 1}, Direction: "right"})
				marks[x][y] = "\\"
			}

		} else if next.Direction == "up" {
			currentTile := floor[x][y]
			for (currentTile == "." || currentTile == "|") && x > 0 {
				if _, ok := visitedTiles[[2]int{x, y}]; !ok {
					visitedTiles[[2]int{x, y}] = true
					marks[x][y] = "^"
				}
				x--
				currentTile = floor[x][y]
			}
			if x < 0 {
				continue
			}
			if _, ok := visitedTiles[[2]int{x, y}]; !ok {
				visitedTiles[[2]int{x, y}] = true
				marks[x][y] = "^"
			}
			if currentTile == "-" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x, y + 1}, Direction: "right"}, Beam{Location: [2]int{x, y - 1}, Direction: "left"})
				marks[x][y] = "-"
			} else if currentTile == "/" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x, y + 1}, Direction: "right"})
				marks[x][y] = "/"
			} else if currentTile == "\\" {
				beamQueue = append(beamQueue, Beam{Location: [2]int{x, y - 1}, Direction: "left"})
				marks[x][y] = "\\"
			}
		}
	}
	return len(visitedTiles)
}
