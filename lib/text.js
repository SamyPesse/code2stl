var _ = require("lodash");

var font = require("./font");
var bitmapUtils = require("./bitmap");

// Convert a char to a bitmap
var charToBitmap = function(c, z) {
    z = z || 1;

    var code = c.charCodeAt(0);
    var data = font.content[code - 32];

    var bitmap = [], line = [], s = 0;

    for (var y = 0; y < font.h; y++) {
        line = [];
        for (var x = 0; x < font.w; x++) {
            s = 0;

            var b = data[x];
            if((b & 0x01 << y) != 0) {
                s = z;
            }
            line.push(s);
        }  
        bitmap.push(line);      
    }

    return bitmap;
};

// Text to bitmap
var textToBitmap = function(text, z) {
    z = z || 1;

    var bitmap = [];
    var lines = text.split("\n");
    return bitmapUtils.merge(
        _.chain(lines)
        .map(function(line) {
            return bitmapUtils.merge(_.map(line.replace("\n", ""), function(c) {
                return charToBitmap(c, z)
            }), 1, 0);
        })
        .compact()
        .value()
    , 0, 1);
};


module.exports = {
    charToBitmap: charToBitmap,
    textToBitmap: textToBitmap
};