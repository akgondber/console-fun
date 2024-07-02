import ansiEscapes from "ansi-escapes";
import readline from "readline";
import { shuffle } from "fast-shuffle";
import { snippets } from "./snippet-samples";

const hackerTypes = () => {
  let paused = false;
  let offset = 0;
  process.stdout.write(ansiEscapes.clearScreen);
  readline.emitKeypressEvents(process.stdin);
  const snippet = shuffle(snippets)[0];
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (_chunk, key) => {
    if (key && key.name == "s") {
      paused = false;
    } else if (key && key.name == "p") {
      paused = !paused;
    } else if (key.ctrl && key.name === "c") {
      process.exit(0);
    } else {
      if (offset < snippet.length) {
        process.stdout.write(snippet.slice(offset, offset + 1));
        offset++;
      }
    }
  });
};

export { hackerTypes };
