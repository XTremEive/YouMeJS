// Require statements
var Interpreter = require('./Interpreter');

/**
 * This interpreter will show or hide a node (or a set of node) based on a condition.
 * Condition operand can be take from storage, context or can just be plain strings.
 *
 * @param storage A Storage class
 * @param conditionEvaluator A ConditionEvaluator to help with logic parsing.
 * @constructor
 */
var IfInterpreter = function(storage, conditionEvaluator)
{
    Interpreter.call(this, storage);

    this.conditionEvaluator = conditionEvaluator;
    this.conditionEvaluator.interpreter = this;
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
    var value = this.conditionEvaluator.evaluate(command.context, command.getArgument(0));

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