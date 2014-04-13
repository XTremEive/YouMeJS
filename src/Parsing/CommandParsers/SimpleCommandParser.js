var CommandParser = require('./CommandParser');
var Command = require('./Command');

var SimpleCommandParser = function()
{
    CommandParser.call(this);
};

SimpleCommandParser.prototype = Object.create(CommandParser.prototype);

SimpleCommandParser.prototype.parse = function(application, target, context, input)
{
    var commandComponents = input.split(':', 2);
    var argumentString = commandComponents.length > 1 ? commandComponents[1].trim() : '';

    var commandName = commandComponents[0].trim();
    var commandArguments = argumentString.split(',');

    return new Command(application, target, context, commandName, commandArguments);
};

// Exports
module.exports = SimpleCommandParser;