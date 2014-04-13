var Interpreter = require('./Interpreter');

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