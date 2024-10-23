import figureSet from "figures";
import chalk from "chalk";
import readline from "readline";
import ansiEscapes from "ansi-escapes";
import { randPos } from "../../utils";
import { clone, map, addIndex } from "rambda";

let score = 0;

const circledWords = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  let offs = 0;
  const taken = [];
  let arr = [
    { item: "a", coords: [5, 5] },
    { item: "b", coords: [8, 6] },
    { item: "c", coords: [11, 7] },
    { item: "d", coords: [8, 8] },
    { item: "e", coords: [5, 9] },
    { item: "f", coords: [2, 8] },
    { item: "g", coords: [0, 7] },
    { item: "h", coords: [2, 6] },
  ];
  let currentArr; // arrCopy = clone(arr);

  const interval = setInterval(() => {
    let tries = 0;
    let x;
    let y;

    currentArr = addIndex(map)((el, i) => {
      return arr[(offs + i) % arr.length];
    }, arr);

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
    offs++;
    if (offs > arr.length) {
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

    map((elem) => {
      x = elem.coords[0];
      y = elem.coords[1];

      process.stdout.write(ansiEscapes.cursorTo(x, y));
      process.stdout.write(elem.item);
    }, currentArr);
  }, 1300);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (key.name == "r") {
      circledWords();
    }
    if (key && key.name == "q") {
      process.exit();
    }
  });
};

export { circledWords };
