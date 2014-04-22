var fs = require("fs");
var path = require("path");

var Q = require("q");
var Highlights = require('highlights');


var generateFile = function(input, output) {
    var highlighter = new Highlights();
    console.log("Generating", output);

    return Q.nfcall(fs.readFile, input)

    // Generate html
    .then(function(sourceCode) {
        html = highlighter.highlightSync({
            fileContents: sourceCode.toString(),
            scopeName: 'source'+path.extname(input)
        });
        console.log(html);
        return html;
    });
};

module.exports = {
    file: generateFile
};