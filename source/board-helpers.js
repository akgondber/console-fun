const lEdge = "l";
const rEdge = "r";
const tEdge = "t";
const bEdge = "b";

const eH = {
  l: lEdge,
  r: rEdge,
  t: tEdge,
  b: bEdge,
};

const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
const dH = {
  ne: "ne",
  se: "se",
  sw: "sw",
  nw: "nw",
  n: "n",
  e: "e",
  s: "s",
  w: "w",
};

const calcIncrPair = (dir) => {
  if (dir === "ne") {
    return [1, -1];
  } else if (dir === "se") {
    return [1, 1];
  } else if (dir === "sw") {
    return [-1, 1];
  } else if (dir === "nw") {
    return [-1, -1];
  } else if (dir === "n") {
    return [0, -1];
  } else if (dir === "e") {
    return [1, 0];
  } else if (dir === "s") {
    return [0, 1];
  } else {
    return [-1, -1];
  }
};

const getOppositeDir = (dir) => {
  if (dir === "ne") {
    return "sw";
  } else if (dir === "se") {
    return "nw";
  } else if (dir === "sw") {
    return "ne";
  } else if (dir === "nw") {
    return "sw";
  } else if (dir === "n") {
    return "s";
  } else if (dir === "e") {
    return "w";
  } else if (dir === "s") {
    return "n";
  } else {
    return "e";
  }
};

const calcNextDir = (dir, edge) => {
  if (dir === dH.se) {
    if (edge === eH.r) {
      return dH.sw;
    } else if (edge === eH.b) {
      return dH.ne;
    }
  } else if (dir === dH.sw) {
    if (edge === eH.l) {
      return dH.se;
    } else if (edge === eH.b) {
      return dH.nw;
    }
  } else if (dir === dH.nw) {
    if (edge === eH.l) {
      return dH.ne;
    } else if (edge === eH.t) {
      return dH.sw;
    }
  } else if (dir === dH.ne) {
    if (edge === eH.t) {
      return dH.se;
    } else if (edge === eH.r) {
      return dH.nw;
    }
  } else if (dir === dH.e) {
    return dH.w;
  } else if (dir === dH.w) {
    return dH.e;
  } else if (dir === dH.n) {
    return dH.s;
  } else if (dir === dH.s) {
    return dH.n;
  }

  throw new Error(`Wrong direction and edge pair (${dir}; ${edge})`);
};

const isBoPoint = (point) => {
  return point[0] !== -1 && point[1] !== -1;
};

export { eH, directions, calcIncrPair, getOppositeDir, calcNextDir, isBoPoint };
