// Require statements
var Interpreter = require('./Interpreter');

/**
 * The UserDefined interpreter class is simply an interpreter which work based on a callbck.
 * So why is it not "CallbackInterpreter" well the callback is usually provided by this library user through Application.addCommand() method.
 *
 * @param storage A Storage object
 * @param commandName The commandName to handle
 * @param callback The callback to execute.
 * @constructor
 */
var UserDefinedInterpreter = function(storage, commandName, callback)
{
    Interpreter.call(this, storage);

    this.commandName = commandName;
    this.callback = callback;
};

UserDefinedInterpreter.prototype = Object.create(Interpreter.prototype);

UserDefinedInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != this.commandName)
    {
        return false;
    }

    // Process
    this.callback.call(this, command);

    return true;
};

// Exports
module.exports = UserDefinedInterpreter;