#! /usr/bin/env node

var path = require("path");

var program = require('commander');
var pkg = require('../package.json');

var generate = require("../lib");

program
    .version(pkg.version)
    .option('-i, --input [file]', 'Input file')
    .option('-o, --output [file]', 'Output file')
    .parse(process.argv);

if (!program.input) {
    console.log("Need an inpt file with --input");
    process.exit(-1);
}

program.output = program.output || program.input.replace(path.extname(program.input), ".stl");

generate.file(program.input, program.output)
.then(function() {
    console.log("Finished!");
}, function(err) {
    console.log(err.stack || err);
});
