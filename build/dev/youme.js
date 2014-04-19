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
    this.commands = [];
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

Application.prototype.refresh = function(rootNode, context, depth)
{
    depth = depth || 0;
    rootNode = rootNode || this.rootNode;
    context = context || {};

    // Handle pre events
    if (depth == 0)
    {
        this.trigger('beforeRefresh', this);
    }

    // Parse
    var commands = depth == 0 ? this.commands : [];
    if (commands.length == 0)
    {
        for(var index = 0, documentParser; documentParser = this.documentParsers[index]; ++index)
        {
            var parsedCommands = documentParser.parse(this, rootNode, context, this.hookName);
            for(var i = 0; i < parsedCommands.length; ++i)
            {
                commands.push(parsedCommands[i]);
            }
        }
    }

    // Interpret
    for(var i = 0; i < commands.length; ++i)
    {
        // Interpret command
        for(var index = 0, interpreter; interpreter = this.interpreters[index]; ++index)
        {
            commands[i].wasInterpreted = interpreter.interpret(commands[i], depth) || commands[i].wasInterpreted;
        }

        // Send user feedback in case of unknown command
        if(this.debug && !commands[i].wasInterpreted)
        {
            console.log('YouMe WARNING: command ' + commands[i] +  ' unknown.');
        }
    }

    // Handle post events
    if (depth == 0)
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

var AttributeInterpreter = function(storage, conditionEvaluator)
{
    Interpreter.call(this, storage);

    this.conditionEvaluator = conditionEvaluator;
    this.conditionEvaluator.interpreter = this;
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
    var attributes = JSON.parse(command.getArgument(0));
    var conditions = JSON.parse(command.getArgument(1, "{}"));

    // Format parameters
    for(var i in attributes)
    {
        attributes[i] = attributes[i].trim();
    }

    for(var i in conditions)
    {
        conditions[i] = this.conditionEvaluator.evaluate(command.context, conditions[i].trim());
    }

    for(var attributeName in attributes)
    {
        var value = this.getValue(command.context, attributes[attributeName], attributes[attributeName]);
        var conditionValue = (attributeName in conditions) ? conditions[attributeName] : true;

        if (conditionValue)
        {
            command.target.setAttribute(attributeName, value);
        }
    }

    return true;
};

// Exports
module.exports = AttributeInterpreter;
},{"./Interpreter":8}],3:[function(_dereq_,module,exports){
var LogicEvaluator = _dereq_('./LogicEvaluator')

var ConditionEvaluator = function(interpreter)
{
    LogicEvaluator.call(this, interpreter);
};

ConditionEvaluator.prototype.evaluate = function(context, input)
{
    var result = true;
    var components = input.split(' ');
    var operator = '&&';

    for(var i = 0, component; component = components[i]; ++i)
    {
        component = component.trim();

        switch(component)
        {
            case '&&':
            case '||':
            case '>':
            case '<':
            case '>=':
            case '<=':
            case '==':
            case '!=':
                operator = component;
                break;
            default:
                if (component == "true")
                {
                    component = true;
                }
                else if (component == "false")
                {
                    component = false;
                }
                else {
                    component = this.interpreter.getValue(context, component, component);
                }

                switch(operator)
                {
                    case '==':
                        result = result == component;
                        break;
                    case '!=':
                        result = result != component;
                        break;
                    case '&&':
                        result = result && component;
                        break;
                    case '||':
                        result = result || component;
                        break;
                    case '>':
                        result = result > component;
                        break;
                    case '<':
                        result = result < component;
                        break;
                    case '>=':
                        result = result >= component;
                        break;
                    case '<=':
                        result = result <= component;
                        break;
                }

                break;
        }
    }

    return result;
};

// Exports
module.exports = ConditionEvaluator;
},{"./LogicEvaluator":4}],4:[function(_dereq_,module,exports){
var LogicEvaluator = function(interpreter)
{
    this.interpreter = interpreter || null;
};

LogicEvaluator.prototype.evaluate = function(context, input)
{
    throw "Not implemented!";

    return false;
};

// Exports
module.exports = LogicEvaluator;
},{}],5:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var ForInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

ForInterpreter.prototype = Object.create(Interpreter.prototype);

ForInterpreter.prototype.interpret = function(command, depth)
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
        var context = value[i];
        context.parent = command.context;
        context.loopIndex = i;

        // Create new node and interpret it
        command.target.append(newElements[i]);
        command.application.refresh(newElements[i], context, depth + 1);
    }

    return true;
};

