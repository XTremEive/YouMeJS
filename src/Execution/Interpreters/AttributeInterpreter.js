var Interpreter = require('./Interpreter');

var AttributeInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

AttributeInterpreter.prototype = Object.create(Interpreter.prototype);

AttributeInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'attribute')
    {
        return false;
    }

    // Process
    var jsonString = command.getArgument(0).replace(/(\w+):\s(\w+)/g, '"$1":"$2"');
    console.log(command);
    console.log(jsonString);
    var attributes = JSON.parse(jsonString);
    for(var attributeName in attributes)
    {
        var value = this.getValue(command.context, attributes[attributeName], 'undefined');
        command.target.setAttribute(attributeName, value);
    }

    return true;
};

// Exports
module.exports = AttributeInterpreter;