import readline from "readline";
import ansiEscapes from "ansi-escapes";
import delay from "delay";
import figureSet from "figures";
import { join, repeat } from "rambda";

let biteX = 0;
let biteLength = 10;

const drawBite = (x) => {
  const { rows } = process.stdout;
  const columns = process.stdout.columns - 2;

  biteX = x;

  process.stdout.write(ansiEscapes.cursorTo(0, rows - 1));
  process.stdout.write(ansiEscapes.eraseEndLine);
  process.stdout.write(ansiEscapes.cursorTo(x, rows - 1));
  process.stdout.write(join("", repeat(figureSet.squareBottom, 10)));
};

const kardo = async () => {
  const { rows } = process.stdout;
  const columns = process.stdout.columns - 12;

  let firstIter = 0;
  let secondIter = 0;
  let prevX = 0;
  let prevY = 0;
  let x = columns / 2 - 5;
  let score = 0;
  process.stdout.write(ansiEscapes.cursorForward(4));
  process.stdout.write(ansiEscapes.clearScreen);

  process.stdout.write(ansiEscapes.cursorHide);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_chunk, key) => {
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
  drawBite(x);
  await delay(1200);
  let currentFigure = figureSet.checkboxCircleOn;
  let currentIndex = 0;
  let figures = [
    figureSet.circle,
    figureSet.squareSmall,
    figureSet.squareSmallFilled,
    figureSet.heart,
  ];
  let interval = setInterval(() => {
    let curr = 1;

    const rndX = Math.floor(Math.random() * columns);
    const rndY = Math.floor((Math.random() + 1) * rows);

    curr++;
    if (curr < columns) {
      // Math.random() > 0.49 ? firstIter++ : firstIter--;
      if (prevX > -1 && prevY > -1) {
        process.stdout.write(ansiEscapes.cursorTo(prevX, prevY));
        process.stdout.write(ansiEscapes.eraseLine);
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
      //Math.random() > 0.49 ? secondIter++ : secondIter--;
      currentFigure = figures[currentIndex];
      if (secondIter > 0) {
        process.stdout.write(ansiEscapes.cursorTo(firstIter, secondIter));
        process.stdout.write(currentFigure);
      }
      if (secondIter >= rows - 1) {
        if (biteX < firstIter && biteX + biteLength > firstIter) {
          score++;
          // process.stdout.write(ansiEscapes.cursorTo(columns - 11, 0));
        }
        process.stdout.write(ansiEscapes.cursorTo(columns - 11, 0));
        process.stdout.write(`SCORE: ${score}`);
        // process.stdout.write(ansiEscapes.cursorTo(firstIter, secondIter));
        // process.stdout.write(figureSet.circle);
        firstIter = 0;
        secondIter = 0;
        prevX = -1;
        prevY = -1;

        if (currentIndex >= figures.length - 1) {
          clearInterval(interval);
          process.stdout.write(ansiEscapes.eraseScreen);
          process.stdout.write(ansiEscapes.cursorTo(1, 0));
          process.stdout.write(`SCORE: ${score}`);
        } else {
          // currentIndex = 0;
          currentIndex++;
        }
      }
    } else {
    }
  }, 200);
};

export { kardo };
