import { readFileSync } from "fs";
import { gatherAllInputStringFromDir } from "../utils/gatherAllInputs";

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const symbolSet = new Set()
const digitSet = new Set()
const symbolCoordSet = new Set()
const activeNumberSet = new Set()
const inactiveNumberSet = new Set()

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
  symbolSet.add(char)
  return true;
}

function isDigit(char: string) {
  if (isEmpty(char) || isSymbol(char)) {
    return false;
  }

  digitSet.add(char)

  return true;
}

function inputToMatrix(lines: string[]) {
  return lines.map((line) => line.split(""));
}

function adjacentToSymbol(matrix: string[][], coords: [number, number][]) {
  const allAdjacentsSquare = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (const [y, x] of coords) {

    for (const [yOffset, xOffset] of allAdjacentsSquare) {
      const yCoord = y + yOffset;
      const xCoord = x + xOffset;

      if (yCoord < 0 || xCoord < 0) {
        continue;
      }

      if (yCoord >= matrix.length || xCoord >= matrix[0].length) {
        continue;
      }

      if (isSymbol(matrix[yCoord][xCoord])) {
        symbolCoordSet.add([yCoord, xCoord].toString())
        for (const [y, x] of coords) {
          activeNumberSet.add([y, x].toString())
        }
        return true;
      }
    }
  }

  for (const [y, x] of coords) {
    inactiveNumberSet.add([y, x].toString())
  }


  return false;
}

function printInputWithColorMap(matrix: string[]) {
  // print matrix, if coord in symbolCoordSet, print in red, if coord in activeNumberSet, print in green
  let output = ""
  matrix.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (symbolCoordSet.has([y, x].toString())) {
        output += "\x1b[31m" + char + "\x1b[0m";
      } else if (activeNumberSet.has([y, x].toString())) {
        output += "\x1b[32m" + char + "\x1b[0m";
      } else if (inactiveNumberSet.has([y, x].toString())) {
        output += "\x1b[33m" + char + "\x1b[0m";
      } else {
        output += char;
      }
    })
    output += "\n"

  })
  console.log(output)
}

function gatherNumberLocations(matrix: string[][]) {
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
    if (digitCoordsInLine.length > 0) {
      numberLocations.push({
        digits: digitString,
        coords: digitCoordsInLine,
      });
      digitCoordsInLine = [];
      digitString = "";
    }
  });
  return numberLocations
}

function gatherGearLocations(matrix: string[][]) {
  const asteriskLocations: [number, number][] = [];

  matrix.forEach((line, y) => {
    line.forEach((value, x) => {
      if (value === "*") {
        asteriskLocations.push([y, x]);
      }
    });
  });

  return asteriskLocations;
}

function sumPartNumbers(lines: string[]) {
  let count = 0;

  const matrix = inputToMatrix(lines);
  symbolCoordSet.clear()
  activeNumberSet.clear()
  inactiveNumberSet.clear()
  symbolSet.clear()
  digitSet.clear()

  const numberLocations = gatherNumberLocations(matrix);

  numberLocations.map(({ digits, coords }) => {
    if (adjacentToSymbol(matrix, coords)) {
      count += parseInt(digits);
    }
  });

  // printInputWithColorMap(lines)

  return count;
}

function gearAdjacentNumbers(numberLocations: { digits: string; coords: [number, number][] }[], gearLocation: [number, number]) {

  const numberLocationsCopy = [...numberLocations]
  const allAdjacentsSquare = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  const [y, x] = gearLocation;
  let adjacentNumbers = []

  for (const [yOffset, xOffset] of allAdjacentsSquare) {
    const yCoord = y + yOffset;
    const xCoord = x + xOffset;

    numberLocationsCopy.forEach(({ coords, digits }, i) => {
      for (const [y, x] of coords) {
        if (y === yCoord && x === xCoord) {
          adjacentNumbers.push(digits)
          coords.map((coord) => {
            activeNumberSet.add(coord.toString())
          })
          numberLocationsCopy.splice(i, 1)
          continue
        }
      }
    })


  }

  return adjacentNumbers

}

function sumGearRatios(lines: string[]) {

  let count = 0;

  const matrix = inputToMatrix(lines);
  symbolCoordSet.clear()
  activeNumberSet.clear()
  inactiveNumberSet.clear()
  symbolSet.clear()
  digitSet.clear()

  const numberLocations = gatherNumberLocations(matrix);
  const gearLocations = gatherGearLocations(matrix);


  gearLocations.map((gearLocation) => {
    const adjacentNumbers = gearAdjacentNumbers(numberLocations, gearLocation)
    if (adjacentNumbers.length === 2) {
      symbolCoordSet.add(gearLocation.toString())
      count += parseInt(adjacentNumbers[0]) * parseInt(adjacentNumbers[1])
    }
  })

  // printInputWithColorMap(lines)

  return count;

}

export default () => {

  describe("Day 3: Gear Ratios", () => {
    const {
      "part-one/test-input": testInput,
      "part-one/main-input": mainInput,
    } = gatherAllInputStringFromDir("./3/inputs");

    describe("Part One", () => {

      it("test input should return 4361", () => {
        expect(sumPartNumbers(testInput.lines)).toBe(4361);
      });

      const result = sumPartNumbers(mainInput.lines);

      it(`main input result: ${result}`, () => {

        expect(result).toBe(result);
      });

    });

    describe("Part Two", () => {

      it("test input should return 467835", () => {
        expect(sumGearRatios(testInput.lines)).toBe(467835);
      });

      const result = sumGearRatios(mainInput.lines);

      it(`main input result: ${result}`, () => {

        expect(result).toBe(result);
      });
    });
  });

}