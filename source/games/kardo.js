import readline from "readline";
import ansiEscapes from "ansi-escapes";
import delay from "delay";
import figureSet from "figures";
import {
  join,
  map,
  repeat,
  times,
  propEq,
  findIndex,
  addIndex,
  filter,
  adjust,
  set,
  lensProp,
} from "rambda";
import { randPos } from "../utils";
import chalk from "chalk";
import stringWidth from "string-width";

let biteX = 0;
let biteLength = 10;
let score = 0;
let gameStatus = "RUNNING";
let roundIndex = 0;
const previousDrawnFigures = [];
let roundFigures = [];
let nextIndex = 0;

const drawFigs = () => {
  const { rows } = process.stdout;

  if (previousDrawnFigures.length > 0) {
    const currentFig = findIndex(propEq(false, "done"), roundFigures);
    if (nextIndex > -1 && nextIndex < roundFigures.length) {
      const [x0, y0] = previousDrawnFigures[nextIndex];

      process.stdout.write(ansiEscapes.cursorTo(x0, y0));
      process.stdout.write("  ");
      process.stdout.write(ansiEscapes.cursorTo(x0 + 1, y0 + 1));
      process.stdout.write(figureSet.hamburger);
      const remain = addIndex(filter)((_a, i) => {
        return i !== nextIndex && !roundFigures[i].done;
      }, previousDrawnFigures);

      previousDrawnFigures[nextIndex] = [x0 + 1, y0 + 1];

      if (y0 + 1 > rows - 2) {
        if (biteX < x0 && biteX + biteLength >= x0) {
          score++;
          roundFigures = adjust(
            nextIndex,
            (a) => set(lensProp("done"), true, set(lensProp("win"), true, a)),
            roundFigures,
          );
          nextIndex = findIndex(propEq(false, "done"), roundFigures);
        } else {
          roundFigures = adjust(
            nextIndex,
            (a) => set(lensProp("done"), true, set(lensProp("win"), false, a)),
            roundFigures,
          );
          nextIndex = findIndex(propEq(false, "done"), roundFigures);
        }
      }

      map((item) => {
        const [x, y] = item;
        process.stdout.write(ansiEscapes.cursorTo(x, y));
        process.stdout.write(figureSet.hamburger);
      }, remain);
    } else {
      gameStatus = "FINISHED";
      nextIndex = -1;
    }
  } else {
    times(() => {
      const [x, y] = randPos(1);
      process.stdout.write(ansiEscapes.cursorTo(x, y));
      previousDrawnFigures.push([x, y]);
      process.stdout.write(figureSet.hamburger);
    }, 10);
    addIndex(map)((item, i) => {
      roundFigures.push({ index: i, done: false, win: false });
    }, previousDrawnFigures);
  }
};

const drawBite = (x) => {
  const { rows } = process.stdout;
  biteX = x;
  process.stdout.write(ansiEscapes.cursorTo(0, rows - 1));
  process.stdout.write(ansiEscapes.eraseEndLine);
  process.stdout.write(ansiEscapes.cursorTo(x, rows - 1));
  process.stdout.write(join("", repeat(figureSet.squareBottom, 10)));
};

const drawScore = () => {
  process.stdout.write(ansiEscapes.cursorTo(3, 1));
  process.stdout.write(`SCORE: ${score}`);
};

const drawStatus = () => {
  process.stdout.write(ansiEscapes.cursorTo(19, 1));
  process.stdout.write(`STATUS: ${gameStatus}`);
};

const drawGameOver = () => {
  const { rows, columns } = process.stdout;

  process.stdout.write(ansiEscapes.cursorTo(0));
  process.stdout.write(ansiEscapes.eraseScreen);
  process.stdout.write(ansiEscapes.clearScreen);
  const scoreStr = chalk.green(`SCORE: ${score}`);
  const scoreStrWidth = stringWidth(scoreStr);
  process.stdout.write(
    ansiEscapes.cursorTo(
      columns / 2 - Math.floor(scoreStrWidth / 2),
      rows / 2 - 4,
    ),
  );
  process.stdout.write(scoreStr);
  process.stdout.write(ansiEscapes.cursorNextLine);

  const instruction = `Press ${chalk.bold("n")} to start a new game`;
  const instructionWidth = stringWidth(instruction);
  process.stdout.write(
    ansiEscapes.cursorTo(
      columns / 2 - Math.floor(instructionWidth / 2),
      rows / 2 - 2,
    ),
  );
  process.stdout.write(instruction);
};

const kardo = async () => {
  const { rows } = process.stdout;
  const columns = process.stdout.columns - 12;

  let firstIter = 0;
  let secondIter = 0;
  let prevX = 0;
  let prevY = 0;
  let x = 15;
  let score = 0;
  let currentFigure;
  process.stdout.write(ansiEscapes.cursorForward(7));
  process.stdout.write(ansiEscapes.clearScreen);

  process.stdout.write(ansiEscapes.cursorHide);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (gameStatus === "FINISHED") {
      if (key.name === "n") {
        gameStatus = "RUNNING";
        nextIndex = 0;
        await kardo();
      }
    }
    if (key && key.name == "s") {
      if (
        secondIter === rows - 1 &&
        biteX < firstIter &&
        biteX + biteLength > biteX
      ) {
        score++;
      }
    } else if (key && key.name == "c") {
      process.exit(0);
    }
    if (key && key.name == "right") {
      if (x - 1 < columns) {
        x++;
        drawBite(x);
      }
    } else if (key && key.name == "p") {
    } else if (key.name === "left") {
      if (x > 0) {
        x--;
        drawBite(x);
      }
    }
  });
  process.stdout.write(ansiEscapes.clearScreen);
  await delay(1200);
  let currentIndex = 0;
  let figures = [
    figureSet.circle,
    figureSet.squareSmall,
    figureSet.squareSmallFilled,
    figureSet.heart,
  ];

  let interval = setInterval(() => {
    let curr = 1;
    process.stdout.write(ansiEscapes.cursorTo(0, 0));
    process.stdout.write(ansiEscapes.clearScreen);

    const rndX = Math.floor(Math.random() * columns);
    curr++;
    roundIndex++;

    if (curr < columns) {
      drawBite(x);
      drawFigs();
      drawScore();
      drawStatus();

      if (gameStatus === "FINISHED" || nextIndex >= roundFigures.length) {
        clearInterval(interval);
        drawGameOver();
        return;
      }

      if (firstIter === 0) {
        firstIter = rndX;
      }

      if (firstIter + 7 > columns) firstIter--;
      else if (firstIter < 5) firstIter++;
      else Math.random() > 0.49 ? firstIter++ : firstIter--;

      secondIter++;
      prevX = firstIter;
      prevY = secondIter;
      currentFigure = figures[currentIndex];
      if (secondIter >= rows - 1) {
        if (biteX < firstIter && biteX + biteLength > firstIter) {
          score++;
        }
        firstIter = 0;
        secondIter = 0;
        prevX = -1;
        prevY = -1;

        if (currentIndex >= process.stdout.columns - 30 - biteLength * 2) {
          currentIndex = 1;
          clearInterval(interval);
        } else {
        }
      }
    } else {
    }
  }, 150);
};

export { kardo };
