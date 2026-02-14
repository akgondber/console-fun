import { join, repeat } from "rambda";
import stringWidth from "string-width";
import ansiEscapes from "ansi-escapes";
import { times, flip } from "rambda";

const getLines = (text) => {
  const lines = [];
  let lineIndex = 0;
  let acc = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (stringWidth(acc + char) <= process.stdout.columns) {
      if (char === "\n") {
        lines[lineIndex] ||= "";
        lines[lineIndex] += acc;
        lineIndex++;
        lines[lineIndex] ||= "";
        lines[lineIndex] += char;
        lineIndex++;
        acc = "";
      } else {
        acc += char;

        if (i === text.length - 1) {
          lines[lineIndex] ||= "";
          lines[lineIndex] += acc;
        }
      }
    } else {
      lines[lineIndex] ||= "";
      let isAccModified = false;

      if (i < text.length) {
        if (![" ", ".", ",", "!", "?"].includes(text[i])) {
          const lastSpaceIndex = acc.lastIndexOf(" ");
          lines[lineIndex] += acc.substring(0, lastSpaceIndex + 1);
          acc = acc.substring(lastSpaceIndex + 1) + char;
          isAccModified = true;
        } else {
        }
      }

      if (!isAccModified) {
        lines[lineIndex] += acc;
        acc = char;
      }

      lineIndex++;
    }
  }
  return lines;
};

const repeatString = (source, count) => join("", repeat(source, count));
const randPos = (yMin = 0) => {
  const randY = Math.floor(Math.random() * process.stdout.rows);
  return [
    Math.floor(Math.random() * process.stdout.columns),
    randY > yMin
      ? randY
      : Math.floor(yMin + Math.random() * process.stdout.rows),
  ];
};
const writeRel = (x, y, subject) => {
  process.stdout.write(ansiEscapes.cursorMove(x, y));
  process.stdout.write(subject);
};
const writeCur = (subject) => {
  process.stdout.write(subject);
};
const goToRel = (x, y) => {
  process.stdout.write(ansiEscapes.cursorMove(x, y));
};

const flipTimes = flip(times);
const twoTimes = flipTimes(2);
const threeTimes = flipTimes(3);
const fourTimes = flipTimes(4);
const fiveTimes = flipTimes(5);

export {
  getLines,
  repeatString,
  randPos,
  writeRel,
  writeCur,
  goToRel,
  twoTimes,
  threeTimes,
  fourTimes,
  fiveTimes,
};
