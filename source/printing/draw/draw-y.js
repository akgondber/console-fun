import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import { addIndex, map } from "rambda";
import ansiEscapes from "ansi-escapes";
import { shuffle } from "fast-shuffle";

let score = 0;

const drawY = ({ colored }) => {
  process.stdout.write(ansiEscapes.clearScreen);
  let step = 0;
  let pointIndex = 0;
  const taken = [];
  let points = [
    [
      [15, 16],
      [17, 16],
      [19, 16],
      [21, 17],
      [23, 19],
      [25, 21],
    ],
    [
      [16, 18],
      [17, 20],
      [18, 21],
      [20, 22],
      [20, 24],
      [22, 26],
      [20, 22],
    ],
    [
      [22, 18],
      [22, 20],
      [22, 21],
      [24, 21],
      [26, 21],
      [28, 21],
      [24, 20],
    ],
    [
      [15, 18],
      [12, 10],
      [12, 11],
      [14, 12],
      [15, 14],
      [16, 13],
      [14, 15],
    ],
  ];

  const interval = setInterval(() => {
    let tries = 0;
    let x;
    let y;
    process.stdout.write(ansiEscapes.clearScreen);
    let currPoints = points[pointIndex];

    // while (tries < 7) {
    //     [x, y] = randPos();
    //     if (taken.some(a => a[0] === x && a[1] === y)) {
    //         tries++;
    //     } else {
    //         taken.push([x, y]);
    //         tries = 0;
    //         break;
    //     }
    // }

    // if (step > 0) {
    //     points = addIndex(map)((a, i) => [i % 2 === 0 ? a[0] + i : a[0] - i, i % 2 === 0 ? a[1] + i : a[1] - i], points);
    // }

    step++;
    pointIndex++;

    addIndex(map)((a, i) => {
      process.stdout.write(ansiEscapes.cursorTo(a[0], a[1]));
      const clr = shuffle([
        chalk.green,
        chalk.cyan,
        chalk.magenta,
        chalk.black,
        chalk.gray,
      ])[0];
      process.stdout.write(
        clr(i % 2 === 0 ? figureSet.triangleUp : figureSet.triangleDown),
      );
    }, currPoints);
    process.stdout.write(currPoints.length.toString());
    if (pointIndex >= points.length) {
      clearInterval(interval);
    }

    // if (tries > 5) {
    //     clearInterval(interval);
    //     process.stdout.write(ansiEscapes.cursorTo(0, process.stdout.rows - 1));
    //     process.stdout.write(ansiEscapes.eraseEndLine);
    //     process.stdout.write(ansiEscapes.cursorTo(process.stdout.columns / 2, process.stdout.rows - 1));
    //     process.stdout.write(chalk.cyan(`${chalk.bold('r')} - run again  ${chalk.bold('q')} - exit`));
    // }

    // process.stdout.write(ansiEscapes.cursorTo(x, y));
    // const figure = shuffle([figureSet.hamburger, figureSet.squareCenter, figureSet.circle, figureSet.checkboxOff])[0];

    // if (colored) {
    //     const color = shuffle([chalk.cyan, chalk.blue, chalk.gray, chalk.green, chalk.yellow, chalk.magenta])[0];
    //     process.stdout.write(color(figure));
    // } else {
    //     process.stdout.write(figure);
    // }
  }, 500);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name == "r") {
      drawY();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { drawY };
