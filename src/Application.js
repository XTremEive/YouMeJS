var Application = function (documentParsers, commandParser, interpreters, hookName, rootNode)
{
    this.documentParsers = documentParsers || [];
    this.commandParser = commandParser || null;
    this.interpreters = interpreters || [];
    this.hookName = hookName || 'missingHookName'
    this.rootNode = rootNode || 'body';
    this.debug = false;
    this.listeners = {};
    this._refreshDepth = -1;
};

Application.prototype.on = function(event, callback)
{
    if (!(event in this.listeners))
    {
        this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
};

Application.prototype.off = function(event, callback)
{
    if (!(event in this.listeners))
    {
        return;
    }

    for(var i = 0; i < this.listeners[event].length; ++i)
    {
        if (this.listeners[event][i] == callback)
        {
            delete this.listeners[event][i];
            return;
        }
    }
};

Application.prototype.trigger = function (event, arguements)
{
    if (!(event in this.listeners))
    {
        return;
    }

    for(var i = 0; i < this.listeners[event].length; ++i)
    {
        this.listeners[event][i](arguements);
    }
};

Application.prototype.refresh = function(rootNode, context)
{
    rootNode = rootNode || this.rootNode;
    context = context || {};

    // Handle pre events
    if (++this._refreshDepth == 0)
    {
        this.trigger('beforeRefresh', this);
    }

    // Parse
    var commands = [];
    for(var index = 0, documentParser; documentParser = this.documentParsers[index]; ++index)
    {
        var parsedCommands = documentParser.parse(this, rootNode, context, this.hookName);
        for(var i = 0; i < parsedCommands.length; ++i)
        {
            commands.push(parsedCommands[i]);
        }
    }

    // Interpret
    for(var i = 0; i < commands.length; ++i)
    {
        commandWasInterpreted = false;
        for(var index = 0, interpreter; interpreter = this.interpreters[index]; ++index)
        {
            commandWasInterpreted = interpreter.interpret(commands[i]) || commandWasInterpreted;
        }
        if(this.debug && !commandWasInterpreted)
        {
            console.log('YouMe WARNING: command ' + commands[i] +  ' unknown.');
        }
    }

    // Handle post events
    if (this._refreshDepth-- == 0)
    {
        this.trigger('afterRefresh', this);
    }
};

Application.prototype.run = function(givenArguments)
{
    givenArguments = givenArguments || {};

    // Handle arguments
    var defaultArguments = {
        debug: true
    };
    var arguments = defaultArguments;
    for(var argumentName in givenArguments)
    {
        arguments[argumentName] = givenArguments[argumentName];
    }

    // Run
    this.debug = arguments.debug;
    this.trigger('start', this);
    this.refresh();

    // Return
    return this;
};

// Exports
module.exports = Application;
