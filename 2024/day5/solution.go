package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
)

type GraphNode struct {
	children []*GraphNode
	value    int
}

type Graph struct {
	nodes map[int]*GraphNode
}

type Input struct {
	graph   *Graph
	updates [][]int
}

func addNode(g *Graph, s int, e int) {
	if _, ok := g.nodes[s]; !ok {
		node := &GraphNode{value: s, children: make([]*GraphNode, 0)}
		g.nodes[s] = node
	}
	if _, ok := g.nodes[e]; !ok {
		node := &GraphNode{value: e, children: make([]*GraphNode, 0)}
		g.nodes[e] = node
	}
	g.nodes[s].children = append(g.nodes[s].children, g.nodes[e])
}

func parseInput(r *io.Reader) (data *Input, err error) {
	data = &Input{
		graph:   &Graph{nodes: make(map[int]*GraphNode)},
		updates: make([][]int, 0),
	}
	err = nil
	isFirstSection := true
	scanner := bufio.NewScanner(*r)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			isFirstSection = false
			continue
		}

		if isFirstSection {
			s := strings.Split(line, "|")
			if len(s) != 2 {
				err = fmt.Errorf("invalid input: %s", line)
				return
			}
			var start, end int
			start, err = strconv.Atoi(s[0])
			if err != nil {
				return
			}
			end, err = strconv.Atoi(s[1])
			if err != nil {
				return
			}

			addNode(data.graph, start, end)
		} else {
			s := strings.Split(line, ",")
			updates := make([]int, 0)
			for _, v := range s {
				var i int
				i, err = strconv.Atoi(v)
				if err != nil {
					err = fmt.Errorf("invalid input: %s", line)
					return
				}
				updates = append(updates, i)
			}
			data.updates = append(data.updates, updates)
		}
	}

	return
}

func walkGraph(g *Graph) {
	for _, v := range g.nodes {
		for _, c := range v.children {
			fmt.Printf("%d->%d\n", v.value, c.value)
		}
	}
}

func partA(data *Input) (int, [][]int) {
	s := 0
	invalid := make([][]int, 0)
	for _, v := range data.updates {
		isValid := true
		set := make(map[int]bool)
		for i := len(v) - 1; i >= 0; i-- {
			n := v[i]
			if _, ok := set[n]; ok {
				isValid = false
				invalid = append(invalid, v)
				break
			}
			if _, ok := data.graph.nodes[n]; ok {
				for _, c := range data.graph.nodes[n].children {
					set[c.value] = true
				}
			}
		}
		if isValid {
			center := v[len(v)/2]
			s += center
		}
	}
	return s, invalid
}

func includes(s []*GraphNode, e int) bool {
	for _, v := range s {
		if v.value == e {
			return true
		}
	}
	return false
}

func sortInvalid(g *Graph, invalid []int) []int {
	sort.SliceStable(invalid, func(i, j int) bool {
		first := g.nodes[invalid[i]]
		second := g.nodes[invalid[j]]
		return includes(g.nodes[second.value].children, first.value)
	})
	return invalid
}

func partB(g *Graph, invalid [][]int) int {
	s := 0
	for _, r := range invalid {
		sorted := sortInvalid(g, r)
		center := sorted[len(sorted)/2]
		s += center
	}
	return s
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
		res, err := http.NewRequest("GET", "https://adventofcode.com/2024/day/5/input", nil)
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

	data, err := parseInput(&r)
	if err != nil {
		log.Fatalln(err)
	}
	a, invalid := partA(data)
	fmt.Printf("Part A: %d\nPart B: %d\n", a, partB(data.graph, invalid))
}
