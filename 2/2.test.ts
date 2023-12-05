import { readFileSync } from "fs";

/*
The Elf says they've stopped producing snow because they aren't getting any water! He isn't sure why the water stopped; however, he can show you how to get to the water source to check it out for yourself. It's just up ahead!

As you continue your walk, the Elf poses a second question: in each game you played, what is the fewest number of cubes of each color that could have been in the bag to make the game possible?

In game 1, the game could have been played with as few as 4 red, 2 green, and 6 blue cubes. If any color had even one fewer cube, the game would have been impossible.
Game 2 could have been played with a minimum of 1 red, 3 green, and 4 blue cubes.
Game 3 must have been played with at least 20 red, 13 green, and 6 blue cubes.
Game 4 required at least 14 red, 3 green, and 15 blue cubes.
Game 5 needed no fewer than 6 red, 3 green, and 2 blue cubes in the bag.
The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together. The power of the minimum set of cubes in game 1 is 48. In games 2-5 it was 12, 1560, 630, and 36, respectively. Adding up these five powers produces the sum 2286.

For each game, find the minimum set of cubes that must have been present. What is the sum of the power of these sets?

*/

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

describe("Day 2: Cube Conundrum", () => {

  const testInput = readFileSync(
    "./2/inputs/part-one/test-input.txt",
    "utf8"
  ).split("\n");

  describe("Part One", () => {

    it("test input should return 8", () => {
      expect(possibleGamesGivenMax(testInput)).toBe(8);
    });

    const mainInput = readFileSync('./2/inputs/part-one/main-input.txt', 'utf8').split('\n');

    const result = possibleGamesGivenMax(mainInput);

    it(`main input result: ${result}`, () => {
      expect(result).toBe(result);
    });

  });

  describe("Part Two", () => {

    it("test input should return 2286", () => {

      expect(fewestCubes(testInput)).toBe(2286);
    });

    const mainInput = readFileSync('./2/inputs/part-two/main-input.txt', 'utf8').split('\n');

    const result = fewestCubes(mainInput);

    it(`main input result: ${result}`, () => {
      expect(result).toBe(result);
    });


  });



});
