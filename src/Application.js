var Application = function (documentParsers, commandParser, interpreters, hookName, rootNode)
{
    this.documentParsers = documentParsers || [];
    this.commandParser = commandParser || null;
    this.interpreters = interpreters || [];
    this.hookName = hookName || 'missingHookName'
    this.rootNode = rootNode || 'body';
    this.debug = false;
};

Application.prototype.process = function(rootNode, context)
{
    context = context || {};

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

    // Execute
    for(var i = 0; i < commands.length; ++i)
    {
        if(this.debug)
        {
            console.log("Processing " + commands[i]);
        }
        for(var index = 0, interpreter; interpreter = this.interpreters[index]; ++index)
        {
            interpreter.interpret(commands[i]);
        }
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
    this.process(this.rootNode);

    // Return
    return this;
};

// Exports
module.exports = Application;
