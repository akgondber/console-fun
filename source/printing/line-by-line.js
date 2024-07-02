import ansiEscapes from "ansi-escapes";
import readline from "readline";
import chalk from "chalk";
import { getLines } from "../utils";

const lineByLine = (text, options = {}) => {
  const intervalMs = options.delay || 300;
  const lines = getLines(text);
  let prevLine = "";
  let paused = false;

  process.stdout.write(ansiEscapes.clearScreen);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_chunk, key) => {
    if (key && key.name == "s") {
      paused = false;
    }

    if (key && key.name == "p") {
      paused = !paused;
    }

    if (key && key.name == "c") {
      process.exit(0);
    }

    if (key.ctrl && key.name === "w") {
      process.exit(0);
    }
  });

  let y = 0;
  let m = 0;
  let k = 0;
  let line = "";
  let newTopCounter = 0;

  const workingInterval = setInterval(() => {
    if (paused) {
      return;
    }
    line = lines[m];
    if (line !== "\n") {
      if (options.color) {
        try {
          const color = chalk[options.color];
          process.stdout.write(color(line));
        } catch (e) {
          process.stdout.write(line);
        }
      } else {
        process.stdout.write(line);
      }
      // process.stdout.write(ansiEscapes.cursorLeft);
    }
    if (newTopCounter >= process.stdout.rows) {
      // process.stdout.write(ansiEscapes.cursorNextLine);
      // process.stdout.write(ansiEscapes.cursorNextLine);
      process.stdout.write(ansiEscapes.eraseScreen);
      process.stdout.write(ansiEscapes.cursorTo(0, 0));
      // process.stdout.write(ansiEscapes.scrollUp);
      newTopCounter = 0;
      k++;
      // process.stdout.write(ansiEscapes.cursorPrevLine);
    } else {
      if (line !== "\n") {
        process.stdout.write(ansiEscapes.cursorNextLine);
        // if (m >= process.stdout.rows) {
        //   process.stdout.write(ansiEscapes.cursorNextLine);
        // }
      }
    }
    // await delay(10500);
    // if (line !== '\n') {
    //   process.stdout.write(chalk.gray(line));
    //   process.stdout.write(ansiEscapes.cursorNextLine);
    // }

    y++;
    m++;
    if (line !== "\n") newTopCounter++;

    prevLine = line;
    if (m === lines.length) {
      clearInterval(workingInterval);
      process.exit();
    }
  }, intervalMs);
};

export { lineByLine };
