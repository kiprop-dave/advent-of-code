package main

import (
	"fmt"
	"io"
	"os"
	"strings"
	"sync"
)

type DirectionBuffer struct {
	Direction string
	Current   int
}

func NewDirectionBuffer(direction string) *DirectionBuffer {
	return &DirectionBuffer{
		Direction: direction,
		Current:   0,
	}
}

type Input struct {
	Directions   string
	DirectionMap map[string][2]string
}

func (db *DirectionBuffer) Next() string {
	curent := db.Direction[db.Current]
	db.Current = (db.Current + 1) % len(db.Direction)
	return string(curent)
}

func main() {
	f, err := os.Open("input.txt")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	b, err := io.ReadAll(f)
	if err != nil {
		panic(err)
	}
	input, err := parseInput(b)
	if err != nil {
		panic(err)
	}
	partOneAnswer, err := partOne(input)
	if err != nil {
		panic(err)
	}
	partTwoAnswer, err := partTwo(input)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Part one: %d\nPart two: %d\n", partOneAnswer, partTwoAnswer)
}

func parseInput(b []byte) (*Input, error) {
	split := strings.Split(string(b), "\n\n")
	if len(split) != 2 {
		return nil, fmt.Errorf("Invalid input, expected 2 parts")
	}
	directions := split[0]
	directionMap := make(map[string][2]string)
	directionsSplit := strings.Split(strings.TrimSpace(split[1]), "\n")
	for _, direction := range directionsSplit {
		mapSplit := strings.Split(direction, " = ")
		if len(mapSplit) != 2 {
			return nil, fmt.Errorf("Invalid input,expected key = value")
		}
		key := mapSplit[0]
		value := strings.TrimPrefix(strings.TrimSuffix(mapSplit[1], ")"), "(")
		valueSplit := strings.Split(value, ", ")
		if len(valueSplit) != 2 {
			return nil, fmt.Errorf("Invalid input at values")
		}
		directionMap[key] = [2]string{valueSplit[0], valueSplit[1]}
	}
	return &Input{Directions: directions, DirectionMap: directionMap}, nil
}

func partOne(input *Input) (int, error) {
	db := NewDirectionBuffer(input.Directions)
	currentKey := "AAA"
	steps := 0
	for currentKey != "ZZZ" {
		direction := db.Next()
		leftRight, ok := input.DirectionMap[currentKey]
		if !ok {
			return 0, fmt.Errorf("Invalid input, missing key: %s", currentKey)
		}
		left, right := leftRight[0], leftRight[1]
		if direction == "L" {
			currentKey = left
		} else {
			currentKey = right
		}
		steps++
	}
	return steps, nil
}

func partTwo(input *Input) (int, error) {
	aTails := []string{}
	for key := range input.DirectionMap {
		if key[2] == 'A' {
			aTails = append(aTails, key)
		}
	}
	wg := sync.WaitGroup{}

	stepsChan := make(chan int, len(aTails))
	for _, key := range aTails {
		wg.Add(1)
		go func(key string) {
			db := NewDirectionBuffer(input.Directions)
			currentKey := key
			if len(key) != 3 {
				panic(fmt.Errorf("Invalid key %s", key))
			}
			steps := 0
			for currentKey[2] != 'Z' {
				direction := db.Next()
				leftRight, ok := input.DirectionMap[currentKey]
				if !ok {
					panic(fmt.Errorf("Invalid input, missing key: %s", currentKey))
				}
				left, right := leftRight[0], leftRight[1]
				if direction == "L" {
					currentKey = left
				} else {
					currentKey = right
				}
				steps++
			}
			stepsChan <- steps
			wg.Done()
		}(key)
	}

	wg.Wait()
	close(stepsChan)

	steps := []int{}
	for s := range stepsChan {
		steps = append(steps, s)
	}
	result := 1
	for _, s := range steps {
		result = (result * s) / gcd(result, s)
	}
	return result, nil
}

func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}
