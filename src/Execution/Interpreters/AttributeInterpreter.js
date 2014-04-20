// Require statements
var Interpreter = require('./Interpreter');

var AttributeInterpreter = function(storage, conditionEvaluator)
{
    Interpreter.call(this, storage);

    this.conditionEvaluator = conditionEvaluator;
    this.conditionEvaluator.interpreter = this;
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
    var attributes = JSON.parse(command.getArgument(0));
    var conditions = JSON.parse(command.getArgument(1, "{}"));

    // Format parameters
    for(var i in attributes)
    {
        attributes[i] = attributes[i].trim();
    }

    for(var i in conditions)
    {
        conditions[i] = this.conditionEvaluator.evaluate(command.context, conditions[i].trim());
    }

    for(var attributeName in attributes)
    {
        var value = this.getValue(command.context, attributes[attributeName], attributes[attributeName]);
        var conditionValue = (attributeName in conditions) ? conditions[attributeName] : true;

        if (conditionValue)
        {
            command.target.setAttribute(attributeName, value);
        }
    }

    return true;
};

// Exports
module.exports = AttributeInterpreter;