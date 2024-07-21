import readline from "readline";
import figureSet from "figures";
import logUpdate from "log-update";
import ansiEscapes from "ansi-escapes";
import chalk from "chalk";
import { shuffle } from "fast-shuffle";
import delay from "delay";
import { repeat, join } from "rambda";
import { repeatString } from "../utils";

const start = async (roundFigure, { size }) => {
  let score = 0;
  let currInd = 0;
  let currentFigure = "";
  let currentColor = chalk.green;
  let currentCorrectIndex = 0;
  const correctIndexes = [];
  const answeredIndexes = [];
  const gridSize = size || 8;

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_chunk, key) => {
    if (key && key.name == "q") {
      process.exit();
    } else if (key && key.name == "n") {
      if (currentFigure === roundFigure) {
        const lastIndex = correctIndexes[correctIndexes.length - 1];
        if (!answeredIndexes.includes(lastIndex)) {
          score++;
          answeredIndexes.push(lastIndex);
          logUpdate(getString());
        }
      }
    } else if (key.name === "space") {
      if (currentFigure === roundFigure) {
        const lastIndex = correctIndexes[correctIndexes.length - 1];
        if (!answeredIndexes.includes(lastIndex)) {
          score++;
          answeredIndexes.push(lastIndex);
          logUpdate(getString());
        }
      }
    } else if (key.name === "down") {
    } else if (key.name === "up") {
      process.exit();
    } else if (key.name === "s" || key.name === "return") {
    } else if ("12345678a9".includes(key.name)) {
      score++;
    }
  });

  const items = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let rndIndex = Math.floor(Math.random() * gridSize);
      if (j === rndIndex) {
        items.push([i, j, figureSet.circle, true]);
      } else {
        const figureToInsert = shuffle([
          figureSet.triangleLeft,
          figureSet.triangleRight,
          figureSet.triangleDown,
          figureSet.triangleUp,
        ])[0];
        items.push([i, j, figureToInsert]);
      }
    }

    process.stdout.write(ansiEscapes.cursorTo(0, 0));
    process.stdout.write(ansiEscapes.eraseScreen);

    process.stdout.write(ansiEscapes.cursorNextLine);
    process.stdout.write(figureSet.home);
  }

  let lineOffset = 10;
  let displayable = join("", repeat(" ", lineOffset));
  const getString = () => {
    return `
          Press ${chalk.bold("[space]")} on '${roundFigure}' appearance.

                  Score: ${score}

${displayable}
        `;
  };

  let columnCounter = 0;
  for (let y = 0; y < items.length; y++) {
    currentColor = y % 2 === 0 ? chalk.cyan : chalk.red;

    currentFigure = `${items[y][2]}`;
    if (currentFigure === roundFigure) {
      correctIndexes.push(currentCorrectIndex);
    }
    if (displayable === "") {
      displayable = "";
    }

    displayable += ` ${currentColor(currentFigure)} `;

    if (columnCounter + 1 >= gridSize) {
      displayable += `\n${join("", repeat(" ", lineOffset))}`;
      currInd = y;
      columnCounter = -1;
    }

    logUpdate(getString());
    await delay(items[y][2] === figureSet.heart ? 600 : 450);
    columnCounter++;
    currentCorrectIndex++;
  }

  logUpdate(getString());
};

const watchFigureGame = async ({ size }) => {
  const roundFigure = figureSet.circle;

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key && key.name == "q") {
      process.exit();
    } else if (key && key.name == "y") {
      if (size) {
        await start(roundFigure, { size });
      } else {
        await start(roundFigure);
      }
    }
  });
  process.stdout.write(ansiEscapes.clearScreen);
  process.stdout.write(repeatString(" ", 26) + chalk.green("watch-figure"));
  process.stdout.write(repeatString(ansiEscapes.cursorNextLine, 4));
  process.stdout.write(`
    There are different figures are appearing during a game round.
    Your task is to watch the ${roundFigure} figure appearance
    and press ${chalk.bold("[space]")} before the next figure has been shown.
    Start ${chalk.bold.green("y")} if you are ready.
  `);
};

export { watchFigureGame };
