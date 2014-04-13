var CommandParser = require('./CommandParser');
var Command = require('./Command');

var SimpleCommandParser = function()
{
    CommandParser.call(this);
};

SimpleCommandParser.prototype = Object.create(CommandParser.prototype);

SimpleCommandParser.prototype.parse = function(application, target, context, input)
{
    var commandComponents = input.split(':');

    var commandName = commandComponents[0].trim();
    commandComponents.shift();
    var commandArguments = commandComponents.join(':').trim().split(',');

    return new Command(application, target, context, commandName, commandArguments);
};

// Exports
module.exports = SimpleCommandParser;