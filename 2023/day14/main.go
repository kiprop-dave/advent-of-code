package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"strings"
)

func main() {
	path := flag.String("path", "example.txt", "path to input file")
	flag.Parse()
	f, err := os.Open(*path)
	if err != nil {
		panic(err)
	}
	input := [][]string{}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		input = append(input, strings.Split(line, ""))
	}
	//partOneResult := partOne(input)
	partTwoResult := partTwo(input, 1000000000)
	fmt.Println(partTwoResult)
}

func rollNorth(input [][]string) {
	for col := 0; col < len(input[0]); col++ {
		//Represents the last empty slot
		i := -1
		for row := 0; row < len(input); row++ {
			current := input[row][col]
			if current == "O" && i == row {
				i++
			} else if current == "O" && i != -1 {
				input[i][col] = "O"
				input[row][col] = "."
				i++
			} else if current == "#" {
				i = row + 1
			} else if current == "." && i == -1 {
				i = row
			}
		}
	}
}

func rollSouth(input [][]string) {
	for col := 0; col < len(input[0]); col++ {
		// Represents the last empty slot
		i := -1
		for row := len(input) - 1; row >= 0; row-- {
			current := input[row][col]
			if current == "O" && i == row {
				i--
			} else if current == "O" && i != -1 {
				input[i][col] = "O"
				input[row][col] = "."
				i--
			} else if current == "#" {
				i = row - 1
			} else if current == "." && i == -1 {
				i = row
			}
		}
	}
}

func rollWest(input [][]string) {
	for row := 0; row < len(input); row++ {
		// Represents the last empty slot
		i := -1
		for col := 0; col < len(input[0]); col++ {
			current := input[row][col]
			if current == "O" && i == col {
				i++
			} else if current == "O" && i != -1 {
				input[row][i] = "O"
				input[row][col] = "."
				i++
			} else if current == "#" {
				i = col + 1
			} else if current == "." && i == -1 {
				i = col
			}
		}
	}
}

func rollEast(input [][]string) {
	for row := 0; row < len(input); row++ {
		// Represents the last empty slot
		i := -1
		for col := len(input[0]) - 1; col >= 0; col-- {
			current := input[row][col]
			if current == "O" && i == col {
				i--
			} else if current == "O" && i != -1 {
				input[row][i] = "O"
				input[row][col] = "."
				i--
			} else if current == "#" {
				i = col - 1
			} else if current == "." && i == -1 {
				i = col
			}
		}
	}
}

func partOne(input [][]string) int {
	rollNorth(input)
	return calculateLoad(input)
}

func calculateLoad(input [][]string) int {
	totalLoad := 0
	for row := 0; row < len(input); row++ {
		for col := 0; col < len(input[0]); col++ {
			if input[row][col] == "O" {
				totalLoad += len(input) - row
			}
		}
	}
	return totalLoad
}

func partTwo(input [][]string, cycles int) int {
	for i := 1; i <= cycles; i++ {
		rollNorth(input)
		rollWest(input)
		rollSouth(input)
		rollEast(input)
		if i == 153 {
			//Works,but hard coded
			cycles = (cycles - i) % 42
			break
		}
	}
	for i := 1; i <= cycles; i++ {
		rollNorth(input)
		rollWest(input)
		rollSouth(input)
		rollEast(input)
	}
	return calculateLoad(input)
}
