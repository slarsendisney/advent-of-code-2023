import { readFileSync } from 'fs';

const wordsToDetect = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

const wordsToNumbers = {
  'one': 'o1e',
  'two': 't2o',
  'three': 't3e',
  'four': 'f4r',
  'five': 'f5e',
  'six': 's6x',
  'seven': 's7n',
  'eight': 'e8t',
  'nine': 'n9e'
}

function replaceWordsWithNumbers(line: string) {
  let newLine = line;
  wordsToDetect.forEach(word => {
    newLine = newLine.replace(new RegExp(word, 'g'), wordsToNumbers[word]);
  });
  return newLine;
}

function valueAndIndexOfFirstAndLastOccuranceOfDigit(line: string) {
  let firstDigit;
  let indexOfFirstDigit = Number.MAX_SAFE_INTEGER;
  let lastDigit;
  let indexOfLastDigit = -Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < line.length; i++) {
    if (firstDigit && lastDigit) {
      break;
    }
    if (parseInt(line[i]) && !firstDigit) {
      firstDigit = line[i];
      indexOfFirstDigit = i;
    }
    if (parseInt(line[line.length - 1 - i]) && !lastDigit) {
      lastDigit = line[line.length - 1 - i];
      indexOfLastDigit = line.length - 1 - i;
    }
  }
  return {
    firstDigit,
    indexOfFirstDigit,
    lastDigit,
    indexOfLastDigit

  };
}

function decipherCalibrationDocumentDigitsOnly(input: string[]) {
  const sum = input.reduce((acc, line) => {
    const { firstDigit, lastDigit } = valueAndIndexOfFirstAndLastOccuranceOfDigit(line);
    return acc + parseInt(`${firstDigit}${lastDigit}`);

  }, 0);

  return sum;
}

function decipherCalibrationDocumentWithLetters(input: string[]) {
  const sum = input.reduce((acc, line) => {
    const lineWithNumbers = replaceWordsWithNumbers(line);
    const { firstDigit, lastDigit } = valueAndIndexOfFirstAndLastOccuranceOfDigit(lineWithNumbers);
    return acc + parseInt(`${firstDigit}${lastDigit}`);
  }, 0);

  return sum;
}

export default () => {

  describe('Day 1: Trebuchet?!', () => {
    const mainInput = readFileSync('./1/inputs/part-one/main-input.txt', 'utf8').split('\n');

    describe('Part One', () => {
      const testInput = readFileSync('./1/inputs/part-one/test-input.txt', 'utf8').split('\n');

      it('test input should return 142', () => {
        expect(decipherCalibrationDocumentDigitsOnly(testInput)).toBe(142);
      });

      const result = decipherCalibrationDocumentDigitsOnly(mainInput);

      it(`main input result: ${result}`, () => {
        expect(result).toBe(result);
      });
    });
    describe('Part Two', () => {


      const testInput = readFileSync('./1/inputs/part-two/test-input.txt', 'utf8').split('\n');

      it('test input should return 281', () => {
        expect(decipherCalibrationDocumentWithLetters(testInput)).toBe(281);
      });

      const result = decipherCalibrationDocumentWithLetters(mainInput);
      it(`main input result: ${result}`, () => {
        expect(result).toBeLessThan(54673);

        expect(result).toBe(result);
      });

    });
  });


}