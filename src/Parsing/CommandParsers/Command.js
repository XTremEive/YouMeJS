/**
 * Command objects store all elements which might be useful to Interpreter classes in order to do their job.
 *
 * @param application Our main application
 * @param target The target on which the command should be appllied
 * @param context The context of the command: A set of variable (for instance in a "for" loop, the context would be the current element and index...)
 * @param name The name of the command.
 * @param arguments The parameters of this command.
 * @constructor
 */
var Command = function(application, target, context, name, arguments)
{
    this.application = application;
    this.target = target;
    this.context = context;
    this.name = name || '';
    this.arguments = arguments || {};
    this.wasInterpreted  = false;
};

Command.prototype.getArgument = function(index, defaultValue)
{
    if (index in this.arguments)
    {
        return this.arguments[index];
    }

    var argumentIndex = 0;
    for(var argumentKey in this.arguments)
    {
        if (argumentIndex == index)
        {
            return this.arguments[argumentIndex];
        }
        ++argumentIndex;
    }

    return defaultValue;
};

Command.prototype.getArgumentByName = function(name, defaultValue)
{
    return (index in this.arguments) ? this.arguments[name] : defaultValue;
};

Command.prototype.toString = function()
{
    return this.name + '(' + JSON.stringify(this.arguments) + ')';
};

// Exports
module.exports = Command;
