#! /bin/bash

echo "Building dev app...";
browserify -e src/YouMe.js -r ./src/YouMe.js:YouMe --standalone YouMe -o build/dev/youme.js;
echo "... Done";
