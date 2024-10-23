import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import {
  addIndex,
  compose,
  difference,
  filter,
  isNil,
  map,
  prop,
  range,
  reduce,
  sum,
  times,
  values,
  zipObj,
} from "rambda";
import ansiEscapes from "ansi-escapes";
import { shuffle } from "fast-shuffle";

const indexedMap = addIndex(map);
const sumLengths = compose(sum, map(prop("length")));

const drawMisc = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  let step = 0;
  let pointIndex = 0;
  let taken = [];
  const verticalCount = 9;
  const horizontalCount = 15;
  let positions = [];

  let firstSet = [
    figureSet.tick,
    figureSet.info,
    figureSet.warning,
    figureSet.cross,
    figureSet.square,
    figureSet.squareDarkShade,
    figureSet.circle,
    figureSet.circleCross,
    figureSet.circlePipe,
    figureSet.checkboxOff,
    figureSet.checkboxOn,
    figureSet.bullet,
    figureSet.home,
  ];
  // [
  //     [6, 9],
  //     [6, 10],
  //     [6, 11],
  //     [6, 12],
  //     [6, 13],
  //     [6, 14],
  //     [6, 15],
  //     [7, 9],
  //     [14, 6],
  //     [19, 7],
  //     [23, 9],
  //     [19, 11],
  //     [14, 13],
  //     [9, 11],
  // ];
  for (let y = 8; y < 23; y++) {
    for (let u = 9; u < 24; u++) {
      positions.push([y, u]);
    }
  }

  const interval = setInterval(() => {
    let tries = 0;
    let x;
    let y;

    process.stdout.write(ansiEscapes.clearScreen);
    indexedMap((item, i) => {
      if (i % 2 === 0) {
        let clr = step === i ? chalk.green : chalk.cyan;
        if (step === i) {
          process.stdout.write(ansiEscapes.cursorTo(item[0] - 1, item[1]));
          const triColor = step % 2 === 0 ? chalk.green : chalk.blue;
          process.stdout.write(triColor(figureSet.pointer));
        }
        if (taken.length === firstSet.length) {
          taken = [];
        }
        const remained = difference(firstSet, taken);
        const currentFigure = shuffle(remained)[0];
        taken.push(currentFigure);
        process.stdout.write(ansiEscapes.cursorTo(item[0], item[1]));
        process.stdout.write(chalk.green(currentFigure));
      }
    }, positions);

    if (step === positions.length - 1) {
      step = -1;
    }

    step++;
    pointIndex++;

    if (pointIndex >= Math.floor(Math.random() * positions.length * 53 + 23)) {
      process.stdout.write(ansiEscapes.cursorTo(process.stdout.rows / 2, 1));
      process.stdout.write(
        `${chalk.blue.bold("r")} - run again  ${chalk.blue.bold("q")} - exit`,
      );
      clearInterval(interval);
    }
  }, 1000);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name == "r") {
      drawMisc();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { drawMisc };
