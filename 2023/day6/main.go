package main

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
)

type Game struct {
	Time   int
	Record int
}

func main() {
	f, err := os.Open("input.txt")
	if err != nil {
		panic(err)
	}
	b, err := io.ReadAll(f)
	if err != nil {
		panic(err)
	}
	games, err := parseInput(b)
	if err != nil {
		panic(err)
	}
	partOneResult := partOne(games)
	partTwoResult, err := partTwo(games)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Part 1: %d\nPart 2: %d\n", partOneResult, partTwoResult)

}

func parseInput(input []byte) ([]*Game, error) {
	lines := strings.Split(string(input), "\n")
	times := make([]int, 0)
	records := make([]int, 0)
	for i, line := range lines {
		if line == "" {
			continue
		}
		lineSplit := strings.Split(line, ": ")
		if len(lineSplit) != 2 {
			return nil, fmt.Errorf("invalid line: %s", line)
		}
		for _, v := range strings.Split(lineSplit[1], " ") {
			if v == "" {
				continue
			}
			num, err := strconv.Atoi(strings.TrimSpace(v))
			if err != nil {
				return nil, err
			}
			if i == 0 {
				times = append(times, num)
			} else {
				records = append(records, num)
			}
		}
	}
	games := make([]*Game, 0)
	if len(times) != len(records) {
		return nil, fmt.Errorf("times and records have different lengths")
	}
	for i := 0; i < len(times); i++ {
		games = append(games, &Game{Time: times[i], Record: records[i]})
	}
	return games, nil
}

func partOne(games []*Game) int {
	result := 1
	for _, game := range games {
		records := 0
		for i := 0; i < game.Time; i++ {
			distance := (game.Time - i) * i
			if distance > game.Record {
				records++
			}
		}
		result *= records
	}

	return result
}

func partTwo(games []*Game) (int, error) {
	timeString, recordString := "", ""

	for _, game := range games {
		timeString += strconv.Itoa(game.Time)
		recordString += strconv.Itoa(game.Record)
	}
	timeNum, err := strconv.Atoi(timeString)
	if err != nil {
		return 0, err
	}
	recordNum, err := strconv.Atoi(recordString)
	if err != nil {
		return 0, err
	}
	records := 0
	for i := 0; i < timeNum; i++ {
		distance := (timeNum - i) * i
		if distance > recordNum {
			records++
		}
	}
	return records, nil
}
