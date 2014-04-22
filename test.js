var fs = require("fs");
var stl = require('stl');

var bitmapToStl = require("./lib/bitmap").toStl;
var textToBitmap = require("./lib/text").textToBitmap;


var image = textToBitmap("Hello");

/*[
  [1, 1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0, 1],
  [0, 1, 0, 1, 0, 1],
  [0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1]
];*/

var boxes = bitmapToStl(image);

fs.writeFileSync('test.stl', stl.fromObject({
    description: "test",
    facets: boxes
}));