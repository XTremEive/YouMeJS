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
    this.executionCount = 0;
};

/**
 * Get an argument's value specifying its name or index.
 *
 * @param index The index of the argument.
 * @param defaultValue A default value to return if the argument wasn't found.
 * @returns {*}
 */
Command.prototype.getArgument = function(index, defaultValue)
{
    // Try to find the argument by its name.
    if (index in this.arguments)
    {
        return this.arguments[index];
    }

    // Try to find the argument by its index.
    var argumentIndex = 0;
    for(var argumentKey in this.arguments)
    {
        if (argumentIndex == index)
        {
            return this.arguments[argumentIndex];
        }
        ++argumentIndex;
    }

    // Return the default value otherwise.
    return defaultValue;
};

Command.prototype.getArguments = function()
{
    var arrayArguments = [];

    for(var name in this.arguments)
    {
        arrayArguments.push(this.arguments[name]);
    }

    return arrayArguments;
};

Command.prototype.toString = function()
{
    return this.name + '(' + JSON.stringify(this.arguments) + ')';
};

// Exports
module.exports = Command;
