import { expect, test, describe } from "bun:test";
import { readFileSync } from "fs";

function multiplyNumbers(numbers: number[]) {
  return numbers.reduce((acc, cur) => acc * cur);
}

function splitGamesIntoSubsets(gameLine: string) {
  const games = gameLine.split(";");

  return games;
}

function gamePossible(
  game: string,
  maxRed: number,
  maxGreen: number,
  maxBlue: number
) {
  const diceColorsAndMax = [
    {
      diceLabel: "red",
      max: maxRed,
    },
    {
      diceLabel: "green",
      max: maxGreen,
    },
    {
      diceLabel: "blue",
      max: maxBlue,
    },
  ];

  const diceCounts = game
    .split(",")
    .map((line) => line.replace(new RegExp(" ", "g"), ""));

  for (const count of diceCounts) {
    for (const diceMaxAndColor of diceColorsAndMax) {
      if (count.includes(diceMaxAndColor.diceLabel)) {
        const diceCount = parseInt(
          count.replace(diceMaxAndColor.diceLabel, "")
        );
        if (diceCount > diceMaxAndColor.max) {
          return false;
        }
      }
    }
  }

  return true;
}

function minRequiredCubes(game: string) {
  const diceColorsAndMins = {
    "red": 0,
    "green": 0,
    "blue": 0,
  }


  const diceCounts = game
    .split(",")
    .map((line) => line.replace(new RegExp(" ", "g"), ""));

  for (const count of diceCounts) {
    for (const [diceLabel, min] of Object.entries(diceColorsAndMins)) {
      if (count.includes(diceLabel)) {
        const diceCount = parseInt(
          count.replace(diceLabel, "")
        );
        if (diceCount > min) {
          diceColorsAndMins[diceLabel] = diceCount;
        }
      }
    }
  }

  return diceColorsAndMins;

}




function possibleGamesGivenMax(input: string[]) {
  let sum = 0;

  for (const line of input) {
    const [gameLabel, gameLine] = line.split(":");

    const gameNumber = parseInt(gameLabel.replace("Game ", ""));

    const games = splitGamesIntoSubsets(gameLine);
    const gameResults = games.map((game) => gamePossible(game, 12, 13, 14));

    if (gameResults.every((result) => result)) {
      sum += gameNumber;
    }
  }

  return sum;
}

function fewestCubes(input: string[]) {

  let sum = 0;

  for (const line of input) {
    const [_, gameLine] = line.split(":");

    const games = splitGamesIntoSubsets(gameLine);
    const gameResults = games.map((game) => minRequiredCubes(game));

    const [reds, greens, blues] = gameResults.reduce((acc, cur) => {

      cur.red && acc[0].push(cur.red);
      cur.green && acc[1].push(cur.green);
      cur.blue && acc[2].push(cur.blue);
      return acc;
    }, [[], [], []]);

    const minRed = Math.max(...reds);
    const minGreen = Math.max(...greens);
    const minBlue = Math.max(...blues);

    sum += multiplyNumbers([minRed, minGreen, minBlue]);

  }

  return sum;

}

export default () => {

  describe("😁 Day 2: Cube Conundrum", () => {

    const testInput = readFileSync(
      "./2/inputs/part-one/test-input.txt",
      "utf8"
    ).split("\n");

    describe("Part One", () => {

      test("test input should return 8", () => {
        expect(possibleGamesGivenMax(testInput)).toBe(8);
      });

      const mainInput = readFileSync('./2/inputs/part-one/main-input.txt', 'utf8').split('\n');

      const result = possibleGamesGivenMax(mainInput);

      test(`main input result: ${result}`, () => {
        expect(result).toBe(result);
      });

    });

    describe("Part Two", () => {

      test("test input should return 2286", () => {

        expect(fewestCubes(testInput)).toBe(2286);
      });

      const mainInput = readFileSync('./2/inputs/part-two/main-input.txt', 'utf8').split('\n');

      const result = fewestCubes(mainInput);

      test(`main input result: ${result}`, () => {
        expect(result).toBe(result);
      });


    });



  });

}