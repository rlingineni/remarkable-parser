const fs = require("fs");

const headerLength = 43;
const standardHeader = "reMarkable .lines file, version=5          ";

parseFile("./sample.rm");

function parseFile(path) {
  const data = fs.readFileSync(path);
  if (!checkHeader(data)) {
    throw "invalid lines file";
  }

  processPageData(data.slice(headerLength));
  //processFile(data.slice(headerLength)).then((data) => resolve(data));
}

/**
 * @param {Buffer} buffer
 */
function checkHeader(buffer) {
  let s = "";

  buffer.slice(0, headerLength).forEach((v) => {
    s += String.fromCharCode(v);
  });

  return s == standardHeader;
}

function processPageData(buffer) {
  const numLayers = buffer.readInt32LE(0);
  const numLines = buffer.readInt32LE(4);

  //for each line
  for (let i = 1; i <= numLines; i++) {
    const byteArray = buffer.slice(8 * i, 8 * i + 24);
    processLine(byteArray);
  }

  console.log(numLayers, numLines);
  let pOffset = 4;
}

function processLine(byteArray) {
  const line = {
    x: byteArray.readFloatLE(0),
    y: byteArray.readFloatLE(4),
    speed: byteArray.readFloatLE(8),
    direction: byteArray.readFloatLE(12),
    width: byteArray.readFloatLE(16),
    pressure: byteArray.readFloatLE(20),
  };
  console.log(line);
}
