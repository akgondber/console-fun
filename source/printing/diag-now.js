import ansiEscapes from "ansi-escapes";
import terminalSize from "terminal-size";
import delay from "delay";

const diag = async () => {
  const sentence =
    "This comprehensive collection offers the latest trends, ideas, and innovations in both residential and commercial spaces.";
  process.stdout.write(ansiEscapes.clearScreen);
  const size = terminalSize();

  for (let i = 0; i < sentence.length; i++) {
    process.stdout.write(sentence[i]);
    await delay(500);

    process.stdout.write(ansiEscapes.cursorDown());
    process.stdout.write(ansiEscapes.cursorForward());

    if (i !== 0 && i % size.rows === 0) {
      process.stdout.write(ansiEscapes.clearScreen);
    }
  }
};

export { diag };
