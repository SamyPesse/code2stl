var bitmapBoxes = require("bitmap-to-boxes");
var _ = require("lodash");

var faceNormals = require('face-normals');
var ndPack = require("ndarray-pack");

var rectangleTo3D = function(rectangle, w, h, ew, eh, z) {
    var facets = [];

    // Extract positions
    var ex = rectangle[0][0];
    var ey = rectangle[0][1];

    var sx = rectangle[1][0];
    var sy = rectangle[1][1];

    // Normalize position:
    ex = (ex*(w+ew));
    ey = -(ey*(h+eh));

    sx = (sx*(w+ew) - ew);
    sy = -(sy*(h+eh) - eh);

    facets = [
        // Face on (ex, ey) -> (sx, ey)
        [
            [ex, ey, 0],
            [sx, ey, z],
            [ex, ey, z]
        ],
        [
            [ex, ey, 0],
            [sx, ey, 0],
            [sx, ey, z]
        ],

        // Face (ex, ey) -> (ex, sy)
        [
            [ex, ey, 0],
            [ex, sy, z],
            [ex, ey, z],
        ],
        [
            [ex, ey, 0],
            [ex, sy, 0],
            [ex, sy, z]
        ],

        // Face (sx, ey) -> (sx, sy)
        [
            [sx, ey, 0],
            [sx, ey, z],
            [sx, sy, z],
        ],
        [
            [sx, ey, 0],
            [sx, sy, z],
            [sx, sy, 0],
        ],

        // Face (ex, sy) -> (sx, sy)
        [
            [ex, sy, 0],
            [sx, sy, z],
            [ex, sy, z]
        ],
        [
            [ex, sy, 0],
            [sx, sy, 0],
            [sx, sy, z]
        ],

        // Top face
        [
            [ex, ey, z],
            [ex, sy, z],
            [sx, sy, z],
            
        ],
        [
            [ex, ey, z],
            [sx, sy, z],
            [sx, ey, z],
            
        ],

        // Bottom face
        [
            [ex, ey, 0],
            [sx, sy, 0],
            [ex, sy, 0],   
        ],
        [
            [ex, ey, 0],
            [sx, ey, 0],
            [sx, sy, 0],
        ]
    ]

    // Add normals
    facets = _.map(facets, function(verts) {
        var _normal = faceNormals(new Float32Array(_.flatten(verts)));
        _normal = _.map(_normal, _.identity).slice(0, 3);
        return {
            normal: _normal,
            verts: verts
        }
    });

    return facets
};


var bitMapToStl = function(image, options) {
    options = _.defaults(options || {}, {
        z: 10,
        w: 10,
        h: 10,

        ex: 0,
        ey: 0
    });

    // Prepare image
    image = ndPack(image)

    // Convert to rectangles
    var boxes = bitmapBoxes(image);

    // Set in 3D
    boxes = _.map(boxes, function(rectangle) {
        return rectangleTo3D(rectangle, options.w, options.h, options.ex, options.ey, options.z);
    });
    boxes = _.flatten(boxes);

    return boxes;
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

// Add a border
var addBorder = function(bitmap) {
    if (bitmap.length == 0) return [];

    var w = _.max(bitmap, function(content) {
        return content.length;
    }).length+8;
    var emptyLine = _.map(new Array(w), _.constant(0));
    var borderLine = _.map(new Array(w), _.constant(1));

    emptyLine[0] = 1;
    emptyLine[w-1] = 1;

    bitmap.unshift(borderLine, emptyLine, emptyLine, emptyLine);
    bitmap.push(emptyLine, emptyLine, emptyLine, borderLine);

    bitmap = _.map(bitmap, function(content, i) {
        if (i < 4 || i > (bitmap.length-5)) return content;
        return _.flatten([1, 0, 0, 0, content, 0, 0, 0, 1]);
    });

    return bitmap;
};


module.exports = {
    border: addBorder,
    toStl: bitMapToStl,
    merge: mergeBitmaps
};
