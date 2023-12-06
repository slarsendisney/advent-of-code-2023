import { gatherAllInputStringFromDir } from "../utils/gatherAllInputs";

const TEST_RESULTS = {
    "PART_ONE": 1,
    "PART_TWO": 2
}


function calc(lines: string[]) {
    return 1
}

export default () => {
    describe("😀 Day 5: If You Give A Seed A Fertilizer", () => {
        const {
            "part-one/test-input": testInput,
            "part-one/main-input": mainInput,
        } = gatherAllInputStringFromDir("./5/inputs");

        describe("Part One", () => {

            it(`test input should return ${TEST_RESULTS.PART_ONE}`, () => {
                expect(0).toBe(TEST_RESULTS.PART_ONE);
            });

            const result = calc(mainInput.lines);

            it.skip(`main input result: ${result}`, () => {

                expect(result).toBe(result);
            });

        });

        // describe("Part Two", () => {

        //     it(`test input should return ${TEST_RESULTS.PART_TWO}`, () => {
        //         expect(0).toBe(TEST_RESULTS.PART_TWO);
        //     });

        //     const result = calc(mainInput.lines);

        //     it(`main input result: ${result}`, () => {

        //         expect(result).toBe(result);
        //     });
        // });
    });
}