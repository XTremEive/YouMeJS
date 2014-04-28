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

/**
 * Parse a string and obtain a Command object to be used during the interpretation phase.
 * @param application Our application
 * @param target The target node which will as the command's target.
 * @param context A context for the command.
 * @param input The string to parse.
 * @returns {Command} A new command object.
 */
CommandParser.prototype.parse = function(application, target, context, input)
{
    // Create command's variables
    var commandComponents = input.split(':');
    var commandName = commandComponents.shift().trim();
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