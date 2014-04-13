var Interpreter = function(storage)
{
    this.storage = storage || null;
};

Interpreter.prototype.interpret = function(command)
{
    throw "Not implemented!";

    return false;
};

/**
 * This method expects to get a path in the form "key.of.my.object.them.path.to.the.property". One part of the path will be resolved through storage and context. But the other part
 * might get resolved in the object itself
 * @param context A context object
 * @param path The path.to.the.property.
 * @param defaultValue A default value to return in case of not found.
 * @returns {*}
 */
Interpreter.prototype.getValue = function(context, path, defaultValue)
{
    var keyPathComponents = path.split('.');
    var objectPathComponents = [];
    var result = defaultValue;

    // Resolve value from context
    if (keyPathComponents[0] == 'context')
    {
        result = context;
        keyPathComponents.shift();

        while(keyPathComponents.length > 0)
        {
            if(keyPathComponents.join('.') in context)
            {
                result = context[keyPathComponents.join('.')]
                break;
            }
            objectPathComponents.unshift(keyPathComponents.pop());
        }

        for(var i = 0; i < objectPathComponents.length; ++i)
        {
            if((result == null) || (typeof result != 'object') || !(objectPathComponents[i] in result)) {
                return defaultValue;
            }
            result = result[objectPathComponents[i]];
        }

        return result;
    }

    // Resolve value from storage
    while(keyPathComponents.length > 0)
    {
        if(this.storage.has(keyPathComponents.join('.')))
        {
            result = this.storage.get(keyPathComponents.join('.'));
            break;
        }
        objectPathComponents.unshift(keyPathComponents.pop());
    }

    for(var i = 0; i < objectPathComponents.length; ++i)
    {
        if((result == null) || (typeof result != 'object') || !(objectPathComponents[i] in result)) {
            return defaultValue;
        }

        result = result[objectPathComponents[i]];
    }

    return result;
}

// Exports
module.exports = Interpreter;