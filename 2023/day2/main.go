package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const (
	maxRed   = 12
	maxGreen = 13
	maxBlue  = 14
)

type Round struct {
	Red   int
	Green int
	Blue  int
}

type Game struct {
	ID     int
	Rounds []*Round
}

func main() {
	f, err := os.Open("./input.txt")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	games := []*Game{}

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		game, err := parseGame(line)
		if err != nil {
			panic(err)
		}
		games = append(games, game)
	}

	sum := bSolution(games)

	fmt.Println(sum)
}

func aSolution(games []*Game) int {
	possibleGameSums := 0
	for _, game := range games {
		//fmt.Printf("%d\n", game.ID)
		isPossible := true
		for _, round := range game.Rounds {
			//fmt.Printf("%s:%d\n%s:%d\n%s:%d\n\n", "red", round.Red, "green", round.Green, "blue", round.Blue)
			if round.Red > maxRed || round.Green > maxGreen || round.Blue > maxBlue {
				isPossible = false
			}
		}
		if isPossible {
			possibleGameSums += game.ID
		}
	}

	return possibleGameSums
}

func bSolution(games []*Game) int {
	biggestProducts := []int{}
	for _, game := range games {
		biggestRed := 0
		biggestGreen := 0
		biggestBlue := 0
		for _, round := range game.Rounds {
			biggestRed = max(biggestRed, round.Red)
			biggestGreen = max(biggestGreen, round.Green)
			biggestBlue = max(biggestBlue, round.Blue)
		}
		biggestProducts = append(biggestProducts, biggestRed*biggestGreen*biggestBlue)
	}
	sum := 0
	for _, product := range biggestProducts {
		sum += product
	}

	return sum
}

func parseGame(line string) (*Game, error) {
	game := Game{}
	split := strings.Split(line, ": ")
	if len(split) != 2 {
		return nil, fmt.Errorf("invalid line: %s", line)
	}

	idSplit := strings.Split(split[0], " ")
	if len(idSplit) != 2 {
		return nil, fmt.Errorf("invalid line: %s", line)
	}
	id, err := strconv.Atoi(idSplit[1])
	if err != nil {
		return nil, err
	}
	game.ID = id
	rounds := strings.Split(split[1], "; ")

	for _, round := range rounds {
		roundSplit := strings.Split(round, ", ")
		currRound := &Round{}
		for _, r := range roundSplit {
			drawSplit := strings.Split(r, " ")
			if len(drawSplit) != 2 {
				return nil, fmt.Errorf("invalid line: %s", line)
			}
			draw, err := strconv.Atoi(drawSplit[0])
			if err != nil {
				return nil, err
			}
			switch drawSplit[1] {
			case "red":
				currRound.Red = draw
			case "green":
				currRound.Green = draw
			case "blue":
				currRound.Blue = draw
			}
		}
		game.Rounds = append(game.Rounds, currRound)
	}

	return &game, nil
}
