import { addIndex, all, equals, map, times } from "rambda";
import ansiEscapes from "ansi-escapes";
import { getLines } from "../../utils";

const indexedMap = addIndex(map);
const text = `For many years there lived near the town of Gallipolis, Ohio, an old man named Herman Deluse. Very little was known of his history, for he would neither speak of it himself nor suffer others. It was a common belief among his neighbors that he had been a pirate--if upon any better evidence than his collection of boarding pikes, cutlasses, and ancient flintlock pistols, no one knew. He lived entirely alone in a small house of four rooms, falling rapidly into decay and never repaired further than was required by the weather. It stood on a slight elevation in the midst of a large, stony field overgrown with brambles, and cultivated in patches and only in the most primitive way. It was his only visible property, but could hardly have yielded him a living, simple and few as were his wants. He seemed always to have ready money, and paid cash for all his purchases at the village stores roundabout, seldom buying more than two or three times at the same place until after the lapse of a considerable time. He got no commendation, however, for this equitable distribution of his patronage; people were disposed to regard it as an ineffectual attempt to conceal his possession of so much money. That he had great hoards of ill-gotten gold buried somewhere about his tumble-down dwelling was not reasonably to be doubted by any honest soul conversant with the facts of local tradition and gifted with a sense of the fitness of things.
On the 9th of November, 1867, the old man died; at least his dead body was discovered on the 10th, and physicians testified that death had occurred about twenty-four hours previously--precisely how, they were unable to say; for the post-mortem examination showed every organ to be absolutely healthy, with no indication of disorder or violence. According to them, death must have taken place about noonday, yet the body was found in bed. The verdict of the coroner's jury was that he "came to his death by a visitation of God." The body was buried and the public administrator took charge of the estate.`;

const animateFromBegin = () => {
  process.stdout.write(ansiEscapes.clearScreen);
  const lines = getLines(text);

  let toDisplay = times((i) => {
    const chars = lines[i].split("");
    const acc = [];

    for (let i in chars) {
      acc.push({
        x: i,
        char: chars[i],
      });
    }

    return acc;
  }, lines.length);
  //   console.log(toDisplay);

  let drawn = times((i) => [], toDisplay.length);
  let pointer = 0;
  let printingFinished = times((i) => false, toDisplay.length);

  const interval = setInterval(() => {
    if (drawn[pointer].length < toDisplay[pointer].length) {
      const currentLine = drawn[pointer];
      const currElement = toDisplay[pointer][currentLine.length];

      drawn[pointer].push(currElement);
      if (!isNaN(currElement.x) && currElement.x > -1 && currElement.char) {
        process.stdout.write(
          ansiEscapes.cursorTo(
            currElement.x > 10 ? 9 : currElement.x,
            pointer + 1,
          ),
        );
        process.stdout.write(currElement.char + currElement.x.toString());
      }
    }

    pointer = (pointer + 1) % toDisplay.length;

    indexedMap((_, i) => {
      if (drawn[i].length === toDisplay[i].length) {
        printingFinished[i] = true;
      }
    }, drawn);
    if (all(equals(true), printingFinished)) {
      process.stdout.write(ansiEscapes.cursorTo(1, toDisplay.length + 1));
      clearInterval(interval);
    }
  }, 10);
};

export { animateFromBegin };
