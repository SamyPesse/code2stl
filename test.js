var fs = require("fs");
var stl = require('stl');

var bitmapToStl = require("./lib/bitmap").toStl;

var image = [
  [1, 1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0, 1],
  [0, 1, 0, 1, 0, 1],
  [0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1]
];

var boxes = bitmapToStl(image);

fs.writeFileSync('ascii.stl', stl.fromObject({
    description: "test",
    facets: boxes
}));