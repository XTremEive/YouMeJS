var LogicEvaluator = require('./LogicEvaluator')

var ConditionEvaluator = function(interpreter)
{
    LogicEvaluator.call(this, interpreter);
};

ConditionEvaluator.prototype.evaluate = function(context, input)
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
                    component = this.interpreter.getValue(context, component, component);
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