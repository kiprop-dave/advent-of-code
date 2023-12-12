package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Record struct {
	Grouping       []string
	Representation []int
}

func main() {
	f, err := os.Open("input.txt")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	records := []*Record{}
	for scanner.Scan() {
		line := scanner.Text()
		record, err := parseLine(line)
		if err != nil {
			panic(err)
		}
		records = append(records, record)
	}
	partOneResult := partOne(records)
	fmt.Println(partOneResult)
}

func partOne(records []*Record) int {
	sum := 0
	for _, record := range records {
		sum += getCombinations(record)
	}
	return sum
}

func parseLine(line string) (*Record, error) {
	splitLine := strings.Split(line, " ")
	if len(splitLine) != 2 {
		return nil, fmt.Errorf("invalid line")
	}
	grouping := strings.Split(splitLine[0], "")
	representation := []int{}
	for _, char := range strings.Split(splitLine[1], ",") {
		number, err := strconv.Atoi(char)
		if err != nil {
			return nil, err
		}
		representation = append(representation, number)
	}
	return &Record{
		Grouping:       grouping,
		Representation: representation,
	}, nil
}

func getCombinations(record *Record) int {
	totalHashes := 0
	for _, numHashes := range record.Representation {
		totalHashes += numHashes
	}
	hashesInGrouping := 0
	slotsInGrouping := 0
	indexMap := make(map[int]int)
	for i, char := range record.Grouping {
		if char == "#" {
			hashesInGrouping++
		} else if char == "?" {
			indexMap[slotsInGrouping] = i
			slotsInGrouping++
		}
	}
	combinations := generateCombinations(slotsInGrouping, (totalHashes - hashesInGrouping))
	validConfigs := 0
	for _, combination := range combinations {
		if checkValidArrangement(record, combination, indexMap) {
			validConfigs++
		}
	}
	return validConfigs
}

func checkValidArrangement(record *Record, combination []string, indexMap map[int]int) bool {
	groupingClone := make([]string, len(record.Grouping))
	copy(groupingClone, record.Grouping)
	for i, char := range combination {
		index := indexMap[i]
		groupingClone[index] = char
	}
	groups := []int{}
	for i := 0; i < len(groupingClone); i++ {
		if groupingClone[i] == "#" {
			count := 1
			j := i + 1
			for j < len(groupingClone) && groupingClone[j] == "#" {
				count++
				j++
			}
			groups = append(groups, count)
			i = j
		}
	}
	isSame := true
	for i, j := 0, 0; i < len(record.Representation) && j < len(groups); i, j = i+1, j+1 {
		if record.Representation[i] != groups[j] {
			isSame = false
		}
	}
	return isSame
}

func generateCombinations(size, numHashes int) [][]string {
	result := [][]string{}
	backtrack(size, numHashes, 0, make([]string, size), &result)
	return result
}

func backtrack(size, remainingHashes, currentIndex int, currentCombination []string, result *[][]string) {
	if remainingHashes == 0 && currentIndex == size {
		*result = append(*result, append([]string(nil), currentCombination...))
		return
	}

	if remainingHashes < 0 || currentIndex >= size {
		return
	}

	// Try placing '.'
	currentCombination[currentIndex] = "."
	backtrack(size, remainingHashes, currentIndex+1, currentCombination, result)

	// Try placing '#'
	currentCombination[currentIndex] = "#"
	backtrack(size, remainingHashes-1, currentIndex+1, currentCombination, result)

	// Backtrack by resetting the value to '.'
	currentCombination[currentIndex] = "."
}
