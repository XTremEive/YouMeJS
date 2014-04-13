var Application = function (documentParsers, attributeParser, interpreters, hookName, rootNode)
{
    this.documentParsers = documentParsers || [];
    this.attributeParser = attributeParser || null;
    this.interpreters = interpreters || [];
    this.hookName = hookName || 'missingHookName'
    this.rootNode = rootNode || 'body';
};

Application.prototype.run = function(givenArguments)
{
    givenArguments = givenArguments || {};

    // Process arguments
    var defaultArguments = {
        debug: true
    };
    var arguments = defaultArguments;
    for(var argumentName in givenArguments)
    {
        arguments[argumentName] = givenArguments[argumentName];
    }

    // Run
    var commands = [];
    for(var index = 0, documentParser; documentParser = this.documentParsers[index]; ++index)
    {
        var parsedCommands = documentParser.parse(this.attributeParser, this.rootNode, this.hookName);
        for(var i = 0; i < parsedCommands.length; ++i)
        {
            commands.push(parsedCommands[i]);
        }
    }

    for(var i = 0; i < commands.length; ++i)
    {
        if(arguments.debug)
        {
            console.log("Processing " + commands[i]);
        }
        for(var index = 0, interpreter; interpreter = this.interpreters[index]; ++index)
        {
            interpreter.interpret(commands[i]);
        }
    }

    return this;
};

// Exports
module.exports = Application;
