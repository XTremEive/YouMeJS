var Interpreter = function(storage)
{
    this.storage = storage || null;
};

Interpreter.prototype.interpret = function(command)
{
    throw "Not implemented!";

    return false;
};

Interpreter.prototype.getValue = function(context, name, defaultValue)
{
    // Handle context request
    if (name == 'context')
    {
        return context;
    }

    // Handle context variables request
    if (name.substring(0, "context.".length) == "context.")
    {
        var key = name.substring("context.".length);
        return (key in context) ? context[key] : defaultValue;
    }

    // Handle storage variables request
    return this.storage.get(name, defaultValue);
}

// Exports
module.exports = Interpreter;