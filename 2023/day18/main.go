package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

type DigStep struct {
	Direction string
	Steps     int
	Color     string
}

func main() {
	args := os.Args
	if len(args) < 2 {
		panic("Pass the the filepath")
	}
	f, err := os.Open(args[1])
	if err != nil {
		panic(err)
	}
	sc := bufio.NewScanner(f)
	instructions := []*DigStep{}
	for sc.Scan() {
		digStep, err := parseLine(sc.Text())
		if err != nil {
			panic(err)
		}
		instructions = append(instructions, digStep)
	}
	// digMap := markTrench(instructions)
	digMap := mapTrench(instructions)
	partOneResult := partOne(digMap)
	fmt.Println(partOneResult)
}

func parseLine(line string) (*DigStep, error) {
	lineSplit := strings.Split(line, " ")
	if len(lineSplit) != 3 {
		return nil, fmt.Errorf("Invalid line")
	}
	steps, err := strconv.Atoi(lineSplit[1])
	if err != nil {
		return nil, err
	}
	color := strings.TrimPrefix(strings.TrimSuffix(lineSplit[2], ")"), "(#")
	digStep := DigStep{
		Direction: lineSplit[0],
		Steps:     steps,
		Color:     color,
	}
	return &digStep, nil
}

func mapTrench(instructions []*DigStep) map[int][]int {
	rowMap := map[int][]int{}
	current := [2]int{0, 0}
	for _, digStep := range instructions {
		direction, steps := digStep.Direction, digStep.Steps
		switch direction {
		case "R":
			if _, ok := rowMap[current[0]]; ok {
				rowMap[current[0]] = append(rowMap[current[0]], current[1])
			} else {
				rowMap[current[0]] = []int{current[1]}
			}
			current[1] += steps

			break
		case "L":
			if _, ok := rowMap[current[0]]; ok {
				rowMap[current[0]] = append(rowMap[current[0]], current[1])
			} else {
				rowMap[current[0]] = []int{current[1]}
			}
			current[1] -= steps
			break
		case "D":
			for i := 1; i <= steps; i++ {
				if _, ok := rowMap[current[0]]; ok {
					rowMap[current[0]] = append(rowMap[current[0]], current[1])
				} else {
					rowMap[current[0]] = []int{current[1]}
				}
				current[0] += 1
			}
			break
		case "U":
			for i := 1; i <= steps; i++ {
				if _, ok := rowMap[current[0]]; ok {
					rowMap[current[0]] = append(rowMap[current[0]], current[1])
				} else {
					rowMap[current[0]] = []int{current[1]}
				}
				current[0] -= 1
			}
			break
		}
	}
	return rowMap
}

func partOne(digMap map[int][]int) int {
	area := 0
	keys := []int{}
	s, l := 0, 0
	for k, v := range digMap {
		keys = append(keys, k)
		sort.Ints(v)
		s = min(s, v[0])
		l = max(l, v[len(v)-1])
		for i := 1; i < len(v); i++ {
			area += v[i] - v[i-1]
		}
	}
	sort.Ints(keys)
	fmt.Println(keys[0], keys[len(keys)-1], s, l)
	area += len(digMap)
	return area
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
