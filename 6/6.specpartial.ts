import { gatherAllInputStringFromDir } from "../utils/gatherAllInputs";

const TEST_RESULTS = {
    "PART_ONE": 288,
    "PART_TWO": 71503
}

const parseInputToRacesFormat = (inputs: string[]) => {
    const [times, currentRecords] = inputs.map((line) => line.split(":")[1].trim().split(" ").filter((result) => result).map((digits) => parseInt(digits))
    )

    const races = times.map((time, index) => (
        {
            time,
            currentRecord: currentRecords[index]
        }
    ))

    return races
}

const parseInputToRaceFormat = (inputs: string[]) => {

    return inputs.map((line) => parseInt(line.split(":")[1].trim().split(" ").filter((result) => result).join("")))

}

const calculateDistanceCovered = (time: number, speed: number) => {
    return time * speed
}

const calculateNumberOfWaysToBeatRecord = (time: number, currentRecord: number) => {
    let count = 0;
    for (let i = 0; i <= time; ++i) {
        const distance = calculateDistanceCovered(i, time - i)
        if (distance > currentRecord) {
            count++
        }
    }

    return count


}

const calculateNumberOfWays = (inputs: string[]) => {
    const races = parseInputToRacesFormat(inputs)
    let count = 0;
    
    races.forEach((race, i) => {
        const result = calculateNumberOfWaysToBeatRecord(race.time, race.currentRecord)
       
        if (result !== 0) {
            if(count === 0){
                count = result
            } else {
                count = count * result
            }
        }
    })
    return count
}

const calculateNumberOfWaysWithKerning = (inputs: string[]) => {
    const race = parseInputToRaceFormat(inputs)
    const result = calculateNumberOfWaysToBeatRecord(race[0], race[1])

    return result
}

export default () => {
    describe("🥹 Day 6: Wait For It", () => {
        const {
            "part-one/test-input": testInput,
            "part-one/main-input": mainInput,
        } = gatherAllInputStringFromDir("./6/inputs");

        describe("Part One", () => {

            it(`test input should return ${TEST_RESULTS.PART_ONE}`, () => {
                expect(calculateNumberOfWays(testInput.lines)).toBe(TEST_RESULTS.PART_ONE);
            });


            const result = calculateNumberOfWays(mainInput.lines);

            it(`main input result: ${result}`, () => {

                expect(result).toBe(result);
            });

        });

        describe("Part Two", () => {

            it(`test input should return ${TEST_RESULTS.PART_TWO}`, () => {

                expect(calculateNumberOfWaysWithKerning(testInput.lines)).toBe(TEST_RESULTS.PART_TWO);
            });

            const result = calculateNumberOfWaysWithKerning(mainInput.lines);

            it(`main input result: ${result}`, () => {

                expect(result).toBe(result);
            });

        });
    });
}