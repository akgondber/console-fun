import readline from "readline";
import figureSet from "figures";
import * as R from 'rambda';
import { shuffle } from 'fast-shuffle';
import ansiEscapes from 'ansi-escapes';
import stringWidth from "string-width";
import chalk from 'chalk';
import { coloreme } from "coloreme";
import delay from 'delay';

console.log(ansiEscapes.cursorUp(2) + ansiEscapes.cursorLeft);
console.log('aaa');
const getRandom = R.compose(R.head, shuffle);

let i = 0;
const sra = ['acdc', 'vfdv', 'fv', 'ewrf', 'few', 'ev', 'dv', 'vfgbg', 'vdfv', 'njhmjh', 'scvfdb'];

const showTextFalling = (text) => {
    let printedLines = [];
    let currentIndex = 0;
    let offset = 0;
    process.stdout.write(ansiEscapes.eraseScreen);
    process.stdout.write(ansiEscapes.cursorTo(0, 0));

    const interval = setInterval(async () => {
        // process.stdout.write(ansiEscapes.cursorMove(1));
        const current = text[offset];
        printedLines[currentIndex] ||= '';
        if (stringWidth(printedLines[currentIndex]) === process.stdout.columns) {
            currentIndex++;
            // process.stdout.write(ansiEscapes.cursorNextLine + ansiEscapes. );
            // process.stdout.write(ansiEscapes.cursorGetPosition);
            // ansiEscapes.eraseStartLine + ansiEscapes.cursorTo(0));
        }

        process.stdout.write(current);
        // printed += current;
        printedLines[currentIndex] += current;
        offset++;

        await delay(100);

        if (offset > text.length) {
            clearInterval(interval);
        }
    }, 200);
};

const randPos = (yMin = 0) => {
    const randY = Math.floor(Math.random() * process.stdout.rows);
    return [Math.floor(Math.random() * process.stdout.columns), randY > yMin ? randY : Math.floor(yMin + Math.random() * process.stdout.rows)];
  }

const showFallingStars = () => {
    let printedLines = [];
    let currentIndex = 0;
    let offset = 0;
    process.stdout.write(ansiEscapes.eraseScreen);
    const [x, y] = randPos();
    process.stdout.write(ansiEscapes.cursorTo(x, y));
    let userScore = 0;
    let starCount = 0;
    let paused = true;
    let finished = false;
    let firstIter = true;
    const howManyPrint = 23; // Math.floor(process.stdout.rows * process.stdout.columns / 100);
    const takenNumbers = [];
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    // logUpdate(this.getDisplayString());
    process.stdin.on("keypress", (_chunk, key) => {
    //   const spinnerCount = this.usingSpinnersRound.length;

      if (key && key.name == "q") {
        paused = !paused;
      }

      if (key && key.name == "c") {
        process.exit(0);
      }

      if (key.ctrl && key.name === 'w') {
        process.exit(0);
      }

      if (key.name === 'e') {
        if (!paused && !takenNumbers.includes(starCount) && starCount % 9 === 0) {
            process.stdout.write(ansiEscapes.cursorTo(0, 0));
            process.stdout.write(ansiEscapes.eraseLine);
            const currCol = coloreme.yellowBlack;
            const {b: bgCol, c: col} = currCol;

            process.stdout.write(chalk.bgHex(bgCol).hex(col)(`SCORE: ${++userScore}`));
            takenNumbers.push(starCount);
        }
      }
    });
    const posis = [];
    

    const interval = setInterval(() => {
        if (paused) {
            process.stdout.write(ansiEscapes.cursorTo(process.stdout.columns / 2 - 8, process.stdout.rows / 2 - 4));
            process.stdout.write('Press `e` on every 9th star');
            firstIter = true;
            return;
        }
        if (firstIter) {
            process.stdout.write(ansiEscapes.eraseLine);
            firstIter = false;
        } else {
            // firstIter = true;
        }
        const [x, y] = randPos();
        process.stdout.write(ansiEscapes.cursorTo(x, y));
        process.stdout.write(figureSet.star);
        starCount++;

        if (starCount > howManyPrint) {
            clearInterval(interval);
            finished = true;
        }

        if (finished) {
            process.stdout.write(process.stdout.eraseScreen);
            process.stdout.write(ansiEscapes.cursorTo(process.stdout.columns / 2 - 8, process.stdout.rows / 2 - 4));
            const col = coloreme.yellowBlack.inverse;
            const bgCol = col.b;
            process.stdout.write(chalk.bgHex(bgCol.c)(`SCORE: ${userScore}`));
        }
    }, 1000);
}

const showTextBottom = (text) => {
    let printedLines = [];
    let currentIndex = 0;
    let offset = 0;
    process.stdout.write(ansiEscapes.eraseScreen);
    process.stdout.write(ansiEscapes.cursorTo(0, 0));
    let paused = false;
    const interval = setInterval(async () => {
        // process.stdout.write(ansiEscapes.cursorMove(1));
        if (paused) {
            return;
        }

        const current = text[offset];
        printedLines[currentIndex] ||= '';
        let y = 0;
        
        if (stringWidth(printedLines[currentIndex]) === process.stdout.columns) {
            currentIndex++;
            // process.stdout.write(ansiEscapes.cursorNextLine + ansiEscapes. );
            // process.stdout.write(ansiEscapes.cursorGetPosition);
            // ansiEscapes.eraseStartLine + ansiEscapes.cursorTo(0));
        }

        process.stdout.write(current);
        // printed += current;
        printedLines[currentIndex] += current;
        offset++;

        paused = true;
        const innerInterval = setInterval(() => {
            paused = true;
            process.stdout.write(ansiEscapes.eraseScreen);
            y++;
            process.stdout.write(ansiEscapes.cursorTo(0, y));
            process.stdout.write(printedLines[currentIndex]);

            if (y === process.stdout.rows) {
                paused = false;
                clearInterval(innerInterval);
            }
        }, 10);

        await delay(100);

        if (offset > text.length) {
            clearInterval(interval);
        }
    }, 20);
};
// star

const mani = (kind) => {
    const text = 
`
This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started. This installation guide is for usage with TypeScript, if you wish to use TypeDI without Typescript please read the documentation about how get started.
 `;

    if (kind === 'FALLING_TEXT') {
        const w = stringWidth(text);

        showTextFalling(text);
    } else if (kind === 'BOTTOM_TEXT') {
        showTextBottom(text);
    } else if (kind === 'FALLING_STARS') {
        showFallingStars();
    } else {
        setInterval(async () => {
            process.stdout.write(ansiEscapes.cursorMove(2));
            process.stdout.write(ansiEscapes.cursorBackward(4));
            process.stdout.write(getRandom(sra));
            process.stdout.write('-----');
            process.stdout.write(getRandom(sra));
            await delay(1000);
            process.stdout.write(ansiEscapes.cursorBackward(14));
            i++;
        }, 1500);
    }
};

export {
    mani,
};
