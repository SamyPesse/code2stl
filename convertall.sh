#!/bin/bash

for f in ./test/*; do
    case "$f" in
    *.stl ) 
            # it's a stl
            ;;
    *)
            echo "Processing $f file..";
            ./bin/convert.js --input=$f
            ;;
    esac
done