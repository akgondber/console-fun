import readline from "readline";
import figureSet from "figures";
import ansiEscapes from "ansi-escapes";
import stringWidth from "string-width";
import chalk from "chalk";
import * as R from "rambda";
import { coloreme } from "coloreme";
import { shuffle } from "fast-shuffle";

const randPos = (yMin = 0) => {
  const randY = Math.floor(Math.random() * process.stdout.rows);
  return [
    Math.floor(Math.random() * process.stdout.columns),
    randY > yMin
      ? randY
      : Math.floor(yMin + Math.random() * process.stdout.rows),
  ];
};

const coloredStarsGame = () => {
  let interval;
  process.stdout.write(ansiEscapes.eraseScreen);
  const [x, y] = randPos();
  process.stdout.write(ansiEscapes.cursorTo(x, y));
  let userScore = 0;
  let starCount = 0;
  let coloredStarCount = 0;
  let paused = true;
  let finished = false;
  let firstIter = true;
  const howManyPrint = Math.floor(process.stdout.rows * process.stdout.columns / 40);
  const takenNumbers = [];
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_chunk, key) => {
    if (key && key.name == "s") {
      if (interval != null) {
        clearInterval(interval);
      }
      coloredStarsGame();
    } else if (key && key.name == "c") {
      process.exit(0);
    }

    if (finished) {
      return;
    }

    if (key && key.name == "y") {
      paused = false;
    } else if (key && key.name == "p") {
      paused = !paused;
    } else if (key.name === "space") {
      if (
        !paused &&
        !takenNumbers.includes(coloredStarCount) &&
        coloredStarCount % 9 === 0
      ) {
        // process.stdout.write(ansiEscapes.cursorTo(15, 0));
        // process.stdout.write(ansiEscapes.eraseLine);
        userScore++;

        const scoreText = chalk.bgYellow(`SCORE: ${userScore.toString()}`);
        const startingLeftPosition =
          process.stdout.columns - stringWidth(scoreText);
        process.stdout.write(ansiEscapes.cursorTo(startingLeftPosition, 0));
        process.stdout.write(scoreText);
        takenNumbers.push(coloredStarCount);
      }
    }
  });

  const drawnPositions = [];
  process.stdout.write(ansiEscapes.cursorTo(0, 0));
  process.stdout.write(chalk.bgGreen("colored-stars-watcher"));

  const redYellow = coloreme.yellowBlack.inverse;
  const scoreText = chalk.bgYellow.red(`SCORE: ${userScore.toString()}`);
  const startingLeftPosition = process.stdout.columns - stringWidth(scoreText);
  process.stdout.write(ansiEscapes.cursorTo(startingLeftPosition, 0));
  process.stdout.write(scoreText);

  interval = setInterval(async () => {
    if (paused) {
      const halfColumns = process.stdout.columns / 2;
      let y0 = process.stdout.rows / 2 - 6;
      process.stdout.write(ansiEscapes.cursorTo(0, 1));
      process.stdout.write(ansiEscapes.eraseDown);

      const instructions = [
        `Watch appearing stars`,
        `Press ${chalk.bold("[space]")} on every 9th, 18th... red colored star's appearance`,
      ];
      let cnt = 0;
      instructions.map((instruction, i) => {
        process.stdout.write(ansiEscapes.cursorNextLine);
        const instructionWidth = stringWidth(instruction);
        process.stdout.write(
          ansiEscapes.cursorTo(
            halfColumns - Math.floor(instructionWidth / 2),
            y0 + i,
          ),
        );
        process.stdout.write(instruction);
        process.stdout.write(ansiEscapes.cursorNextLine);
        cnt++;
      });

      const prompt = `Are you ready? Press 'y' to start a round`;
      const promptWidth = stringWidth(prompt);
      process.stdout.write(
        ansiEscapes.cursorTo(
          halfColumns - Math.floor(promptWidth / 2),
          y0 + cnt + 1,
        ),
      );
      process.stdout.write(prompt);
      firstIter = true;
      return;
    }
    if (firstIter) {
      process.stdout.write(ansiEscapes.cursorTo(0, 1));
      process.stdout.write(ansiEscapes.eraseDown);
      firstIter = false;
    } else {
      for (let i in drawnPositions) {
        process.stdout.write(ansiEscapes.cursorTo(...drawnPositions[i]));
        process.stdout.write(figureSet.star);
      }
    }
    process.stdout.write(ansiEscapes.cursorTo(0, 1));
    process.stdout.write(ansiEscapes.eraseDown);

    for (let i in drawnPositions) {
      process.stdout.write(ansiEscapes.cursorTo(...drawnPositions[i]));
      const colorFn = drawnPositions[i][2];
      process.stdout.write(colorFn(figureSet.star));
    }
    let newRandPos = randPos();

    while (
      R.find(
        (el) => el[0] === newRandPos[0] && el[1] === newRandPos[1],
        drawnPositions,
      )
    ) {
      newRandPos = randPos();
    }
    const [x, y] = newRandPos;

    const colors = ["red", "green", "cyan", "magenta", "white", "blue"].map(
      (col) => chalk[col],
    );
    let starColor = R.compose(R.head, shuffle)(colors);
    if (
      starColor !== chalk.red &&
      starCount > 25 &&
      coloredStarCount < 19 &&
      starCount % 6 === 0
    ) {
      starColor = chalk.red;
    }

    drawnPositions.push([x, y, starColor]);
    process.stdout.write(ansiEscapes.cursorTo(x, y));
    process.stdout.write(starColor(figureSet.star));
    if (starColor === chalk.red) coloredStarCount++;
    starCount++;
    if (starCount >= howManyPrint) {
      clearInterval(interval);
      finished = true;
    }

    if (finished) {
      process.stdout.write(ansiEscapes.cursorTo(0, 1));
      process.stdout.write(ansiEscapes.eraseDown);
      const status = `GAME OVER`;

      let x0 = Math.floor(process.stdout.columns / 2 - stringWidth(status) / 2);
      let y0 = process.stdout.rows / 2 - 4;

      process.stdout.write(
        ansiEscapes.cursorTo(
          process.stdout.columns / 2 - 4,
          process.stdout.rows / 2 - 3,
        ),
      );
      process.stdout.write(status);

      process.stdout.write(ansiEscapes.cursorNextLine);
      const scoreStr = `SCORE: ${userScore.toString()}`;
      x0 = process.stdout.columns / 2 - stringWidth(scoreStr) / 2;
      process.stdout.write(ansiEscapes.cursorTo(x0, y0 + 2));
      process.stdout.write(scoreStr);
      process.stdout.write(ansiEscapes.cursorNextLine);
      const startGameStr = `Press ${chalk.bold("s")} to start a new round`;
      x0 = process.stdout.columns / 2 - stringWidth(startGameStr) / 2;
      process.stdout.write(ansiEscapes.cursorTo(x0, y0 + 5));
      process.stdout.write(startGameStr);
      // process.stdout.write(ansiEscapes.cursorNextLine);
      // const spaceStr = `Press ${chalk.bold('[space]')} on every 9th star`;
      // const x2 = process.stdout.columns / 2 - stringWidth(spaceStr) / 2;

      // process.stdout.write(ansiEscapes.cursorMove(x2));
      // process.stdout.write(spaceStr);
    }
  }, 1000);
};

export { coloredStarsGame };
