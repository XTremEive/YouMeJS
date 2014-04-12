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
        for(var index = 0, interpreter; interpreter = this.interpreters[index]; ++index)
        {
            interpreter.interpret(commands[i]);
        }
    }

    return this;
};

// Exports
module.exports = Application;


//
//
//App.prototype.execute = function(selector, context)
//{
//    var self = this;
//    selector = selector || 'body';
//    context = context || {};
//
//

//};
//
//App.prototype._processNode = function (element, context) {
//    if (-1 != $.inArray(element, this._seenNodes))
//    {
//        return;
//    }
//
//    this._seenNodes.push(element);
//
//    var command = this.parse($(element).data('App'));
//    this.interpret(command, element, context);
//};
//
//App.prototype.parse = function(attributeString)
//{
//    return this.parser.parse(attributeString);
//};
//
//App.prototype.interpret = function(command, target, context)
//{
//    var result = {};
//
//    for(var i = 0, interpreter; interpreter = this.interpreters[i]; ++i)
//    {
//        result = interpreter.interpret(this, command, context, target, result);
//    };
//
//    var resultCount = 0;
//    for(var i in result)
//    {
//        ++resultCount;
//    }
//
//    if(0 == resultCount)
//    {
//        alert("Unknown command: " + command.toString());
//        return;
//    }
//
//    return $(target).html();
//};
//
//App.prototype.parseAttribute = function(input)
//{
//};