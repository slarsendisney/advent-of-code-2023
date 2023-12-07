import { gatherAllInputStringFromDir } from "../utils/gatherAllInputs";

const TEST_RESULTS = {
    "PART_ONE": 35,
    "PART_TWO": 46
}


function inputToStartAndMaps(lines: string[], expandSeeds?: boolean):[number[], [number, number, number][][]] {
    const [startLine, ...mapLines] = lines;

    let startNumbers: number[] = startLine.split(":")[1].trim().split(" ").map((x) => parseInt(x));

    if (expandSeeds) {
        let newStartNumbers: number[] = [];
        let startPairs: [number, number][] = [];
        // chunk startNumbers into pairs
        for (let i = 0; i < startNumbers.length; i += 2) {
            startPairs.push([startNumbers[i], startNumbers[i + 1]])
        }


        startPairs.forEach(([start, range]) => {
            for (let i = 0; i < range; i++) {
                newStartNumbers.push(start + i)
            }
        })

        startNumbers = newStartNumbers;

    }

    const mapsArray: [number, number, number][][] = []
    let currentMap = []
    mapLines.forEach((line) => {
        // if line starts with a digit
        if (line.length > 0 && line.match(/^\d/)) {
            const mapVals = line.split(" ").map((x) => parseInt(x));
            currentMap.push(mapVals);
        } else {
            if (currentMap.length > 0) {
                mapsArray.push(currentMap);
                currentMap = [];
            }
        }
    })
    if (currentMap.length > 0) {
        mapsArray.push(currentMap);
        currentMap = [];
    }

    return [startNumbers, mapsArray];

}

function calcPathThroughMap(map: [number, number, number][], start: number):number {
    let result;

    map.forEach((route) => {
        if (result) return;
        const inputStart = route[1]
        const inputEnd = route[1] + route[2];

        if (start >= inputStart && start <= inputEnd) {
            const dest = route[0] + (start - inputStart);
            result = dest;
            return dest
        }

    })

    return result || start;
}

function calcMinPathThroughMap(maps: [number, number, number][][], startNumbers: number[]):number {
    let minEndNumber:number = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < startNumbers.length; i++) {
       
        const start = startNumbers[i];
        let currentNumber = start;
        maps.map((map) => {
            currentNumber = calcPathThroughMap(map, currentNumber);
        })
        if (currentNumber < minEndNumber) {
            minEndNumber = currentNumber;
        }
    }
    // console.log("\x1b[33m",minEndNumber)
    return minEndNumber
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

function findLowestLocationNumber(lines: string[], expandSeeds?: boolean) {
    const [startNumbers, maps] = inputToStartAndMaps(lines, expandSeeds);
   
    let startNumberBatch = chunkArray(startNumbers, 2);

    let minEndNumber = Number.MAX_SAFE_INTEGER;

    console.log(`startNumberCount: ${startNumbers.length}`)

    startNumberBatch.forEach((batch, i) => {
        // console.log("\x1b[31m", `batch ${i}`)
        const result = calcMinPathThroughMap(maps, batch);
        // console log in red
        // console.log(result, minEndNumber)
        
        if (result < minEndNumber) {
            console.log("\x1b[35m", `${result} is less than ${minEndNumber}: updating`)
            minEndNumber = result;
        }

    })
    
    
    return minEndNumber

}

export default () => {
    describe("😀 Day 5: If You Give A Seed A Fertilizer", () => {
        const {
            "part-one/test-input": testInput,
            "part-one/main-input": mainInput,
        } = gatherAllInputStringFromDir("./5/inputs");

        describe.skip("Part One", () => {

            it(`test input should return ${TEST_RESULTS.PART_ONE}`, () => {

                expect(findLowestLocationNumber(testInput.lines)).toBe(TEST_RESULTS.PART_ONE);
            });

            const result = findLowestLocationNumber(mainInput.lines);

            it(`main input result: ${result}`, () => {

                expect(result).toBe(result);
            });

        });

        describe("Part Two", () => {

            it(`test input should return ${TEST_RESULTS.PART_TWO}`, () => {

                expect(findLowestLocationNumber(testInput.lines, true)).toBe(TEST_RESULTS.PART_TWO);
            });

            const result = findLowestLocationNumber(mainInput.lines, true);

            it.skip(`main input result: ${result}`, () => {
                expect(result).toBeLessThan(107430936);
                expect(result).toBe(result);
            });
        });
    });
}