import readline from "readline";
import ansiEscapes from "ansi-escapes";
import delay from "delay";
import figureSet from "figures";
import * as R from "rambda";

import {
  join,
  map,
  repeat,
  times,
  propEq,
  findIndex,
  addIndex,
  filter,
  adjust,
  set,
  lensProp,
} from "rambda";

import { randPos } from "../utils";
import { shuffle } from "fast-shuffle";

const drawX = async () => {
  process.stdout.write(ansiEscapes.cursorMove(14, 10));
  // await delay(100);
  // process.stdout.write(figureSet.lineDownDoubleRightDouble);
  // await delay(100);
  // process.stdout.write(figureSet.lineDouble);
  await delay(100);
  // process.stdout.write(figureSet.lineUpDoubleLeftDouble);
  R.times(async (i) => {
    if (i > 0) {
      // await delay(100);
      process.stdout.write(ansiEscapes.cursorMove(-1, -1));
    }
    // await delay(100);
    process.stdout.write(figureSet.lineVerticalDouble);
  }, 2);
  // process.stdout.write(ansiEscapes.cursorMove(-1, -1));
  // await delay(100);
  // process.stdout.write(figureSet.lineVerticalDouble);
  // await delay(1000);
  process.stdout.write(ansiEscapes.cursorMove(-1, -1));
  await delay(100);
  process.stdout.write(figureSet.lineDownDoubleRightDouble);
  R.times(() => {
    process.stdout.write(figureSet.lineDouble);
  }, 6);
  await delay(100);
  process.stdout.write(figureSet.lineDownDoubleLeftDouble);

  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-1, 1));
    process.stdout.write(figureSet.lineVerticalDouble);
  }, 2);
  // process.stdout.write(ansiEscapes.cursorMove(-1, 1));
  // process.stdout.write(figureSet.lineVerticalDouble);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-1, 1));
  await delay(100);
  process.stdout.write(figureSet.lineUpDoubleRightDouble);
  R.times(() => {
    process.stdout.write(figureSet.lineDouble);
  }, 6);
  // await delay(100);
  // process.stdout.write(figureSet.lineDouble);
  // await delay(100);
  // process.stdout.write(figureSet.lineDouble);
  // await delay(100);
  // process.stdout.write(figureSet.squareSmall);
  // await delay(100);
  // process.stdout.write(figureSet.lineDouble);
  await delay(100);
  process.stdout.write(figureSet.lineDownDoubleLeftDouble);
  await delay(100);
  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-1, 1));
    process.stdout.write(figureSet.lineVerticalDouble);
  }, 2);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-1, 1));
  await delay(100);
  process.stdout.write(figureSet.lineUpDoubleLeftDouble);

  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-2));
    process.stdout.write(figureSet.lineDouble);
  }, 6);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-2));
  await delay(100);
  process.stdout.write(figureSet.lineDownDoubleRightDouble);
  await delay(100);

  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-1, 1));
    process.stdout.write(figureSet.lineVerticalDouble);
  }, 2);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-1, 1));
  await delay(100);
  process.stdout.write(figureSet.lineUpDoubleLeftDouble);
  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-2));
    process.stdout.write(figureSet.lineDouble);
  }, 6);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-2));
  process.stdout.write(figureSet.lineUpDoubleRightDouble);
  await delay(100);
  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-1, -1));
    process.stdout.write(figureSet.lineVerticalDouble);
  }, 2);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-1, -1));
  await delay(100);
  process.stdout.write(figureSet.lineDownDoubleLeftDouble);
  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-2));
    process.stdout.write(figureSet.lineDouble);
  }, 6);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-2));
  await delay(100);
  process.stdout.write(figureSet.lineUpDoubleRightDouble);
  await delay(100);
  R.times(() => {
    process.stdout.write(ansiEscapes.cursorMove(-1, -1));
    process.stdout.write(figureSet.lineVerticalDouble);
  }, 2);
  await delay(100);
  process.stdout.write(ansiEscapes.cursorMove(-1, -1));
  await delay(100);
  process.stdout.write(figureSet.lineDownDoubleRightDouble);
  // await delay(100);
  // process.stdout.write(figureSet.lineDouble);
  // await delay(2100);
  // process.stdout.write(figureSet.lineDownDoubleLeftDouble);
  await delay(100);
  // await delay(100);
  // process.stdout.write(figureSet.lineDouble);
  R.times(() => {
    // await delay(100);
    process.stdout.write(figureSet.lineDouble);
  }, 6);
  process.stdout.write(figureSet.lineUpDoubleLeftDouble);
  await delay(100);

  // process.stdout.write(figureSet.lineDownDoubleLeftDouble);
};

