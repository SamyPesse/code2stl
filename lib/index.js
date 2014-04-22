var _ = require("lodash");
var fs = require("fs");
var path = require("path");

var Q = require("q");
var stl = require('stl');

var bitmapToStl = require("./bitmap").toStl;
var textToBitmap = require("./text").textToBitmap;


var generateFile = function(input, output) {
    console.log("Generating", output);
    return Q.nfcall(fs.readFile, input)

    // Generate lines number
    .then(function(sourceCode) {
        sourceCode = sourceCode.toString();

        return _.chain(sourceCode.split("\n"))
        .map(function(line, i) {
            return i+" | "+line
        })
        .join("\n")
        .value();
    })

    .then(function(sourceCode) {
        console.log(sourceCode);
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