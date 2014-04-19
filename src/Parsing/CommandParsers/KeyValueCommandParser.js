var CommandParser = require('./CommandParser');
var Command = require('./Command');

var KeyValueCommandParser = function()
{
    CommandParser.call(this);
};

KeyValueCommandParser.prototype = Object.create(CommandParser.prototype);

KeyValueCommandParser.prototype.parse = function(application, target, context, input)
{
    // Create comment variables
    var commandComponents = input.split(':');

    var commandName = commandComponents[0].trim();
    commandComponents.shift();
    var commandArguments = commandComponents.join(':').split(',');

    // Format arguments
    for(var i = 0; i < commandArguments.length; ++i)
    {
        commandArguments[i] = commandArguments[i].trim();
    }

    // Return
    return new Command(application, target, context, commandName, commandArguments);
};

// Exports
module.exports = KeyValueCommandParser;