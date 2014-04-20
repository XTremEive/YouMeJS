// Require statements
var Interpreter = require('./Interpreter');

var ForInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

ForInterpreter.prototype = Object.create(Interpreter.prototype);

ForInterpreter.prototype.interpret = function(command, depth)
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
        var context = value[i];
        context.parent = command.context;
        context.loopIndex = i;

        // Create new node and interpret it
        command.target.append(newElements[i]);
        command.application.refresh(newElements[i], context, depth + 1);
    }

    return true;
};

// Exports
module.exports = ForInterpreter;