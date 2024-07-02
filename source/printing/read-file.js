import fs from "fs";
import { lineByLine } from "./line-by-line";

const readFileLineByLine = (file, options = {}) => {
  const text = fs.readFileSync(file, "utf-8");
  lineByLine(text, options);
};

export { readFileLineByLine };
