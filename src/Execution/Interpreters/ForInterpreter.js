var Interpreter = require('./Interpreter');

var ForInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

ForInterpreter.prototype = Object.create(Interpreter.prototype);

ForInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'for')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), []);

    // Process
    var newElements = [];
    for(var i = 0; i < value.length; ++i)
    {
        newElements.push(command.target.createTemplate());
    }
    command.target.clear();

    for(var i = 0; i < value.length; ++i)
    {
        command.target.append(newElements[i]);
        command.application.process(newElements[i], value[i]);
    }

    return true;
};

// Exports
module.exports = ForInterpreter;