import { readFileSync } from "fs";
/*

--- Day 3: Gear Ratios ---
You and the Elf eventually reach a gondola lift station; he says the gondola lift 
will take you up to the water source, but this is as far as he can bring you. You 
go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're 
not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. 
"Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll 
still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but 
nobody can figure out which one. If you can add up all the part numbers in the engine 
schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the 
engine. There are lots of numbers and symbols you don't really understand, but apparently 
any number adjacent to a symbol, even diagonally, is a "part number" and should be 
included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, two numbers are not part numbers because they are not adjacent to a 
symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol 
and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part 
numbers in the engine schematic?

*/

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function isEmpty(char: string) {
  if (char === ".") {
    return true;
  }

  return false;
}

function isSymbol(char: string) {
  if (isEmpty(char)) {
    return false;
  }
  if (digits.includes(char)) {
    return false;
  }

  return true;
}

function isDigit(char: string) {
  if (isEmpty(char) || isSymbol(char)) {
    return false;
  }

  return true;
}

function inputToMatrix(lines: string[]) {
  return lines.map((line) => line.split(""));
}

function adjacentToSymbol(matrix: string[][], coords: [number, number][]) {
  const allAdjacentsSquare = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [y, x] of coords) {
    for (const [a, b] of allAdjacentsSquare) {
      try {
        const value = matrix[y + a][x + b];
        if (isSymbol(value)) {
          return true;
        }
      } catch (e) {
        // probably out of bounds
      }
    }
  }

  return false;
}

function sumPartNumbers(lines: string[]) {
  let count = 0;

  const matrix = inputToMatrix(lines);

  const numberLocations: { digits: string; coords: [number, number][] }[] = [];

  matrix.forEach((line, y) => {
    let digitCoordsInLine: [number, number][] = [];
    let digitString = "";
    line.forEach((value, x) => {
      if (isDigit(value)) {
        digitCoordsInLine.push([y, x]);
        digitString += value;
      } else {
        if (digitCoordsInLine.length > 0) {
          numberLocations.push({
            digits: digitString,
            coords: digitCoordsInLine,
          });
        }
        digitCoordsInLine = [];
        digitString = "";
      }
    });
  });

  numberLocations.map(({ digits, coords }) => {
    if (adjacentToSymbol(matrix, coords)) {
      count += parseInt(digits);
    }
  });

  return count;
}

describe("Day 3: Gear Ratios", () => {
  const testInput = readFileSync(
    "./3/inputs/part-one/test-input.txt",
    "utf8"
  ).split("\n");

  it("test input should return 4361", () => {
    expect(sumPartNumbers(testInput)).toBe(4361);
  });

  const mainInput = readFileSync('./3/inputs/part-one/main-input.txt', 'utf8').split('\n');

  const result = sumPartNumbers(mainInput);

  it(`main input result: ${result}`, () => {
    expect(result).toBe(result);
  });
});
