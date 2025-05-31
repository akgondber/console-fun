#!/usr/bin/env node

import meow from "meow";
import * as R from "rambda";
import { mani } from "./source";

const cli = meow(
  `
	Usage
	  $ console-fun <input>

	Options
	  --topic, -t     Topic, (e.g. game, print)
    --item, -i      Item to be used in context of topic (e.g. hacker-types, read-file, colored-stars-watcher)
    --subject       Subject to be used in context of some items (e.g. filename for read-file item)
    --color         Color to be used in context of some items
    --dimension     Matrix size for grid-like games
    --delay         Delay value to be used for example when reading file line-by-line
    --ball-movement Movement type of ball inside figure

	Examples
    $ console-fun --topic game --item stars-watcher
	  $ console-fun --topic game --item colored-stars-watcher
    $ console-fun --topic game --item traction
    $ console-fun --topic game --item traction --ball-movement sequential
	  $ console-fun --topic print --item hacker-types
    $ console-fun --topic print --item char-by-char
    $ console-fun --topic print --item read-file --subject tmp/bar.txt

  Notes:
    ball-movement (alias - "blm") can be choosen from variants:
      - sequential
      - chaotic-devouring
      - figure-center
`,
  {
    importMeta: import.meta, // This is required
    flags: {
      topic: {
        type: "string",
        shortFlag: "t",
      },
      item: {
        type: "string",
        shortFlag: "k",
      },
      subject: {
        type: "string",
        shortFlag: "s",
      },
      color: {
        type: "string",
        shortFlag: "c",
      },
      dimension: {
        type: "string",
        shortFlag: "d",
      },
      delay: {
        type: "string",
        shortFlag: "e",
      },
      colored: {
        type: "boolean",
      },
      ballMovement: {
        type: "string",
        aliases: ["blm"],
      },
    },
  },
);
const toPick = [
  "subject",
  "color",
  "dimension",
  "delay",
  "colored",
  "ballMovement",
];
const options = R.reject(R.isNil, R.pick(toPick, cli.flags));
mani(cli.flags.topic, cli.flags.item, options);
