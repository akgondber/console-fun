import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import ansiEscapes from "ansi-escapes";
import { randPos } from "../utils";
import { shuffle } from "fast-shuffle";

let score = 0;

const drawMixFigures = ({ colored }) => {
  process.stdout.write(ansiEscapes.clearScreen);
  const taken = [];

  const interval = setInterval(() => {
    let tries = 0;
    let x;
    let y;

    while (tries < 7) {
      [x, y] = randPos();
      if (taken.some((a) => a[0] === x && a[1] === y)) {
        tries++;
      } else {
        taken.push([x, y]);
        tries = 0;
        break;
      }
    }
    if (tries > 5) {
      clearInterval(interval);
      const instructions = `${chalk.cyan.bold("r")} - ${chalk.italic("run again")}   ${chalk.blue.bold("q")} - ${chalk.italic("exit")}`;
      process.stdout.write(ansiEscapes.cursorTo(0, process.stdout.rows - 1));
      process.stdout.write(ansiEscapes.eraseEndLine);
      process.stdout.write(
        ansiEscapes.cursorTo(
          Math.floor(process.stdout.columns / 2 - 8),
          process.stdout.rows - 1,
        ),
      );
      process.stdout.write(instructions);
    }

    process.stdout.write(ansiEscapes.cursorTo(x, y));
    const figure = shuffle([
      figureSet.hamburger,
      figureSet.squareCenter,
      figureSet.circle,
      figureSet.checkboxOff,
    ])[0];

    if (colored) {
      const color = shuffle([
        chalk.cyan,
        chalk.blue,
        chalk.gray,
        chalk.green,
        chalk.yellow,
        chalk.magenta,
      ])[0];
      process.stdout.write(color(figure));
    } else {
      process.stdout.write(figure);
    }
  });
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name == "r") {
      drawMixFigures({ colored });
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { drawMixFigures };
