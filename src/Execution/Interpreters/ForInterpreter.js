// Require statements
var Interpreter = require('./Interpreter');

/**
 * The ForInterpreter create loops. it will duplicated the child element of a node based on a variable stored in the Storage.
 * Those newly created child node will be parsed and interpreted by the application within a context.
 *
 * @param storage A Storage boejct.
 * @constructor
 */
var ForInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

ForInterpreter.prototype = new Interpreter();

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