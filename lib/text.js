var _ = require("lodash");
var font = require("./font");

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

// Merge bitmaps
var mergeBitmaps = function(bitmaps, dx, dy) {
    if (!bitmaps.length) return null;

    var nBitmap = [];

    //console.log(bitmaps[0], dx, dy)
    var h = bitmaps[0].length;
    var w = bitmaps[0][0].length;
    
    
    var bigH = (h+dy)*Math.max(1, dy*bitmaps.length);
    var bigW = (w+dx)*Math.max(1, dx*bitmaps.length);

    nBitmap = new Array(bigH)
    for (var i =0; i <bigH; i++) nBitmap[i] = new Array(bigW);

    _.each(bitmaps, function(bitmap, p) {
        var bigX = (w+dx)*(dx*p);
        var bigY = (h+dy)*(dy*p);

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                nBitmap[bigY+y][bigX+x] = bitmap[y][x];
            }   
        }
    });
    

    return nBitmap;
};

// Text to bitmap
var textToBitmap = function(text, z) {
    z = z || 1;

    var bitmap = [];
    var lines = text.split("\n");
    return mergeBitmaps(
        _.chain(lines)
        .map(function(line) {
            return mergeBitmaps(_.map(line.replace("\n", ""), function(c) {
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