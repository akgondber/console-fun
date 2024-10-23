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
  zip,
  zipObj,
} from "rambda";
import ansiEscapes from "ansi-escapes";

const indexedMap = addIndex(map);
const sumLengths = compose(sum, map(prop("length")));

const drawHisa = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  let step = 0;
  let stepY = 0;
  let stepHor = 0;

  let ba = 0;
  let pointIndex = 0;
  const taken = [];
  const verticalCount = 9;
  const horizontalCount = 15;
  let direction = "diag";
  let stepHorJ = 0;
  // let positions = [
  //     [6, 9],
  //     [9, 7],
  //     [14, 6],
  //     [19, 7],
  //     [23, 9],
  //     [19, 11],
  //     [14, 13],
  //     [9, 11],
  // ];

  const interval = setInterval(() => {
    let tries = 0;
    let x;
    let y;
    const rows = 12;
    const cols = 12;
    const total = rows * cols;

    process.stdout.write(ansiEscapes.clearScreen);
    let result = [];
    for (let i = 0; i < rows; i++) {
      let internalCounter = 0;
      for (let j = 0; j < cols; j++) {
        // if (step === j) {
        //     const triColor = step % 2 === 0 ? chalk.green : chalk.blue;
        //     process.stdout.write(ansiEscapes.cursorTo(i, j + 10 - 1));
        //     process.stdout.write(triColor(figureSet.triangleDown));
        // }
        let currentFigure;

        if (step === i && stepY === j) {
          currentFigure = figureSet.lineDownDoubleLeftDoubleRightDouble; // : figureSet.circleDotted;
        } else if (direction === "hor") {
          if (cols - stepHor === j && step === i) {
            currentFigure = figureSet.lineDownDoubleLeftDoubleRightDouble;
          }
        }

        if (isNil(currentFigure)) {
          currentFigure = figureSet.circleDotted;
        }

        if (i % 2 !== 0) {
          process.stdout.write(ansiEscapes.cursorTo(i + 9, j + 2));
          process.stdout.write(chalk.green(currentFigure));
          // step++;
        } else {
          // ba++;
          process.stdout.write(ansiEscapes.cursorTo(i + 9, j + 2));
          process.stdout.write(chalk.green(currentFigure));
          // step++;
        }

        // ba++;
        internalCounter++;
        // if (j % 2 !== 0 && i % 2 !== 0) {
        //     const currentFigure = step === i && stepY === j || i === step && j === cols - stepY - 1 ? figureSet.lineDownDoubleLeftDoubleRightDouble : figureSet.circleDotted;
        //     process.stdout.write(ansiEscapes.cursorTo(i + 9, j + 2));
        //     process.stdout.write(chalk.green(currentFigure));
        //     internalCounter++;
        // } else if (i % 2 === 0 && j % 2 !== 0) {
        //     const currentFigure = step === i && stepY === j || i === step && j === cols - stepY - 1 ? figureSet.circle : figureSet.circleDotted;
        //     process.stdout.write(ansiEscapes.cursorTo(i + 4, j + 4));
        //     process.stdout.write(chalk.green(currentFigure));
        //     internalCounter++;
        // }
        // } else if (i % 2 === 0 && j % 2 === 0) {
        //     const currentFigure = step === i && stepY === j || i === step && j === cols - stepY - 1 ? figureSet.squareCenter : figureSet.triangleLeft;
        //     process.stdout.write(ansiEscapes.cursorTo(i + 4, j + 4));
        //     process.stdout.write(chalk.green(currentFigure));
        //     internalCounter++;
        // }
      }
    }
    // map((a) => {
    //     const cu = [];
    //     map((b) => {
    //       cu.push([a, b])
    //     }, range(0, 10))
    //     result.push(cu);
    // }, range(0, 10));
    // indexedMap((ite, i) => {
    //     indexedMap((item, j) => {
    //         let clr = step === j ? chalk.green : chalk.cyan;
    //         if (step === i) {
    //             process.stdout.write(ansiEscapes.cursorTo(item[0], item[1]));
    //             const triColor = step % 2 === 0 ? chalk.green : chalk.blue;
    //             process.stdout.write(triColor(figureSet.triangleDown));
    //         }
    //         const currentFigure = step === j ? figureSet.circle : figureSet.circleFilled;
    //         process.stdout.write(ansiEscapes.cursorTo(item[0], item[1]));
    //         process.stdout.write(chalk.green(currentFigure));
    //     }, ite);
    // }, result);

    if (step === rows - 1) {
      step = -1;
    }

    if (stepY === cols - 1) {
      stepY = -1;
    }

    if (step === -1) {
      // direction = 'hor';
    }
    if (direction !== "hor") {
      stepY = -1;
    } else {
      stepHor++;
      stepHorJ++;
      if (stepHor === cols - 1) {
        direction = "diag";
        stepHor = -1;
      }
    }
    step++;
    stepY++;
    pointIndex++;

    if (pointIndex >= Math.floor(Math.random() * total * 2 + 23)) {
      process.stdout.write(ansiEscapes.cursorTo(process.stdout.rows / 2, 1));
      process.stdout.write(
        `${chalk.blue.bold("r")} - run again  ${chalk.blue.bold("q")} - exit`,
      );
      clearInterval(interval);
    }
  }, 400);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name == "r") {
      drawHisa();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { drawHisa };
