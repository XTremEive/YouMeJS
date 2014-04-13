var Interpreter = require('./Interpreter');

var IfInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

IfInterpreter.prototype = Object.create(Interpreter.prototype);

IfInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'if')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), false);

    // Process
    if (value)
    {
        command.target.show();
    } else {
        command.target.hide();
    }

    return true;
};

// Exports
module.exports = IfInterpreter;