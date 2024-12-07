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

type Node struct {
	add      *Node
	multiply *Node
	value    int
}

type Row struct {
	expression *Node
	target     int
}

type Data = []Row

func buildExpression(nums []int) (expression *Node) {
	if len(nums) == 0 {
		return nil
	}
	expression = &Node{value: nums[0]}
	level := []*Node{
		expression,
	}
	for i := 1; i < len(nums); i++ {
		v := nums[i]

		l := len(level)

		for j := 0; j < l; j++ {
			n := level[j]

			a := &Node{
				value: v,
			}

			m := &Node{
				value: v,
			}

			n.add = a
			n.multiply = m

			level = append(level, a, m)
		}

		level = level[l:]
	}

	return
}

func parseInput(r io.Reader) (d Data, err error) {
	d = []Row{}
	scanner := bufio.NewScanner(r)

	for scanner.Scan() {
		row := Row{}
		t := scanner.Text()
		parts := strings.Split(t, ": ")
		if len(parts) != 2 {
			err = fmt.Errorf("invalid row: %s", t)
			return
		}
		var target int
		var nums []int
		target, err = strconv.Atoi(parts[0])
		if err != nil {
			return
		}
		row.target = target
		for _, v := range strings.Split(parts[1], " ") {
			var value int
			value, err = strconv.Atoi(v)
			if err != nil {
				return
			}
			nums = append(nums, value)
		}
		exp := buildExpression(nums)
		row.expression = exp

		d = append(d, row)
	}

	return d, nil
}

func walkTest(node *Node) []int {
	nums := []int{}
	queue := []*Node{
		node,
	}

	for len(queue) != 0 {
		f := queue[0]
		queue = queue[1:]
		nums = append(nums, f.value)
		if f.add != nil {
			queue = append(queue, f.add)
		}
		if f.multiply != nil {
			queue = append(queue, f.multiply)
		}
	}

	return nums
}

func checkValidExpression(expression *Node, target int, sum int, mode string) bool {
	if expression == nil || sum > target {
		return false
	}

	if mode == "add" {
		sum += expression.value
	} else {
		sum *= expression.value
	}

	if sum == target {
		return true
	}
	valid := false

	if expression.add != nil {
		valid = checkValidExpression(expression.add, target, sum, "add")
	}

	if valid {
		return valid
	}

	if expression.multiply != nil {
		valid = checkValidExpression(expression.multiply, target, sum, "multiply")
	}

	return valid
}

func partOne(data Data) int {
	total := 0
	for _, row := range data {
		valid := checkValidExpression(row.expression, row.target, 0, "add")
		if valid {
			total += row.target
		}
	}

	return total
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
		res, err := http.NewRequest("GET", "https://adventofcode.com/2024/day/7/input", nil)
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

	data, err := parseInput(r)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Part 1: %d\n", partOne(data))
}
