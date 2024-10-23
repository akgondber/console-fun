import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import ansiEscapes from "ansi-escapes";
import { randPos } from "../utils";

let score = 0;

const drawHamburgers = () => {
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
      process.stdout.write(ansiEscapes.cursorTo(0, process.stdout.rows - 1));
      process.stdout.write(ansiEscapes.eraseEndLine);
      process.stdout.write(
        ansiEscapes.cursorTo(
          process.stdout.columns / 2,
          process.stdout.rows - 1,
        ),
      );
      process.stdout.write(
        chalk.cyan(`${chalk.bold("r")} - run again  ${chalk.bold("q")} - exit`),
      );
    }

    process.stdout.write(ansiEscapes.cursorTo(x, y));
    process.stdout.write(figureSet.hamburger);
  });
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name == "r") {
      drawHamburgers();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { drawHamburgers };
