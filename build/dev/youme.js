!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.YouMe=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var AttributeInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

AttributeInterpreter.prototype = Object.create(Interpreter.prototype);

AttributeInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'attribute')
    {
        return false;
    }

    // Process
    var jsonString = command.getArgument(0).replace(/(\w+):\s(\w+)/g, '"$1":"$2"');
    console.log(command);
    console.log(jsonString);
    var attributes = JSON.parse(jsonString);
    for(var attributeName in attributes)
    {
        var value = this.getValue(command.context, attributes[attributeName], 'undefined');
        command.target.setAttribute(attributeName, value);
    }

    return true;
};

// Exports
module.exports = AttributeInterpreter;
},{"./Interpreter":6}],3:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var ForInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

ForInterpreter.prototype = Object.create(Interpreter.prototype);

ForInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'for')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), []);

    // Process
    var newElements = [];
    for(var i = 0; i < value.length; ++i)
    {
        newElements.push(command.target.createTemplate());
    }
    command.target.clear();

    for(var i = 0; i < value.length; ++i)
    {
        command.target.append(newElements[i]);
        command.application.refresh(newElements[i], value[i]);
    }

    return true;
};

// Exports
module.exports = ForInterpreter;
},{"./Interpreter":6}],4:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var IfInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

IfInterpreter.prototype = Object.create(Interpreter.prototype);

IfInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'if')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), false);

    // Process
    if (value)
    {
        command.target.show();
    } else {
        command.target.hide();
    }

    return true;
};

// Exports
module.exports = IfInterpreter;
},{"./Interpreter":6}],5:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var InputInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

InputInterpreter.prototype = Object.create(Interpreter.prototype);

InputInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'input')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), '');

    // Process
    command.target.setValue(value);

    (function (instance, application, variable, target) {
        command.target.on('change', function () {
            instance.storage.set(variable, target.getValue())
            application.refresh();
        });
    })(this, command.application, command.getArgument(0), command.target);

    return true;
};

// Exports
module.exports = InputInterpreter;
},{"./Interpreter":6}],6:[function(_dereq_,module,exports){
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
},{}],7:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var SaveInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

SaveInterpreter.prototype = Object.create(Interpreter.prototype);

SaveInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'save')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), 'undefined');

    // Process
    (function(application, instance) {
        command.target.on('click', function()
        {
            application.trigger('beforeSave', instance.storage);
            instance.storage.save();
            application.trigger('afterSave', instance.storage);
        });
    })(command.application, this)

    return true;
};

// Exports
module.exports = SaveInterpreter;
},{"./Interpreter":6}],8:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var TextInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

TextInterpreter.prototype = Object.create(Interpreter.prototype);

TextInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'text')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), 'undefined');

    // Process
    command.target.setHtml(value);

    return true;
};

// Exports
module.exports = TextInterpreter;
},{"./Interpreter":6}],9:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var UserDefinedInterpreter = function(storage, commandName, callback)
{
    Interpreter.call(this, storage);
    this.commandName = commandName;
    this.callback = callback;
};

UserDefinedInterpreter.prototype = Object.create(Interpreter.prototype);

UserDefinedInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != this.commandName)
    {
        return false;
    }

    // Process
    this.callback.call(this, command);

    return true;
};