const traction = async (movingType = "chaotic-devouring") => {
  readline.emitKeypressEvents(process.stdin);

  process.stdin.setRawMode(true);
  process.stdin.on("keypress", async (_chunk, key) => {
    if (true) {
      if (key.name === "n") {
        process.stdout.write(figureSet.lineUpLeftDoubleRightDouble);
      }
    }
    if (key && key.name == "s") {
      process.stdout.write(figureSet.lineUpDoubleRightDouble);
    }
    if (key && key.name == "c") {
      process.exit(0);
    }
  });
  process.stdout.write(ansiEscapes.clearScreen);
  await drawX();
  let pntr = 0;
  let singleDirCounter = 1;

  let isStarted = false;
  if (movingType !== "sequential") {
    process.stdout.write(ansiEscapes.cursorMove(0, 1));
    singleDirCounter--;
  }
  let firstStepIter = true;
  let positions = [
    [3, 3],
    [-3, -1],
    [4, 2],
    [-2, -2],
    [-2, -2],
    [1, 1],
    [-1, -2],
    [0, 1],
  ];
  // process.stdout.write(ansiEscapes.cursorMove(1, 1));
  const intrv = setInterval(() => {
    if (movingType === "sequential") {
      let dirs = [
        "tl1",
        "tr1",
        "m1",
        "tr2",
        "br1",
        "m2",
        "br2",
        "bl1",
        "m3",
        "bl2",
        "tl2",
        "m4",
      ];
      let zeroSteppedDirs = ["br1", "tl2"];
      let oneSteppedDirs = ["bl1"];
      let twoSteppedDirs = ["tl1", "m1", "br2", "m3", "bl2"];
      let threeSteppedDirs = ["m2"];
      let fourSteppedDirs = ["tr1"];
      let fiveSteppedDirs = ["m4"];
      let sixSteppedDirs = ["tr2"];
      if (isStarted) {
        process.stdout.write(ansiEscapes.cursorRestorePosition);
        process.stdout.write(" ");
        process.stdout.write(ansiEscapes.cursorMove(-1));
      } else {
        isStarted = true;
      }
      // process.stdout.write(ansiEscapes.cursorSavePosition);
      if (dirs[pntr] === "tl1") {
        process.stdout.write(ansiEscapes.cursorMove(0, -1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "tr1") {
        process.stdout.write(ansiEscapes.cursorMove(1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "m1") {
        process.stdout.write(ansiEscapes.cursorMove(0, 1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "tr2") {
        process.stdout.write(ansiEscapes.cursorMove(1, 0));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "br1") {
        process.stdout.write(ansiEscapes.cursorMove(0, 1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "m2") {
        process.stdout.write(ansiEscapes.cursorMove(-2, 0));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "br2") {
        process.stdout.write(ansiEscapes.cursorMove(0, 1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "bl1") {
        process.stdout.write(ansiEscapes.cursorMove(-2, 0));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "m3") {
        process.stdout.write(ansiEscapes.cursorMove(0, -1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "bl2") {
        process.stdout.write(ansiEscapes.cursorMove(-2, 0));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "tl2") {
        process.stdout.write(ansiEscapes.cursorMove(0, -1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "m4") {
        process.stdout.write(ansiEscapes.cursorMove(1, 0));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      }
      singleDirCounter++;

      // await delay(100);
      if (twoSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 2) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else if (oneSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 1) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else if (fourSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 4) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else if (threeSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 3) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else if (fiveSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 5) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else if (sixSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 6) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else if (zeroSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 0) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else {
        if (singleDirCounter > 3) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      }
    } else if (movingType === "chaotic-devouring") {
      if (singleDirCounter >= positions.length) {
        singleDirCounter = 0;
        positions = shuffle(positions);
      }

      if (isStarted) {
        process.stdout.write(ansiEscapes.cursorRestorePosition);
        process.stdout.write(" ");

        process.stdout.write(ansiEscapes.cursorMove(-1));
      } else {
        isStarted = true;
      }

      const currCoord = positions[singleDirCounter];
      process.stdout.write(ansiEscapes.cursorMove(currCoord[0], currCoord[1]));
      process.stdout.write(ansiEscapes.cursorSavePosition);
      process.stdout.write(figureSet.bullet);
      singleDirCounter++;
    } else {
      if (isStarted) {
        process.stdout.write(ansiEscapes.cursorRestorePosition);
        process.stdout.write(" ");
        process.stdout.write(ansiEscapes.cursorMove(-1));
      } else {
        isStarted = true;
      }

      const dirs = ["m1", "m2", "m3", "m4"];
      const twoSteppedDirs = ["m2", "m4"];
      const threeSteppedDirs = ["m3"];

      if (twoSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 0) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;
        }
      } else if (threeSteppedDirs.includes(dirs[pntr])) {
        if (singleDirCounter > 1) {
          pntr = (pntr + 1) % dirs.length;
          singleDirCounter = 0;

          if (firstStepIter) {
            firstStepIter = false;
          }
        }
      } else {
        if (firstStepIter) {
          if (singleDirCounter > 4) {
            pntr = (pntr + 1) % dirs.length;
            singleDirCounter = 0;
          }
        } else {
          if (singleDirCounter > 3) {
            pntr = (pntr + 1) % dirs.length;
            singleDirCounter = 0;
          }
        }
      }
      singleDirCounter++;

      if (dirs[pntr] === "m1") {
        process.stdout.write(ansiEscapes.cursorMove(1, 0));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "m2") {
        process.stdout.write(ansiEscapes.cursorMove(0, 1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "m3") {
        process.stdout.write(ansiEscapes.cursorMove(-2, 0));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      } else if (dirs[pntr] === "m4") {
        process.stdout.write(ansiEscapes.cursorMove(0, -1));
        process.stdout.write(ansiEscapes.cursorSavePosition);
        process.stdout.write(figureSet.bullet);
      }
    }
  }, 560);
};

export { traction };