// Exports
module.exports = ForInterpreter;
},{"./Interpreter":8}],6:[function(_dereq_,module,exports){
var Interpreter = _dereq_('./Interpreter');

var IfInterpreter = function(storage, conditionEvaluator)
{
    Interpreter.call(this, storage);

    this.conditionEvaluator = conditionEvaluator;
    this.conditionEvaluator.interpreter = this;
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
    var value = this.conditionEvaluator.evaluate(command.context, command.getArgument(0));

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
},{"./Interpreter":8}],7:[function(_dereq_,module,exports){
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
},{"./Interpreter":8}],8:[function(_dereq_,module,exports){
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
            if((context != null) && (typeof context == 'object') && (keyPathComponents.join('.') in context)) {
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
},{}],9:[function(_dereq_,module,exports){
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
},{"./Interpreter":8}],10:[function(_dereq_,module,exports){
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
},{"./Interpreter":8}],11:[function(_dereq_,module,exports){
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
},{"./Interpreter":8}],12:[function(_dereq_,module,exports){
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

MockStorage.prototype.has = function(key)
{
    return key in this.data;
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
},{"./Storage":13}],13:[function(_dereq_,module,exports){
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

Storage.prototype.has = function(key)
{
    throw "Not implemented!";

    return false;
};

Storage.prototype.save = function()
{
    throw "Not implemented!";

    return this;
};

// Exports
module.exports = Storage;
},{}],14:[function(_dereq_,module,exports){
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

},{}],15:[function(_dereq_,module,exports){
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
},{"./Command":14}],16:[function(_dereq_,module,exports){
var CommandParser = _dereq_('./CommandParser');
var Command = _dereq_('./Command');

var KeyValueCommandParser = function()
{
    CommandParser.call(this);
};

KeyValueCommandParser.prototype = Object.create(CommandParser.prototype);

KeyValueCommandParser.prototype.parse = function(application, target, context, input)
{
    // Create comment variables
    var commandComponents = input.split(':');

    var commandName = commandComponents[0].trim();
    commandComponents.shift();
    var commandArguments = commandComponents.join(':').split(',');

    // Format arguments
    for(var i = 0; i < commandArguments.length; ++i)
    {
        commandArguments[i] = commandArguments[i].trim();
    }

    // Return
    return new Command(application, target, context, commandName, commandArguments);
};

// Exports
module.exports = KeyValueCommandParser;
},{"./Command":14,"./CommandParser":15}],17:[function(_dereq_,module,exports){
var DocumentParser = _dereq_('./DocumentParser');
var VirtualNode = _dereq_('./Nodes/VirtualNode');

var CommentParser = function()
{
    DocumentParser.call(this);

    this.startCommentRegex = null;
    this.endCommentRegex = null;
    this._commentNodesHaveTextProperty = null;
};

CommentParser.prototype = Object.create(DocumentParser.prototype);

CommentParser.prototype.parse = function(application, rootNode, context, hookName)
{
    var commands = [];
    var self = this;

    $(rootNode).each(function(index, element) {
        var nodesToParse = [$(element).get(0)];

        // Initialize parsing parameters
        var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };
        self._commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";
        self._startCommentRegex = self._commentNodesHaveTextProperty ? new RegExp('^<!--\\s*' + hookName + '(?:\\s+([\\s\\S]+))?\\s*-->$')  : new RegExp('^\\s*' + hookName + '(?:\\s+([\\s\\S]+))?\\s*$');
        self._endCommentRegex =  self._commentNodesHaveTextProperty ? new RegExp('^<!--\\s*\/' + hookName + '\\s*-->$') : new RegExp('^\\s*\/' + hookName + '\\s*$');

        // Parsing
        var scopes = [];
        while(nodesToParse.length > 0)
        {
            var nodeToParse = nodesToParse.shift();

            switch(true)
            {
                case self.isStartComment(nodeToParse):
                    scopes.push({
                        startNode: nodeToParse,
                        commandString: self.getCommentValue(nodeToParse).substring(self.getCommentValue(nodeToParse).indexOf(hookName) + hookName.length, self.getCommentValue(nodeToParse).length).trim(),
                        contentNodes: [],
                        endNode: null
                    });
                    break;
                case self.isEndComment(nodeToParse):
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

            for(var i = 0, child; child = nodeToParse.childNodes[i]; ++i)
            {
                nodesToParse.push(child);
            }
        }
    });

    return commands;
};

CommentParser.prototype.isStartComment =  function (node) {
    return (node.nodeType == 8) && this._startCommentRegex.test(this.getCommentValue(node));
};

CommentParser.prototype.isEndComment = function (node) {
    return (node.nodeType == 8) && this._endCommentRegex.test(this.getCommentValue(node));
};

CommentParser.prototype.getCommentValue = function (node) {
  return this._commentNodesHaveTextProperty ? node.text : node.nodeValue;
};

// Exports
module.exports = CommentParser;
},{"./DocumentParser":18,"./Nodes/VirtualNode":21}],18:[function(_dereq_,module,exports){
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

},{}],19:[function(_dereq_,module,exports){
var DocumentParser = _dereq_('./DocumentParser');
var NormalNode = _dereq_('./Nodes/NormalNode');

var DomParser = function()
{
    DocumentParser.call(this);

    this._seenNodes = [];
};

DomParser.prototype = Object.create(DocumentParser.prototype);

DomParser.prototype.parse = function(application, rootNode, context, hookName)
{
    var commands = [];

    $(rootNode).each(function (index, element) {
        var rootNodeAttribute = $(element).attr('data-' + hookName);
        if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
        {
            commands.push(application.commandParser.parse(application, new NormalNode(element), context, rootNodeAttribute));
        }

        $(rootNode).find('[data-' + hookName + ']').each(function (index, element) {
            commands.push(application.commandParser.parse(application, new NormalNode(element), context, $(element).attr('data-' + hookName)));
        });
    });

    return commands;
};

// Exports
module.exports = DomParser;
},{"./DocumentParser":18,"./Nodes/NormalNode":20}],20:[function(_dereq_,module,exports){
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
    return this.template.children().clone();
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
},{}],21:[function(_dereq_,module,exports){
var VirtualNode = function (startComment, nodes, endComment)
{
    this.startComment = $(startComment);
    this.nodes = nodes;
    this.endComment = $(endComment);
    this.template = $(this.nodes).clone();
};

VirtualNode.prototype.append = function(content)
{
    var $content = content;
    this.endComment.before($content);
    this.nodes.push($content);
};

VirtualNode.prototype.clear = function()
{
    this.setHtml('');
};

VirtualNode.prototype.createTemplate = function()
{
    return this.template.clone();
};

VirtualNode.prototype.setAttribute = function(name, value)
{
    this.startComment.attr(name, value);
};

VirtualNode.prototype.getAttribute = function(name)
{
    return this.startComment.attr(name);
};

VirtualNode.prototype.getHtml = function()
{
    throw "Not available";
};

VirtualNode.prototype.setHtml = function(htmlContent)
{
    for(var i = 0; i < this.nodes.length; ++i)
    {
        $(this.nodes[i]).remove();
    }
    this.nodes = [];

    $content = $(htmlContent);
    this.startComment.after($content);
    this.nodes.push($content);
};

VirtualNode.prototype.setValue = function(value)
{
    for(var i = 0; i < this.nodes.length; ++i)
    {
        $(this.nodes[i]).val(value);
    }
};

VirtualNode.prototype.getValue = function()
{
    return $(this.nodes).val();
};

VirtualNode.prototype.hide = function()
{
    $(this.nodes).hide();
};

VirtualNode.prototype.on = function(eventName, callback)
{
    $(this.nodes).on(eventName, callback);
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
var CommentParser = _dereq_('./Parsing/DocumentParsers/CommentParser');
var DomParser = _dereq_('./Parsing/DocumentParsers/DomParser');
var KeyValueCommandParser = _dereq_('./Parsing/CommandParsers/KeyValueCommandParser');
var ConditionEvaluator = _dereq_('./Execution/Interpreters/Evaluators/ConditionEvaluator');
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
    // Object members

    application: new Application([
        new CommentParser(),
        new DomParser()
    ], new KeyValueCommandParser()),

    storage: new MockStorage(),

    // Storage related methods

    createMockStorage: function(data)
    {
        return new MockStorage(data);
    },
    set: function(key, value)
    {
        this.storage.set(key, value);
        this.application.refresh();

        return this;
    },
    unset: function(key)
    {
        this.storage.unset(key);
        this.application.refresh();

        return this;
    },
    get: function(key, defaultValue)
    {
        this.storage.get(key, defaultValue);

        return this;
    },
    has: function(key)
    {
        this.storage.has(key);

        return this;
    },
    save: function()
    {
        this.storage.save();

        return this;
    },

    // Application build related methods

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
            new AttributeInterpreter(this.storage, new ConditionEvaluator()),
            new ForInterpreter(this.storage),
            new InputInterpreter(this.storage),
            new IfInterpreter(this.storage, new ConditionEvaluator()),
            new SaveInterpreter(this.storage),
            new TextInterpreter(this.storage)
        ]
        for(var i = 0, interpreter; interpreter = standardInterpreters[i]; ++i)
        {
            this.application.interpreters.push(interpreter);
        }
        return this.application.run(arguments);
    }
};
},{"./Application":1,"./Execution/Interpreters/AttributeInterpreter":2,"./Execution/Interpreters/Evaluators/ConditionEvaluator":3,"./Execution/Interpreters/ForInterpreter":5,"./Execution/Interpreters/IfInterpreter":6,"./Execution/Interpreters/InputInterpreter":7,"./Execution/Interpreters/SaveInterpreter":9,"./Execution/Interpreters/TextInterpreter":10,"./Execution/Interpreters/UserDefinedInterpreter":11,"./Execution/Storages/MockStorage":12,"./Parsing/CommandParsers/KeyValueCommandParser":16,"./Parsing/DocumentParsers/CommentParser":17,"./Parsing/DocumentParsers/DomParser":19}]},{},["u88BNT"])
("u88BNT")
});