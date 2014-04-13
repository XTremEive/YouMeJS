!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.YouMe=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var IfInterpreter = function(storage)
{
    Interpreter.call(this);

    this.storage = storage || null;
};

IfInterpreter.prototype = Object.create(Interpreter.prototype);

IfInterpreter.prototype.interpret = function(command)
{
    if (command.name != 'if')
    {
        return;
    }

    var value = this.storage.get(command.getArgument(0), false);

    if (value)
    {
        command.target.show();
    } else {
        command.target.hide();
    }
};

// Exports
module.exports = IfInterpreter;
},{"./Interpreter":3}],3:[function(_dereq_,module,exports){
var Interpreter = function()
{

};

Interpreter.prototype.interpret = function(command)
{
    throw "Not implemented!";

    return false;
};

// Exports
module.exports = Interpreter;
},{}],4:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var TextInterpreter = function(storage)
{
    Interpreter.call(this);

    this.storage = storage || null;
};

TextInterpreter.prototype = Object.create(Interpreter.prototype);

TextInterpreter.prototype.interpret = function(command)
{
    if (command.name != 'text')
    {
        return;
    }

    var value = this.storage.get(command.getArgument(0), 'undefined');

    command.target.html(value);
};

// Exports
module.exports = TextInterpreter;
},{"./Interpreter":3}],5:[function(_dereq_,module,exports){
var Storage = _dereq_('./Storage');

var MockStorage = function(data)
{
    Storage.call(this);

    this.data = data;

};

MockStorage.prototype = Object.create(Storage.prototype);

MockStorage.prototype.set = function(key, value)
{
    // Handle "flag" set.
    if (1 == arguments.length)
    {
        value = 1;
    }

    this.data[key] = value;

    return this;
};

MockStorage.prototype.get = function(key, defaultValue)
{
    return this.data[key] ? this.data[key] : defaultValue;
};

MockStorage.prototype.unset = function(key)
{
    delete this.data[key];

    return this;
};

MockStorage.prototype.save = function()
{
    var message = "YouMe's MockStorage is now saving: " + JSON.stringify(this.data);

    alert(message);
    console.log(message);

    return this;
};

// Exports
module.exports = MockStorage;
},{"./Storage":6}],6:[function(_dereq_,module,exports){
var Storage = function(data)
{
    this.data = data;

};

Storage.prototype = Object.create(Storage.prototype);

Storage.prototype.set = function(key, value)
{
    throw "Not implemented!";

    return this;
};

Storage.prototype.get = function(key, defaultValue)
{
    throw "Not implemented!";
};

Storage.prototype.unset = function(key)
{
    throw "Not implemented!";

    return this;
};

Storage.prototype.save = function()
{
    throw "Not implemented!";

    return this;
};

// Exports
module.exports = Storage;
},{}],7:[function(_dereq_,module,exports){
var Command = function(target, name, arguments)
{
    this.target = target;
    this.name = name || '';
    this.arguments = arguments || {};
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

},{}],8:[function(_dereq_,module,exports){
var Command = _dereq_('./Command');

var CommandParser = function()
{

};

CommandParser.prototype.parse = function(target, input)
{
    throw "Not implemented!";

    return new Command();
};

// Exports
module.exports = CommandParser;
},{"./Command":7}],9:[function(_dereq_,module,exports){
var CommandParser = _dereq_('./CommandParser');
var Command = _dereq_('./Command');

var SimpleCommandParser = function()
{
    CommandParser.call(this);
};

SimpleCommandParser.prototype = Object.create(CommandParser.prototype);

SimpleCommandParser.prototype.parse = function(target, input)
{
    var commandComponents = input.split(':', 2);
    var argumentString = commandComponents[1].trim();

    var commandName = commandComponents[0].trim();
    var commandArguments = argumentString.split(',');

    return new Command(target, commandName, commandArguments);
};

// Exports
module.exports = SimpleCommandParser;
},{"./Command":7,"./CommandParser":8}],10:[function(_dereq_,module,exports){
var DocumentParser = function()
{

};

DocumentParser.prototype.parse = function(rootNode, hookName)
{
    throw "Not implemented!";
    return [];
};

// Exports
module.exports = DocumentParser;

},{}],11:[function(_dereq_,module,exports){
var NormalNode = function(node)
{
    this.node = $(node);
};

NormalNode.prototype.html = function(htmlContent)
{
    this.node.html(htmlContent);
};

NormalNode.prototype.hide = function()
{
    this.node.hide();
};

NormalNode.prototype.show = function()
{
    this.node.show();
};

// Exports
module.exports = NormalNode;
},{}],12:[function(_dereq_,module,exports){
var DocumentParser = _dereq_('./DocumentParser');
var VirtualNode = _dereq_('./VirtualNode');

var SimpleCommentParser = function()
{
    DocumentParser.call(this);

    this.startCommentRegex = null;
    this.endCommentRegex = null;
    this._commentNodesHaveTextProperty = null;
};

SimpleCommentParser.prototype = Object.create(DocumentParser.prototype);

SimpleCommentParser.prototype.parse = function(commandParser, rootNode, hookName)
{
    var commands = [];
    var nodesToParse = [$(rootNode).get(0)];

    // Initialize parsing parameters
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };
    this._commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";
    this._startCommentRegex = this._commentNodesHaveTextProperty ? new RegExp('^<!--\\s*' + hookName + '(?:\\s+([\\s\\S]+))?\\s*-->$')  : new RegExp('^\\s*' + hookName + '(?:\\s+([\\s\\S]+))?\\s*$');
    this._endCommentRegex =  this._commentNodesHaveTextProperty ? new RegExp('^<!--\\s*\/' + hookName + '\\s*-->$') : new RegExp('^\\s*\/' + hookName + '\\s*$');

    // Parsing
    var scopes = [];
    while(nodesToParse.length > 0)
    {
        var nodeToParse = nodesToParse.shift();

        switch(true)
        {
            case this.isStartComment(nodeToParse):
                scopes.push({
                    startNode: nodeToParse,
                    commandString: this.getCommentValue(nodeToParse).substring(this.getCommentValue(nodeToParse).indexOf(hookName) + hookName.length, this.getCommentValue(nodeToParse).length).trim(),
                    contentNodes: [],
                    endNode: null
                });
                break;
            case this.isEndComment(nodeToParse):
                scopes[scopes.length - 1].endNode = nodeToParse;
                var scope = scopes.pop();
                commands.push(commandParser.parse(new VirtualNode(scope.startNode, scope.contentNodes, scope.endNode), scope.commandString));
                break;
            default:
                if (scopes.length > 0)
                {
                    scopes[scopes.length - 1].contentNodes.push(nodeToParse);
                }
                break;
        }

        if (scopes.length == 0)
        {
            for(var i = 0, child; child = nodeToParse.childNodes[i]; ++i)
            {
                nodesToParse.push(child);
            }
        }
    }

    return commands;
};

SimpleCommentParser.prototype.isStartComment =  function (node) {
    return (node.nodeType == 8) && this._startCommentRegex.test(this.getCommentValue(node));
};

SimpleCommentParser.prototype.isEndComment = function (node) {
    return (node.nodeType == 8) && this._endCommentRegex.test(this.getCommentValue(node));
};

SimpleCommentParser.prototype.getCommentValue = function (node) {
  return this._commentNodesHaveTextProperty ? node.text : node.nodeValue;
};

// Exports
module.exports = SimpleCommentParser;
},{"./DocumentParser":10,"./VirtualNode":14}],13:[function(_dereq_,module,exports){
var DocumentParser = _dereq_('./DocumentParser');
var NormalNode = _dereq_('./NormalNode');

var SimpleDomParser = function()
{
    DocumentParser.call(this);

    this._seenNodes = [];
};

SimpleDomParser.prototype = Object.create(DocumentParser.prototype);

SimpleDomParser.prototype.parse = function(commandParser, rootNode, hookName)
{
    var commands = [];

    var rootNodeAttribute = $(rootNode).attr('data-' + hookName);
    if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
    {
        commands.push(commandParser.parse(rootNode, rootNodeAttribute));
    }
    $(rootNode).find('[data-' + hookName + ']').each(function (index, element) {
        commands.push(commandParser.parse(new NormalNode(element), $(element).attr('data-' + hookName)));
    });

    return commands;
};

// Exports
module.exports = SimpleDomParser;
},{"./DocumentParser":10,"./NormalNode":11}],14:[function(_dereq_,module,exports){
var VirtualNode = function (startComment, nodes, endComment)
{
    this.startComment = startComment;
    this.nodes = nodes;
    this.endComment = endComment;
};

VirtualNode.prototype.html = function(htmlContent)
{
    $(this.nodes).remove();
    $(this.startComment).after(htmlContent);
};

VirtualNode.prototype.hide = function()
{
    $(this.nodes).hide();
};

VirtualNode.prototype.show = function()
{
    $(this.nodes).show();
};

// Exports
module.exports = VirtualNode;
},{}],"YouMe":[function(_dereq_,module,exports){
module.exports=_dereq_('u88BNT');
},{}],"u88BNT":[function(_dereq_,module,exports){
var Application = _dereq_('./Application');
var SimpleCommentParser = _dereq_('./Parsing/DocumentParsers/SimpleCommentParser');
var SimpleDomParser = _dereq_('./Parsing/DocumentParsers/SimpleDomParser');
var SimpleCommandParser = _dereq_('./Parsing/CommandParsers/SimpleCommandParser');
var IfInterpreter = _dereq_('./Execution/Interpreters/IfInterpreter');
var TextInterpreter = _dereq_('./Execution/Interpreters/TextInterpreter');
var MockStorage = _dereq_('./Execution/Storages/MockStorage');

// exports
module.exports = {
    fuse: function(storage, rootNode, hookName, arguments)
    {
        rootNode || 'body';
        hookName = hookName || 'youme';
        arguments = arguments || {};

        return new Application([
            new SimpleCommentParser(),
            new SimpleDomParser()
        ],
            new SimpleCommandParser(),[
                new IfInterpreter(storage),
                new TextInterpreter(storage)
            ], hookName, rootNode)
            .run(arguments);
    },
    createMockStorage: function(data)
    {
        return new MockStorage(data);
    }
};
},{"./Application":1,"./Execution/Interpreters/IfInterpreter":2,"./Execution/Interpreters/TextInterpreter":4,"./Execution/Storages/MockStorage":5,"./Parsing/CommandParsers/SimpleCommandParser":9,"./Parsing/DocumentParsers/SimpleCommentParser":12,"./Parsing/DocumentParsers/SimpleDomParser":13}]},{},["u88BNT"])
("u88BNT")
});