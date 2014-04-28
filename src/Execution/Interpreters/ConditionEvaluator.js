/**
 * This a basic condition evaluator. It should be improved to be honest.
 * But it allows the end user to write simple logical expressions.
 * This class is mean to be used within an interpreter as it works with interpreter's varaibles.
 *
 * @param interpreter An Interpreter object.
 * @constructor
 */
var ConditionEvaluator = function()
{
};

/**
 * Evaluate a logical expression using the bound interpreter, its storage and a given context. And will return TRUE or FALSE..
 *
 * @param interpreter An interpreter to use in the evaluation.
 * @param context An evaluation context.
 * @param input The string to parse and evaluate as TRUE or FALSE.
 * @returns {boolean}
 */
ConditionEvaluator.prototype.evaluate = function(interpreter, context, input)
{
    var result = true;
    var components = input.split(' ');
    var operator = '&&';

    for(var i = 0, component; component = components[i]; ++i)
    {
        component = component.trim();

        switch(component)
        {
            case '&&':
            case '||':
            case '>':
            case '<':
            case '>=':
            case '<=':
            case '==':
            case '!=':
                operator = component;
                break;
            default:
                if (component == "true")
                {
                    component = true;
                }
                else if (component == "false")
                {
                    component = false;
                }
                else {
                    component = interpreter.getValue(context, component, component);
                }

                switch(operator)
                {
                    case '==':
                        result = result == component;
                        break;
                    case '!=':
                        result = result != component;
                        break;
                    case '&&':
                        result = result && component;
                        break;
                    case '||':
                        result = result || component;
                        break;
                    case '>':
                        result = result > component;
                        break;
                    case '<':
                        result = result < component;
                        break;
                    case '>=':
                        result = result >= component;
                        break;
                    case '<=':
                        result = result <= component;
                        break;
                }

                break;
        }
    }

    return result;
};

// Exports
module.exports = ConditionEvaluator;