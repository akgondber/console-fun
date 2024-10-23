import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import {
  addIndex,
  compose,
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

const indexedMap = addIndex(map);
const sumLengths = compose(sum, map(prop("length")));

const drawCircles = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  let step = 0;
  let pointIndex = 0;
  const taken = [];
  const verticalCount = 9;
  const horizontalCount = 15;
  let positions = [
    [6, 9],
    [9, 7],
    [14, 6],
    [19, 7],
    [23, 9],
    [19, 11],
    [14, 13],
    [9, 11],
  ];

  const interval = setInterval(() => {
    let tries = 0;
    let x;
    let y;

    process.stdout.write(ansiEscapes.clearScreen);
    indexedMap((item, i) => {
      let clr = step === i ? chalk.green : chalk.cyan;
      if (step === i) {
        process.stdout.write(ansiEscapes.cursorTo(item[0], item[1] - 1));
        const triColor = step % 2 === 0 ? chalk.green : chalk.blue;
        process.stdout.write(triColor(figureSet.triangleDown));
      }
      const currentFigure =
        step === i ? figureSet.circle : figureSet.circleFilled;
      process.stdout.write(ansiEscapes.cursorTo(item[0], item[1]));
      process.stdout.write(chalk.green(currentFigure));
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
      drawCircles();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { drawCircles };
