var fs = require("fs");
var stl = require('stl');

var bitmapToStl = require("./lib/bitmap").toStl;
var textToBitmap = require("./lib/text").textToBitmap;


var image = textToBitmap("Hello\nWorld");

var boxes = bitmapToStl(image);

fs.writeFileSync('test.stl', stl.fromObject({
    description: "test",
    facets: boxes
}));