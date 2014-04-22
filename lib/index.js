var fs = require("fs");
var path = require("path");

var Q = require("q");
var Highlights = require('highlights');
var cheerio = require('cheerio');
var stl = require('stl');

var bitmapToStl = require("./bitmap").toStl;
var textToBitmap = require("./text").textToBitmap;


var generateFile = function(input, output) {
    var sourceCode = "";
    var highlighter = new Highlights();

    console.log("Generating", output);
    return Q.nfcall(fs.readFile, input)

    // Generate html
    .then(function(_sourceCode) {
        sourceCode = _sourceCode.toString();

        html = highlighter.highlightSync({
            fileContents: sourceCode,
            scopeName: 'source'+path.extname(input)
        });
        console.log(sourceCode);

        /*var $ = cheerio.load(html);

        $(".line").each(function($line) {

        });*/

        return html;
    })

    .then(function(html) {
        var image = textToBitmap(sourceCode);

        var boxes = bitmapToStl(image);

        return Q.nfcall(fs.writeFile, output, stl.fromObject({
            description: "test",
            facets: boxes
        }, true));
    });
};

module.exports = {
    file: generateFile
};