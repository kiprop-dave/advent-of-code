package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type Module struct {
	Name       string
	ModuleType string
	Inputs     map[string]int
	Outputs    []string
	State      int
}

type InputData struct {
	Modules   map[string]*Module
	Broadcast []string
}

func main() {
	args := os.Args
	if len(args) != 2 {
		fmt.Printf("Usage: %s <input>\n", args[0])
		return
	}
	inputData, err := parseInput(args[1])
	if err != nil {
		panic(err)
	}
	partOneResult := partOne(inputData)
	fmt.Println(partOneResult)
}

func partOne(inputData *InputData) int {
	times := 1000
	low, high := simulateButtonPress(inputData, times)
	fmt.Printf("After %d button presses, there were %d low and %d high pulses\n", times, low, high)
	return low * high
}

func parseInput(path string) (*InputData, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	inputData := &InputData{}
	modules := make(map[string]*Module)
	for sc.Scan() {
		line := sc.Text()
		broadcast, module, err := parseLine(line)
		if err != nil {
			return nil, err
		} else if broadcast != nil {
			inputData.Broadcast = broadcast
		} else {
			for _, output := range module.Outputs {
				if _, ok := modules[output]; !ok {
					modules[output] = &Module{
						Inputs:     map[string]int{module.Name: 0},
						Name:       output,
						Outputs:    []string{},
						ModuleType: "",
					}
				} else {
					modules[output].Inputs[module.Name] = 0
				}
			}
			if _, ok := modules[module.Name]; !ok {
				modules[module.Name] = module
			} else {
				modules[module.Name].Outputs = append(modules[module.Name].Outputs, module.Outputs...)
				modules[module.Name].ModuleType = module.ModuleType
			}
		}
	}
	inputData.Modules = modules
	return inputData, nil
}

func parseLine(line string) ([]string, *Module, error) {
	parts := strings.Split(line, " -> ")
	if len(parts) != 2 {
		return nil, nil, fmt.Errorf("invalid line: %s", line)
	}
	outputs := strings.Split(parts[1], ", ")
	if parts[0] == "broadcaster" {
		return outputs, nil, nil
	}
	moduleType, name := "", ""
	if string(parts[0][0]) == "%" {
		moduleType = "flip-flop"
		name = strings.TrimPrefix(parts[0], "%")
	} else if string(parts[0][0]) == "&" {
		moduleType = "conjunction"
		name = strings.TrimPrefix(parts[0], "&")
	}

	return nil, &Module{
		ModuleType: moduleType,
		Inputs:     map[string]int{},
		Outputs:    outputs,
		Name:       name,
	}, nil
}

func simulateButtonPress(inputData *InputData, buttonPresses int) (int, int) {
	totalLowPulses := 0
	totalHighPulses := 0

	for press := 0; press < buttonPresses; press++ {
		totalLowPulses++
		processQueue := []struct {
			module *Module
			signal string
			from   string
		}{}
		for _, moduleName := range inputData.Broadcast {
			totalLowPulses++
			//fmt.Println("broadcast - low -> ", moduleName)
			processQueue = append(processQueue, struct {
				module *Module
				signal string
				from   string
			}{
				module: inputData.Modules[moduleName],
				signal: "low",
				from:   "broadcast",
			})
		}

		for len(processQueue) > 0 {
			next := processQueue[0]
			processQueue = processQueue[1:]
			output := processModule(inputData.Modules, next.module.Name, next.from, next.signal)
			if output == "" {
				continue
			}
			for _, currentOutput := range next.module.Outputs {
				//fmt.Println(next.module.Name, " - ", output, " -> ", currentOutput)
				if output == "low" {
					totalLowPulses++
				} else if output == "high" {
					totalHighPulses++
				}
				processQueue = append(processQueue, struct {
					module *Module
					signal string
					from   string
				}{
					module: inputData.Modules[currentOutput],
					signal: output,
					from:   next.module.Name,
				})
			}
		}
	}

	return totalLowPulses, totalHighPulses
}

func processModule(modules map[string]*Module, name, from, signal string) string {
	module, ok := modules[name]
	if !ok {
		fmt.Println("no module")
		return ""
	}
	if module.ModuleType == "flip-flop" {
		if signal == "low" {
			if module.State == 0 {
				module.State = 1
				return "high"
			} else if module.State == 1 {
				module.State = 0
				return "low"
			}
		} else {
			return ""
		}
	} else if module.ModuleType == "conjunction" {
		if signal == "low" {
			module.Inputs[from] = 0
		} else {
			module.Inputs[from] = 1
		}
		allHigh := true
		for _, value := range module.Inputs {
			if value == 0 {
				allHigh = false
				break
			}
		}
		if allHigh {
			return "low"
		}
		return "high"
	}
	return ""
}
