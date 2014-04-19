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
