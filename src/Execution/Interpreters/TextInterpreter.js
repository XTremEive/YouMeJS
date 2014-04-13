var Interpreter = require('./Interpreter');

var TextInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

TextInterpreter.prototype = Object.create(Interpreter.prototype);

TextInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'text')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), 'undefined');

    // Process
    command.target.setHtml(value);

    return true;
};

// Exports
module.exports = TextInterpreter;