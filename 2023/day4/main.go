package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Card struct {
	CardNo      int
	WinningNums map[int]struct{}
	Numbers     map[int]struct{}
	Score       int
}

func main() {
	f, err := os.Open("input.txt")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	cards := []*Card{}
	for scanner.Scan() {
		line := scanner.Text()
		card, err := readCard(line)
		if err != nil {
			panic(err)
		}
		cards = append(cards, card)
	}
	// for _, card := range cards {
	// 	fmt.Println(card.Score)
	// }
	// aAnswer := aSolution(cards)
	// fmt.Println(aAnswer)
	bAnswer := bSolution(cards)
	fmt.Println(bAnswer)
}

func aSolution(cards []*Card) int {
	score := 0
	for _, card := range cards {
		if card.Score == 0 {
			continue
		}
		cardScore := 1
		cardScore = cardScore << (card.Score - 1)
		score += cardScore
	}
	return score
}

type CardStackEntry struct {
	Card   *Card
	Number int
}

func bSolution(cards []*Card) int {
	cardStack := []*CardStackEntry{}
	for _, card := range cards {
		cardStack = append(cardStack, &CardStackEntry{Card: card, Number: 1})
	}
	for i, card := range cardStack {
		for j := 1; j <= card.Card.Score; j++ {
			cardStack[i+j].Number += card.Number
		}
	}
	sum := 0
	for _, card := range cardStack {
		sum += card.Number
	}
	return sum
}

func readCard(line string) (*Card, error) {
	cardPart := strings.Split(line, ": ")
	if len(cardPart) != 2 {
		return nil, fmt.Errorf("Invalid line")
	}
	card := &Card{
		WinningNums: make(map[int]struct{}),
		Numbers:     make(map[int]struct{}),
	}
	cardNoPart := strings.Split(cardPart[0], " ")
	no := cardNoPart[len(cardNoPart)-1]
	num, err := strconv.Atoi(strings.Trim(no, " "))
	if err != nil {
		return nil, fmt.Errorf("Failed to parse card number")
	}
	card.CardNo = num
	values := strings.Split(cardPart[1], " | ")
	if len(values) != 2 {
		return nil, fmt.Errorf("Invalid line")
	}
	for _, val := range strings.Split(values[0], " ") {
		if val == "" {
			continue
		}
		num, err := strconv.Atoi(strings.Trim(val, " "))
		if err != nil {
			return nil, fmt.Errorf("Failed to parse winning number")
		}
		card.WinningNums[num] = struct{}{}
	}
	for _, val := range strings.Split(values[1], " ") {
		if val == "" {
			continue
		}
		num, err := strconv.Atoi(strings.Trim(val, " "))
		if err != nil {
			return nil, fmt.Errorf("Failed to parse number")
		}
		if _, ok := card.WinningNums[num]; ok {
			card.Score += 1
		}
		card.Numbers[num] = struct{}{}
	}
	return card, nil
}
