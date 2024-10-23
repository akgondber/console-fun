import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import {
  addIndex,
  complement,
  compose,
  equals,
  filter,
  isNil,
  keys,
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

let score = 0;

const indexedMap = addIndex(map);
const sumLengths = compose(sum, map(prop("length")));

const drawTriangles = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  let step = 0;
  let pointIndex = 0;
  const taken = [];
  const verticalCount = 9;
  const horizontalCount = 15;
  let upToDown = times((i) => [10, i + 5], verticalCount);
  let leftToRight = filter(
    (el) => !isNil(el[0]),
    times(
      (i) => [i % 2 !== 0 ? null : 11 + i + 1, verticalCount + 4],
      horizontalCount,
    ),
  );
  let downUp = times(
    (i) => [11 + horizontalCount, verticalCount + 3 - i],
    verticalCount - 1,
  );
  let rightLeft = filter(
    (el) => !isNil(el[0]),
    times(
      (i) => [i % 2 !== 0 ? null : 9 + horizontalCount - i, 5],
      horizontalCount,
    ),
  );
  const directions = ["upDown", "leftRight", "downUp", "rightLeft"];
  const directionToFigure = zipObj(directions, [
    figureSet.triangleDown,
    figureSet.triangleRight,
    figureSet.triangleUp,
    figureSet.triangleLeft,
  ]);
  let directionsMapping = zipObj(directions, range(0, 4));
  let all = zipObj(directions, [upToDown, leftToRight, downUp, rightLeft]);

  const interval = setInterval(() => {
    let tries = 0;
    let x;
    let y;

    // let currPoints = points[pointIndex];

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

    const sum = sumLengths(values(all));
    // addIndex(map)((directionable, j) => {
    //     indexedMap((a, i) => {
    //         process.stdout.write(ansiEscapes.cursorTo(a[0], a[1]));
    //         const clr = equals(step, i) ? chalk.green : chalk.gray;
    //         process.stdout.write(clr(figureSet.triangleDown));
    //     }, directionable);
    // }, all);
    process.stdout.write(ansiEscapes.clearScreen);
    indexedMap((key, i) => {
      const items = all[key];
      indexedMap((item, j) => {
        // if (!isNil(item[0])) {
        process.stdout.write(ansiEscapes.cursorTo(item[0], item[1]));
        const clr = equals(key === "upDown" ? step + 1 : step, j)
          ? chalk.green
          : chalk.gray;
        const na =
          j === items.length - 1
            ? figureSet.squareCenter
            : key === "leftRight"
              ? directionToFigure[key]
              : directionToFigure[key];
        process.stdout.write(
          key === "leftRight" && j % 2 !== 0 ? clr(na) : clr(na),
        );
        // }
      }, items);
    }, keys(all));

    let centerFigure;
    let currDir = directions[step % directions.length];
    let curCol;
    if (currDir === "upDown") {
      centerFigure = figureSet.triangleDown;
      curCol = chalk.cyan;
    } else if (currDir === "leftRight") {
      centerFigure = figureSet.triangleRight;
      curCol = chalk.green;
    } else if (currDir === "downUp") {
      centerFigure = figureSet.triangleUp;
      curCol = chalk.yellow;
    } else {
      centerFigure = figureSet.triangleLeft;
      curCol = chalk.magenta;
    }
    process.stdout.write(
      ansiEscapes.cursorTo(
        Math.floor((22 + horizontalCount) / 2),
        Math.floor((10 + verticalCount) / 2),
      ),
    );
    process.stdout.write(curCol(centerFigure));
    step++;
    pointIndex++;
    const allValues = values(all);
    const maxLength = reduce(
      (prev, current) => (prev < current.length ? current.length : prev),
      allValues[0].length,
      allValues.slice(1),
    );

    if (pointIndex >= maxLength) {
      process.stdout.write(
        ansiEscapes.cursorTo(Math.floor(process.stdout.rows / 2) - 6, 1),
      );
      process.stdout.write(
        `${chalk.blue.bold("r")} - run again  ${chalk.blue.bold("q")} - exit`,
      );
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
  }, 1000);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name == "r") {
      drawTriangles();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { drawTriangles };
