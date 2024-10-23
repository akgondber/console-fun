import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import { addIndex, map } from "rambda";
import ansiEscapes from "ansi-escapes";
import { randPos } from "../utils";
import { shuffle } from "fast-shuffle";
import { drawY } from "./draw/draw-y";
import { drawTriangles } from "./draw/draw-triangles";

let score = 0;

const drawX = ({ colored }) => {
  process.stdout.write(ansiEscapes.clearScreen);
  let step = 0;
  let pointIndex = 0;
  const taken = [];
  let points = [
    [
      [9, 9],
      [10, 10],
      [11, 9],
      [12, 10],
      [13, 11],
      [11, 11],
    ],
    [
      [11, 9],
      [12, 10],
      [8, 7],
      [8, 10],
      [8, 8],
      [11, 11],
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

    if (step > 0) {
      points = addIndex(map)(
        (a, i) => [
          i % 2 === 0 ? a[0] + i : a[0] - i,
          i % 2 === 0 ? a[1] + i : a[1] - i,
        ],
        points,
      );
    }

    step++;
    pointIndex++;

    map((a) => {
      process.stdout.write(ansiEscapes.cursorTo(a[0], a[1]));
      process.stdout.write(figureSet.bullet);
    }, currPoints);

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
      drawX();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

const drawBar = () => {
  // const rnd = Math.random() > 0.49 ? 1 : 0;
  const fncs = shuffle([drawTriangles])[0];
  fncs();
};

export { drawBar };
