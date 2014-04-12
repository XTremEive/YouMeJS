var CommandParser = require('./CommandParser');
var Command = require('./Command');

var SimpleCommandParser = function()
{
    CommandParser.call(this);
};

SimpleCommandParser.prototype = Object.create(CommandParser.prototype);

SimpleCommandParser.prototype.parse = function(target, input)
{
    var commandComponents = input.split(':', 2);
    var argumentString = commandComponents[1].trim();

    var commandName = commandComponents[0].trim();
    var commandArguments = argumentString.split(',');

    return new Command(target, commandName, commandArguments);
};

// Exports
module.exports = SimpleCommandParser;