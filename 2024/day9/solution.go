package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type Loc struct {
	id    *int
	value int
}

func padString(sb *strings.Builder, n int, c string) {
	for i := 0; i < n; i++ {
		_, err := sb.WriteString(c)
		if err != nil {
			panic(err)
		}
	}
}

func parseInput(line string) (space []Loc, err error) {
	space = make([]Loc, 0)
	id := 0

	for i := 0; i < len(line); i++ {
		n, err := strconv.Atoi(string(line[i]))
		if err != nil {
			return space, nil
		}
		if i%2 == 0 {
			for j := 0; j < n; j++ {
				fileId := id
				space = append(space, Loc{id: &fileId, value: n})
			}
			id++
		} else {
			for j := 0; j < n; j++ {
				space = append(space, Loc{id: nil, value: n})
			}
		}
	}

	return space, nil
}

func partOne(space []Loc) int {
	l, r := 0, len(space)-1

	for l < r {
		left := space[l]
		right := space[r]
		if left.id == nil && right.id != nil {
			temp := left
			space[l] = right
			space[r] = temp
			l++
			r--
		} else if right.id == nil {
			r--
		} else if left.id != nil {
			l++
		}
	}
	sum := 0

	for i, v := range space {
		if v.id != nil {
			sum += i * *v.id
		}
	}

	return sum
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
		res, err := http.NewRequest("GET", "https://adventofcode.com/2024/day/9/input", nil)
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
	var line string

	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		line = scanner.Text()
	}

	data, err := parseInput(line)
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println(partOne(data))
}
