import { expect, test, describe } from "bun:test";
import { gatherAllInputStringFromDir } from "../utils/gatherAllInputs";

const TEST_RESULTS = {
    "PART_ONE": 13,
    "PART_TWO": 30
}

function calculateGameScore(line: string) {
    const [name, game] = line.split(":");
    const [winnerNumbers, gameNumbers] = game.split("|").map((x) => x.trim().split(" ").filter(y => y).map((y) => parseInt(y)));

    const winningNumberSet = new Set(winnerNumbers);
    const matchingNumbers = gameNumbers.filter((x) => winningNumberSet.has(x));

    if (matchingNumbers.length === 0) return {
        score: 0,
        matches: 0
    }

    return { score: Math.pow(2, matchingNumbers.length - 1), matches: matchingNumbers.length };
}

function calculateGameScores(lines: string[]) {
    let score = 0;

    for (const line of lines) {
        score += calculateGameScore(line).score;
    }

    return score;

}

function calculateCopyingGameCards(lines: string[]) {
    let cardCount = 0;
    const linesWithCopies: [string, number][] = lines.map((line) => [line, 1])

    while (linesWithCopies.length > 0) {
        const [line, copies] = linesWithCopies.shift();
        cardCount += copies;
        const { matches } = calculateGameScore(line);

        for (let i = 0; i < matches; i++) {
            linesWithCopies[i][1] += 1 * copies;
        }

    }

    return cardCount;

}

export default () => {
    describe("😃 Day 4: Scratchcards", () => {
        const {
            "part-one/test-input": testInput,
            "part-one/main-input": mainInput,
        } = gatherAllInputStringFromDir("./4/inputs");

        describe("Part One", () => {

            test(`test input should return ${TEST_RESULTS.PART_ONE}`, () => {
                expect(
                    calculateGameScores(testInput.lines)
                ).toBe(TEST_RESULTS.PART_ONE);
            });

            const result = calculateGameScores(mainInput.lines)

            test(`main input result: ${result}`, () => {

                expect(result).toBe(result);
            });

        });

        describe("Part Two", () => {

            test(`test input should return ${TEST_RESULTS.PART_TWO}`, () => {
                expect(calculateCopyingGameCards(testInput.lines)).toBe(TEST_RESULTS.PART_TWO);
            });

            const result = calculateCopyingGameCards(mainInput.lines)

            test(`main input result: ${result}`, () => {

                expect(result).toBe(result);
            });

        });
    });
}