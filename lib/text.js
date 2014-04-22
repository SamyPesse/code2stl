var _ = require("lodash");
var font = require("./font");

// Convert a char to a bitmap
var charToBitmap = function(c) {
    var code = c.charCodeAt(0);
    var data = font.content[code - 32];

    var bitmap = [], line = [], s = 0;

    for (var y = 0; y < font.h; y++) {
        line = [];
        for (var x = 0; x < font.w; x++) {
            s = 0;

            var b = data[x];
            if((b & 0x01 << y) != 0) {
                s = 1;
            }
            line.push(s);
        }  
        bitmap.push(line);      
    }

    return bitmap;
};

// Merge bitmaps
var mergeBitmaps = function(bitmaps, dx, dy) {
    if (bitmaps.length == 0) return [];

    var nBitmap = [];

    var w = bitmaps[0][0].length;
    var h = bitmaps[0].length;
    
    var bigH = h*Math.max(1, dy*bitmaps.length);
    var bigW = w*Math.max(1, dx*bitmaps.length);

    nBitmap = new Array(bigH)
    for (var i =0; i <bigH; i++) nBitmap[i] = new Array(bigW);

    _.each(bitmaps, function(bitmap, p) {
        var bigX = w*(dx*p);
        var bigY = h*(dy*p);

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                nBitmap[bigY+y][bigX+x] = bitmap[y][x];
            }   
        }
    });
    

    return nBitmap;
};

// Text to bitmap
var textToBitmap = function(text) {
    var bitmap = [];
    var lines = text.split("/n");

    return mergeBitmaps(_.map(lines, function(line) {
        return mergeBitmaps(_.map(line, charToBitmap), 1, 0);
    }), 0, 1);
};


module.exports = {
    charToBitmap: charToBitmap,
    textToBitmap: textToBitmap
};