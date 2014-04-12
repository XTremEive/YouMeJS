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
},{}],2:[function(_dereq_,module,exports){
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
},{}],3:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var TextInterpreter = function(storage)
{
    Interpreter.call(this);

    this.storage = storage || null;
};

TextInterpreter.prototype = Object.create(Interpreter.prototype);

TextInterpreter.prototype.interpret = function(command)
{
    var $target = $(command.target);

    var value = this.storage.get(command.getArgument(0), 'undefined');

    $target.html(value);
};

// Exports
module.exports = TextInterpreter;
},{"./Interpreter":2}],4:[function(_dereq_,module,exports){
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
},{"./Storage":5}],5:[function(_dereq_,module,exports){
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
},{}],6:[function(_dereq_,module,exports){
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

},{}],7:[function(_dereq_,module,exports){
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
},{"./Command":6}],8:[function(_dereq_,module,exports){
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
},{"./Command":6,"./CommandParser":7}],9:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
var DocumentParser = _dereq_('./DocumentParser');

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
        commands.push(commandParser.parse(element, $(element).attr('data-' + hookName)));
    });

    return commands;
};

// Exports
module.exports = SimpleDomParser;
},{"./DocumentParser":9}],"YouMe":[function(_dereq_,module,exports){
module.exports=_dereq_('u88BNT');
},{}],"u88BNT":[function(_dereq_,module,exports){
var Application = _dereq_('./Application');
var SimpleDomParser = _dereq_('./Parsing/DocumentParsers/SImpleDomParser');
var SimpleCommandParser = _dereq_('./Parsing/CommandParsers/SimpleCommandParser');
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
            new SimpleDomParser()
        ],
            new SimpleCommandParser(),[
                new TextInterpreter(storage)
            ], hookName, rootNode)
            .run(arguments);
    },
    createMockStorage: function(data)
    {
        return new MockStorage(data);
    }
};
},{"./Application":1,"./Execution/Interpreters/TextInterpreter":3,"./Execution/Storages/MockStorage":4,"./Parsing/CommandParsers/SimpleCommandParser":8,"./Parsing/DocumentParsers/SImpleDomParser":10}]},{},["u88BNT"])
("u88BNT")
});