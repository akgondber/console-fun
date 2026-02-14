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
    --text          Text content for some printing commands
    --color         Color to be used in context of some items
    --dimension     Matrix size for grid-like games
    --delay         Delay value to be used for example when reading file line-by-line
    --infinite      Play games without score limits, i.e. infinitely
    --ball-movement Movement type of ball inside figure

	Examples
    $ console-fun --topic game --item stars-watcher
	  $ console-fun --topic game --item colored-stars-watcher
    $ console-fun --topic game --item traction
    $ console-fun --topic game --item traction --ball-movement sequential
    $ console-fun --topic game --item reacter
    $ console-fun --topic game --item reacter --delay 90
	  $ console-fun --topic print --item hacker-types
    $ console-fun --topic print --item char-by-char
    $ console-fun --topic print --item mix-figures --colored
    $ console-fun --topic print --item read-file --subject tmp/bar.txt

  Notes:
    ball-movement (alias - "blm") can be choosen from variants:
      - sequential
      - chaotic-devouring
      - figure-center
    You can press 'q' to quit.
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
      text: {
        type: "string",
        aliases: ["content", "cont"],
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
      infinite: {
        type: "boolean",
        aliases: ["inf", "unc"],
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
  "text",
  "color",
  "dimension",
  "delay",
  "colored",
  "infinite",
  "ballMovement",
];
const options = R.reject(R.isNil, R.pick(toPick, cli.flags));
mani(cli.flags.topic, cli.flags.item, options);
