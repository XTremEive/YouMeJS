var Command = require('./Command');

var CommandParser = function()
{

};

CommandParser.prototype.parse = function(target, input)
{
    throw "Not implemented!";

    return new Command();
};

// Exports
module.exports = CommandParser;