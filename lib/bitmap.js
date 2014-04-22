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
}


module.exports = {
    toStl: bitMapToStl
};
