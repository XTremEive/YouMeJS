// Require statements
var Interpreter = require('./Interpreter');

/**
 * Attrbiuts interpreter will change a set of HTMLAttribute on the targeted Node.
 * The value of the attribute can be take from storage, but can also be plain strings.
 * Additionally the end user can provide a set of condition to bring logic the the attribute injection.
 *
 * @param storage A Storage object
 * @param conditionEvaluator A helper class to handle the condition evaluation logic.
 * @constructor
 */
var AttributeInterpreter = function(storage, conditionEvaluator)
{
    Interpreter.call(this, storage);

    this.conditionEvaluator = conditionEvaluator;
};

AttributeInterpreter.prototype = new Interpreter();

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
        conditions[i] = this.conditionEvaluator.evaluate(this, command.context, conditions[i].trim());
    }

    for(var attributeName in attributes)
    {
        var value = this.getValue(command.context, attributes[attributeName], attributes[attributeName]);
        var conditionValue = (attributeName in conditions) ? conditions[attributeName] : true;

        if (conditionValue)
        {
            command.target.setAttribute(attributeName, value);
        } else {
            command.target.unsetAttribute(attributeName);
        }
    }

    return true;
};

// Exports
module.exports = AttributeInterpreter;