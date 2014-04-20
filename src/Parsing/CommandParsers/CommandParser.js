// Require statements
var Command = require('./Command');

/**
 * The command parser class helps DocumentParser and CommentParser classes in building comments.
 * Its role is simply to take a string representation of the command (what the end-user will write on its webpage) and create a command object.
 *
 * @constructor
 */
var CommandParser = function()
{
};

CommandParser.prototype.parse = function(application, target, context, input)
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
module.exports = CommandParser;