// Exports
module.exports = UserDefinedInterpreter;
},{"./Interpreter":6}],10:[function(_dereq_,module,exports){
var Storage = _dereq_('./Storage');

var MockStorage = function(data)
{
    Storage.call(this);

    this.data = data || {};

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
},{"./Storage":11}],11:[function(_dereq_,module,exports){
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
},{}],12:[function(_dereq_,module,exports){
var Command = function(application, target, context, name, arguments)
{
    this.application = application;
    this.target = target;
    this.context = context;
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

},{}],13:[function(_dereq_,module,exports){
var Command = _dereq_('./Command');

var CommandParser = function()
{

};

CommandParser.prototype.parse = function(application, target, context, input)
{
    throw "Not implemented!";

    return new Command();
};

// Exports
module.exports = CommandParser;
},{"./Command":12}],14:[function(_dereq_,module,exports){
var CommandParser = _dereq_('./CommandParser');
var Command = _dereq_('./Command');

var SimpleCommandParser = function()
{
    CommandParser.call(this);
};

SimpleCommandParser.prototype = Object.create(CommandParser.prototype);

SimpleCommandParser.prototype.parse = function(application, target, context, input)
{
    var commandComponents = input.split(':');

    var commandName = commandComponents[0].trim();
    commandComponents.shift();
    var commandArguments = commandComponents.join(':').trim().split(',');

    return new Command(application, target, context, commandName, commandArguments);
};

// Exports
module.exports = SimpleCommandParser;
},{"./Command":12,"./CommandParser":13}],15:[function(_dereq_,module,exports){
var DocumentParser = function()
{

};

DocumentParser.prototype.parse = function(application, rootNode, context, hookName)
{
    throw "Not implemented!";
    return [];
};

// Exports
module.exports = DocumentParser;

},{}],16:[function(_dereq_,module,exports){
var NormalNode = function(node)
{
    this.node = $(node);
    this.template = this.node.clone();
};

NormalNode.prototype.append = function(content)
{
    this.node.append(content);
};

NormalNode.prototype.clear = function()
{
    this.setHtml('');
};

NormalNode.prototype.createTemplate = function()
{
    return this.template.children().clone().get(0);
};
NormalNode.prototype.getAttribute = function(name)
{
    return this.node.attr(name);
};
NormalNode.prototype.setAttribute = function(name, value)
{
    return this.node.attr(name, value);
};
NormalNode.prototype.getHtml = function()
{
    return this.node.html();
};
NormalNode.prototype.setHtml = function(htmlContent)
{
    this.node.html(htmlContent);
};
NormalNode.prototype.setValue = function(value)
{
    this.node.val(value);
};

NormalNode.prototype.getValue = function()
{
    return this.node.val();
};

NormalNode.prototype.hide = function()
{
    this.node.hide();
};

NormalNode.prototype.on = function(eventName, callback)
{
    this.node.on(eventName, callback);
};

NormalNode.prototype.show = function()
{
    this.node.show();
};

// Exports
module.exports = NormalNode;
},{}],17:[function(_dereq_,module,exports){
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

SimpleCommentParser.prototype.parse = function(application, rootNode, context, hookName)
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
                commands.push(application.commandParser.parse(application, new VirtualNode(scope.startNode, scope.contentNodes, scope.endNode), context, scope.commandString));
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
},{"./DocumentParser":15,"./VirtualNode":19}],18:[function(_dereq_,module,exports){
var DocumentParser = _dereq_('./DocumentParser');
var NormalNode = _dereq_('./NormalNode');

var SimpleDomParser = function()
{
    DocumentParser.call(this);

    this._seenNodes = [];
};

SimpleDomParser.prototype = Object.create(DocumentParser.prototype);

SimpleDomParser.prototype.parse = function(application, rootNode, context, hookName)
{
    var commands = [];

    var rootNodeAttribute = $(rootNode).attr('data-' + hookName);
    if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
    {
        commands.push(application.commandParser.parse(application, new NormalNode(rootNode), context, rootNodeAttribute));
    }
    $(rootNode).find('[data-' + hookName + ']').each(function (index, element) {
        commands.push(application.commandParser.parse(application, new NormalNode(element), context, $(element).attr('data-' + hookName)));
    });

    return commands;
};

// Exports
module.exports = SimpleDomParser;
},{"./DocumentParser":15,"./NormalNode":16}],19:[function(_dereq_,module,exports){
var VirtualNode = function (startComment, nodes, endComment)
{
    this.startComment = $(startComment);
    this.nodes = $(nodes);
    this.endComment = $(endComment);
    this.template = this.nodes.clone();
};

VirtualNode.prototype.append = function(content)
{
    this.endComment.before(content);
};

VirtualNode.prototype.clear = function()
{
    this.setHtml('');
};

VirtualNode.prototype.createTemplate = function()
{
    return this.template.clone().get(0);
};


VirtualNode.prototype.setAttribute = function()
{
    throw "Not available";
}
VirtualNode.prototype.getAttribute = function()
{
    throw "Not available";
}

VirtualNode.prototype.getHtml = function()
{
    throw "Not available";
}

VirtualNode.prototype.setHtml = function(htmlContent)
{
    this.nodes.remove();
    this.startComment.after(htmlContent);
};

VirtualNode.prototype.setValue = function(value)
{
    this.nodes.val(value);
};

VirtualNode.prototype.getValue = function()
{
    return this.nodes.val();
};

VirtualNode.prototype.hide = function()
{
    this.nodes.hide();
};

VirtualNode.prototype.on = function(eventName, callback)
{
    this.nodes.on(eventName, callback);
};

VirtualNode.prototype.show = function()
{
    this.nodes.show();
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
var AttributeInterpreter = _dereq_('./Execution/Interpreters/AttributeInterpreter');
var ForInterpreter = _dereq_('./Execution/Interpreters/ForInterpreter');
var IfInterpreter = _dereq_('./Execution/Interpreters/IfInterpreter');
var InputInterpreter = _dereq_('./Execution/Interpreters/InputInterpreter');
var SaveInterpreter = _dereq_('./Execution/Interpreters/SaveInterpreter');
var TextInterpreter = _dereq_('./Execution/Interpreters/TextInterpreter');
var UserDefinedInterpreter = _dereq_('./Execution/Interpreters/UserDefinedInterpreter');
var MockStorage = _dereq_('./Execution/Storages/MockStorage');

// exports
module.exports = {
    application: new Application([
        new SimpleCommentParser(),
        new SimpleDomParser()
    ], new SimpleCommandParser()),

    storage: new MockStorage(),

    addCommand: function(commandName, callback)
    {
        this.application.interpreters.push(new UserDefinedInterpreter(this.storage, commandName, callback));
    },

    on: function(event, callback)
    {
        this.application.on(event, callback);
    },

    off: function(event, callback)
    {
        this.application.off(event, callback);
    },

    trigger: function(event)
    {
        this.application.trigger(event);
    },

    fuse: function(rootNode, hookName, arguments)
    {
        // Format parameters
        rootNode || 'body';
        hookName = hookName || 'youme';
        arguments = arguments || {};

        // Build application
        this.application.rootNode = rootNode;
        this.application.hookName = hookName;
        var standardInterpreters = [
            new AttributeInterpreter(this.storage),
            new ForInterpreter(this.storage),
            new InputInterpreter(this.storage),
            new IfInterpreter(this.storage),
            new SaveInterpreter(this.storage),
            new TextInterpreter(this.storage)
        ]
        for(var i = 0, interpreter; interpreter = standardInterpreters[i]; ++i)
        {
            this.application.interpreters.push(interpreter);
        }
        return this.application.run(arguments);
    },

    createMockStorage: function(data)
    {
        return new MockStorage(data);
    }
};
},{"./Application":1,"./Execution/Interpreters/AttributeInterpreter":2,"./Execution/Interpreters/ForInterpreter":3,"./Execution/Interpreters/IfInterpreter":4,"./Execution/Interpreters/InputInterpreter":5,"./Execution/Interpreters/SaveInterpreter":7,"./Execution/Interpreters/TextInterpreter":8,"./Execution/Interpreters/UserDefinedInterpreter":9,"./Execution/Storages/MockStorage":10,"./Parsing/CommandParsers/SimpleCommandParser":14,"./Parsing/DocumentParsers/SimpleCommentParser":17,"./Parsing/DocumentParsers/SimpleDomParser":18}]},{},["u88BNT"])
("u88BNT")
});