import * as R from "rambda";
import { shuffle } from "fast-shuffle";
import ansiEscapes from "ansi-escapes";
import stringWidth from "string-width";
import chalk from "chalk";
import delay from "delay";

import { fallingStarsGame } from "./games/stars-watcher";
import { lineByLine } from "./printing/line-by-line";
import { readFileLineByLine } from "./printing/read-file";
import { coloredStarsGame } from "./games/colored-stars";
import { hackerTypes } from "./printing/hacker-types";

console.log(ansiEscapes.cursorUp(2) + ansiEscapes.cursorLeft);
const getRandom = R.compose(R.head, shuffle);

let i = 0;
const sra = [
  "acdc",
  "vfdv",
  "fv",
  "ewrf",
  "few",
  "ev",
  "dv",
  "vfgbg",
  "vdfv",
  "njhmjh",
  "scvfdb",
];

const showTextFalling = (text) => {
  let printedLines = [];
  let currentIndex = 0;
  let offset = 0;
  process.stdout.write(ansiEscapes.eraseScreen);
  process.stdout.write(ansiEscapes.cursorTo(0, 0));

  const interval = setInterval(async () => {
    // process.stdout.write(ansiEscapes.cursorMove(1));
    const current = text[offset];
    printedLines[currentIndex] ||= "";
    if (stringWidth(printedLines[currentIndex]) === process.stdout.columns) {
      currentIndex++;
      // process.stdout.write(ansiEscapes.cursorNextLine + ansiEscapes. );
      // process.stdout.write(ansiEscapes.cursorGetPosition);
      // ansiEscapes.eraseStartLine + ansiEscapes.cursorTo(0));
    }

    process.stdout.write(current);
    // printed += current;
    printedLines[currentIndex] += current;
    offset++;

    await delay(100);

    if (offset > text.length) {
      clearInterval(interval);
    }
  }, 200);
};

const writeRight = (text) => {
  process.stdout.write(ansiEscapes.clearScreen);
  const lastPoint = process.stdout.columns;
  let downCounter = 0;
  const reversed = text.split("").reverse().join("");
  const bra = lastPoint - stringWidth(text);

  process.stdout.write(ansiEscapes.cursorTo(bra, 0));
  for (const char of text) {
    process.stdout.write(chalk.bold(char));
    downCounter--;
  }
};

const writeAtSides = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  const lastXPoint = process.stdout.columns;
  const bottomPoint = process.stdout.rows - 2;
  process.stdout.write(ansiEscapes.cursorTo(0, 0));
  process.stdout.write("LeftTop");
  const rightTopString = "RightTop";
  const leftBottomString = "LeftBottom";
  const rightBottomString = "RightBottom";
  const rightTopStartPosition = lastXPoint - stringWidth(rightTopString);
  process.stdout.write(ansiEscapes.cursorTo(rightTopStartPosition, 0));
  process.stdout.write(rightTopString);

  process.stdout.write(ansiEscapes.cursorTo(rightTopStartPosition, 0));
  process.stdout.write(rightTopString);
  // const leftBottomStartPosition =
  process.stdout.write(ansiEscapes.cursorTo(0, bottomPoint));
  process.stdout.write(leftBottomString);
  const rightBottomStartPosition = lastXPoint - stringWidth(rightBottomString);
  process.stdout.write(
    ansiEscapes.cursorTo(rightBottomStartPosition, bottomPoint),
  );
  process.stdout.write(rightBottomString);
};

const showTextBottom = (text) => {
  let printedLines = [];
  let currentIndex = 0;
  let offset = 0;
  process.stdout.write(ansiEscapes.eraseScreen);
  process.stdout.write(ansiEscapes.cursorTo(0, 0));
  let paused = false;
  const interval = setInterval(async () => {
    // process.stdout.write(ansiEscapes.cursorMove(1));
    if (paused) {
      return;
    }

    const current = text[offset];
    printedLines[currentIndex] ||= "";
    let y = 0;

    if (stringWidth(printedLines[currentIndex]) === process.stdout.columns) {
      currentIndex++;
      // process.stdout.write(ansiEscapes.cursorNextLine + ansiEscapes. );
      // process.stdout.write(ansiEscapes.cursorGetPosition);
      // ansiEscapes.eraseStartLine + ansiEscapes.cursorTo(0));
    }

    process.stdout.write(current);
    printedLines[currentIndex] += current;
    offset++;

    paused = true;
    const innerInterval = setInterval(() => {
      paused = true;
      process.stdout.write(ansiEscapes.eraseScreen);
      y++;
      process.stdout.write(ansiEscapes.cursorTo(0, y));
      process.stdout.write(printedLines[currentIndex]);

      if (y === process.stdout.rows) {
        paused = false;
        clearInterval(innerInterval);
      }
    }, 10);

    await delay(100);

    if (offset > text.length) {
      clearInterval(interval);
    }
  }, 20);
};

const mani = async (topic, item = "default", options = {}) => {
  const text = `
This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started.
 `;
  const itemLower = item.toLowerCase();
  if (topic === "game") {
    if (itemLower === "stars-watcher") {
      fallingStarsGame();
    } else if (itemLower === "colored-stars-watcher") {
      coloredStarsGame();
    }
  } else if (topic === "print") {
    if (itemLower === "falling-text") {
      const w = stringWidth(text);
      showTextFalling(text);
    } else if (itemLower === "bottom-text") {
      showTextBottom(text);
    } else if (itemLower === "write-right") {
      writeRight("console-fun");
    } else if (itemLower === "write-sides") {
      writeAtSides();
    } else if (itemLower === "line-by-line") {
      lineByLine();
    } else if (itemLower === "hacker-types") {
      hackerTypes();
    } else if (itemLower === "read-file") {
      if (R.isNil(options.subject)) {
        throw new Error(
          `You must provide 'subject' option providing source filename`,
        );
      }
      readFileLineByLine(options.subject);
    } else {
      setInterval(async () => {
        process.stdout.write(ansiEscapes.cursorMove(2));
        process.stdout.write(ansiEscapes.cursorBackward(4));
        process.stdout.write(getRandom(sra));
        process.stdout.write("-----");
        process.stdout.write(getRandom(sra));
        await delay(1000);
        process.stdout.write(ansiEscapes.cursorBackward(14));
        i++;
      }, 1500);
    }
  }
};

export { mani };
