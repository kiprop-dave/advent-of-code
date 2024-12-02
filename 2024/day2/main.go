package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func parseInput(r *io.Reader) (out [][]int, err error) {
	out = [][]int{}
	s := bufio.NewScanner(*r)

	for s.Scan() {
		var row []int
		line := strings.Split(s.Text(), " ")
		for _, v := range line {
			i, err := strconv.Atoi(v)
			if err != nil {
				return out, err
			}
			row = append(row, i)
		}
		out = append(out, row)
	}

	return
}

func checkRowDirect(row []int) bool {
	diffs := []int{}
	for i := 0; i < len(row)-1; i++ {
		diff := float64(row[i] - row[i+1])
		if math.Abs(diff) == 0 || math.Abs(diff) > 3 {
			return false
		}

		diffs = append(diffs, int(diff))
	}

	for i := 0; i < len(diffs)-1; i++ {
		if (diffs[i] > 0 && diffs[i+1] < 0) || (diffs[i] < 0 && diffs[i+1] > 0) {
			return false
		}
	}

	return true
}

func checkRowForce(row []int) bool {
	for i := range row {
		r := []int{}
		r = append(r, row[:i]...)
		r = append(r, row[i+1:]...)
		if checkRowDirect(r) {
			return true
		}
	}

	return false
}

func partA(input [][]int) int {
	safe := 0

	for _, row := range input {
		if checkRowDirect(row) {
			safe++
		}
	}
	return safe
}

func partB(input [][]int) int {
	safe := 0
	for _, row := range input {
		if checkRowForce(row) {
			safe++
		}
	}
	return safe
}

func main() {
	example := flag.Bool("isExample", false, "Is this an example")
	flag.Parse()
	var r io.Reader
	if *example {
		// use example.txt
		f, err := os.Open("example.txt")
		if err != nil {
			log.Fatalln("failed to open example.txt")
		}
		defer f.Close()
		r = f
	} else {
		// Fetch input
		cookie := os.Args[1]
		if len(cookie) == 0 {
			log.Fatalln("No cookie provided")
		}
		res, err := http.NewRequest("GET", "https://adventofcode.com/2024/day/2/input", nil)
		if err != nil {
			log.Fatalln(err)
		}
		res.Header.Add("Cookie", "session="+cookie)
		resp, err := http.DefaultClient.Do(res)
		if err != nil {
			log.Fatalln(err)
		}
		defer resp.Body.Close()
		r = resp.Body
	}

	input, err := parseInput(&r)
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Printf("Part A: %d\nPart B: %d\n", partA(input), partB(input))
}
