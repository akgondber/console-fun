import meow from 'meow';
import { mani } from "./source";

const cli = meow(`
	Usage
	  $ foo <input>

	Options
	  --rainbow, -r  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
`, {
	importMeta: import.meta, // This is required
	flags: {
		rainbow: {
			type: 'boolean',
			shortFlag: 'r'
		},
        kind: {
            type: 'string',
            shortFlag: 'k',
        },
	},
});
mani(cli.flags.kind);
