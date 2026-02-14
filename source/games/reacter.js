import figureSet from "figures";
import chalk from "chalk";
import * as R from "rambda";
import readline from "readline";
import ansiEscapes from "ansi-escapes";
import { shuffle } from "fast-shuffle";
import {
  calcIncrPair,
  calcNextDir,
  directions,
  eH,
  isBoPoint,
} from "../board-helpers";

let isRunning = true;

const reacter = ({ colored, delay, infinite } = {}) => {
  process.stdout.write(ansiEscapes.clearScreen);
  let pointIndex = 0;
  let initPoint = [9, 9];
  let cols = process.stdout.columns;
  let rows = process.stdout.rows;

  process.stdout.write(ansiEscapes.clearScreen);
  process.stdout.write(ansiEscapes.cursorHide);
  process.stdout.write(ansiEscapes.cursorTo(0, 1));

  for (let i = 0; i < cols; i++) {
    process.stdout.write(figureSet.lineDouble);
  }
  process.stdout.write(ansiEscapes.cursorTo(0, 1));
  process.stdout.write(figureSet.lineDownDoubleRightDouble);
  process.stdout.write(ansiEscapes.cursorMove(-2, 1));
  for (let u = 0; u < rows - 1; u++) {
    process.stdout.write(figureSet.lineVerticalDouble);
    process.stdout.write(ansiEscapes.cursorMove(-2, 1));
  }
  process.stdout.write(figureSet.lineUpDoubleRightDouble);
  process.stdout.write(ansiEscapes.cursorTo(cols - 1, 1));
  process.stdout.write(figureSet.lineDownDoubleLeftDouble);
  for (let u = 0; u < rows - 1; u++) {
    process.stdout.write(ansiEscapes.cursorMove(0, 1));
    process.stdout.write(figureSet.lineVerticalDouble);
  }
  process.stdout.write(ansiEscapes.cursorMove(0, 1));
  process.stdout.write(figureSet.lineUpDoubleLeftDouble);
  process.stdout.write(ansiEscapes.cursorTo(1, rows));

  for (let i = 0; i < cols - 2; i++) {
    process.stdout.write(figureSet.lineDouble);
  }
  let haveReacted = false;
  let userScore = 0;
  let currDir = directions[3];
  let currIncrPair = calcIncrPair(currDir);
  let currRound = 1;
  let lastWrittenPos = [-1, -1];
  let savedPoints = [];
  let successIteration = false;
  savedPoints.push({ pos: initPoint, dir: currDir, edge: null });
  let needCheckReaction = false;
  let rPressCount = 0;
  const speedInterval = R.defaultTo(100, delay);

  const interval = setInterval(() => {
    let changeObj = {};
    pointIndex++;
    let oldPoint = R.compose(R.path("pos"), R.last)(savedPoints);
    let newXPos = oldPoint[0] + currIncrPair[0];
    let newYPos = oldPoint[1] + currIncrPair[1];

    if (newXPos >= cols) {
      currRound++;
      currDir = calcNextDir(currDir, eH.r);
      currIncrPair = calcIncrPair(currDir);
      changeObj.changed = true;
      changeObj.edge = eH.r;
      newXPos = oldPoint[0];
      newXPos = newXPos + currIncrPair[0];
      needCheckReaction = true;
    } else if (newXPos < 0) {
      currRound++;
      currDir = calcNextDir(currDir, eH.l);
      currIncrPair = calcIncrPair(currDir);
      changeObj.changed = true;
      changeObj.edge = eH.l;
      newXPos = oldPoint[0];
      newXPos = newXPos + currIncrPair[0];
      needCheckReaction = true;
    }

    if (newYPos >= process.stdout.rows) {
      currRound++;
      currDir = calcNextDir(currDir, eH.b);
      currIncrPair = calcIncrPair(currDir);
      changeObj.changed = true;
      changeObj.edge = eH.b;
      newYPos = oldPoint[1];
      newYPos = newYPos + currIncrPair[1];
      needCheckReaction = true;
    } else if (newYPos < 1) {
      currRound++;
      currDir = calcNextDir(currDir, eH.t);
      currIncrPair = calcIncrPair(currDir);
      changeObj.changed = true;
      changeObj.edge = eH.t;
      newYPos = oldPoint[1];
      newYPos = newYPos + currIncrPair[1];
      needCheckReaction = true;
    }
    changeObj.dir = currDir;

    if (needCheckReaction && haveReacted) {
      userScore++;
      successIteration = true;
      haveReacted = false;
    }
    if (isBoPoint(lastWrittenPos)) {
      if (needCheckReaction && successIteration) {
        if (changeObj.edge === eH.t || changeObj.edge === eH.b) {
          process.stdout.write(ansiEscapes.cursorTo(oldPoint[0], oldPoint[1]));
          process.stdout.write(figureSet.lineDouble);
        } else if (changeObj.edge === eH.l || changeObj.edge === eH.r) {
          process.stdout.write(ansiEscapes.cursorTo(oldPoint[0], oldPoint[1]));
          process.stdout.write(figureSet.lineVerticalDouble);
        }
        successIteration = false;
      } else if (true) {
        process.stdout.write(ansiEscapes.cursorTo(oldPoint[0], oldPoint[1]));
        process.stdout.write(" ");
      }
      haveReacted = false;
    }
    needCheckReaction = false;
    lastWrittenPos = [newXPos, newYPos];
    savedPoints.push({ pos: lastWrittenPos, ...changeObj });

    process.stdout.write(
      ansiEscapes.cursorTo(lastWrittenPos[0], lastWrittenPos[1]),
    );
    process.stdout.write(
      colored ? chalk.blue(figureSet.bullet) : figureSet.bullet,
    );
    process.stdout.write(ansiEscapes.cursorHide);
    process.stdout.write(ansiEscapes.cursorTo(0, 0));
    const reactMsg =
      cols > 76
        ? ` Press ${chalk.cyan.bold("r")} as soon as the ball reaches the border.`
        : `${chalk.cyan.bold("r")} - react`;
    process.stdout.write(reactMsg);

    process.stdout.write(ansiEscapes.cursorTo(process.stdout.columns - 14, 0));
    process.stdout.write(`Score: ${userScore}`);
    if ((R.isNil(infinite) || !infinite) && userScore === 20) {
      clearInterval(interval);
      const successMsg = "Well done!";
      const wouldAnotherMsg = "Would you like to play one more time?";
      const keysHint = `${chalk.green.bold.italic("y")} - yes    ${chalk.cyan.bold.italic("n")} - no`;
      process.stdout.write(ansiEscapes.clearScreen);
      process.stdout.write(
        ansiEscapes.cursorTo(
          Math.floor(cols / 2 - successMsg.length / 2),
          Math.floor(rows / 2),
        ),
      );
      for (let m = 0; m < 1; m++) {
        process.stdout.write(chalk.green(successMsg));
      }
      process.stdout.write(
        ansiEscapes.cursorTo(
          Math.floor(cols / 2 - wouldAnotherMsg.length / 2),
          Math.floor(rows / 2) + 1,
        ),
      );

      process.stdout.write(wouldAnotherMsg);
      process.stdout.write(
        ansiEscapes.cursorTo(
          Math.floor(cols / 2 - 8),
          Math.floor(rows / 2) + 3,
        ),
      );
      process.stdout.write(keysHint);
      isRunning = false;
    }
  }, speedInterval);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name === "y") {
      if (!isRunning) {
        isRunning = true;
        drawX({ colored, delay });
      }
    } else if (key.name === "r") {
      // drawX({ colored: true });qb
      if (haveReacted) {
        rPressCount++;
        if (rPressCount > 9) {
          rPressCount = 0;
          haveReacted = false;
        }
      } else {
        rPressCount++;
        haveReacted = true;
      }
    } else if (key.name === "n") {
      if (!isRunning) {
        process.stdout.write(ansiEscapes.clearScreen);
        process.stdout.write(ansiEscapes.cursorShow);
        process.exit();
      }
    } else if (key && key.name == "q") {
      clearInterval(interval);
      process.stdout.write(ansiEscapes.clearScreen);
      process.stdout.write(ansiEscapes.cursorShow);
      process.exit();
    }
  });
};

export { reacter };
