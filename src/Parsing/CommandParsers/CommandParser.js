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
 * @returns {array} An array of new command objects
 */
CommandParser.prototype.parse = function(application, target, context, input)
{
    var commands = [];
    var commandString = "";
    var jsonDepth = 0;
    for(var i = 0; i < input.length; ++i)
    {
        var character = input[i];

        switch(character)
        {
            case '{':
                ++jsonDepth;
                commandString += character;
                break;
            case '}':
                --jsonDepth;
                commandString += character;
                break;
            case ',':
                if (jsonDepth == 0)
                {
                    commands.push(this.parseCommandString(application, target, context, commandString));
                    commandString = "";
                } else {
                    commandString += character;
                }
                break;
            default:
                commandString += character;
                break;
        }
    }
    commands.push(this.parseCommandString(application, target, context, commandString));

    return commands;
};

CommandParser.prototype.parseCommandString = function(application, target, context, input)
{
    // Create command's variables
    var commandComponents = input.split(':');
    var commandName = commandComponents.shift().trim();
    var commandArguments = [];
    var argumentsString = commandComponents.join(':');
    var argumentString = "";
    var jsonDepth = 0;

    // parse arguments
    for(var i = 0; i < argumentsString.length; ++i)
    {
        var character = argumentsString[i];

        switch(character)
        {
            case '{':
                ++jsonDepth;
                argumentString += character;
                break;
            case '}':
                --jsonDepth;
                argumentString += character;
                break;
            case ' ':
                if (jsonDepth == 0)
                {
                   if (argumentString.length != 0)
                   {
                       commandArguments.push(argumentString);
                   }
                    argumentString = "";
                } else {
                    argumentString += character;
                }
                break;
            default:
                argumentString += character;
                break;
        }
    }

    if (argumentString.length != 0)
    {
        commandArguments.push(argumentString);
    }

    // Return
    return new Command(application, target, context, commandName, commandArguments);
};

// Exports
module.exports = CommandParser;