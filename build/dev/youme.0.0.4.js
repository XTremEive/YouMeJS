!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.YouMe=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * The application class is simply the main class of YouMe.
 * This is the class which will be first "run" on the end-user webpage and will inject your logic.
 * But to do so it depends on some components.
 *
 * @param documentParsers An array of DocumentParser used to parse client's webpage.
 * @param commandParser An instance of a CommandParser used to parse command strings.
 * @param interpreters An array of interpreters used to execute parsed commands and run business logic.
 * @param hookName This is the name of the hook define by the web widget developper
 * @param rootNode This is the starting node (or the set of starting nodes) to begin our parsing.
 * @constructor
 */
var Application = function (documentParsers, commandParser, interpreters, hookName, rootNode)
{
    this.documentParsers = documentParsers || [];
    this.commandParser = commandParser || null;
    this.interpreters = interpreters || [];
    this.hookName = hookName || 'missingHookName'
    this.rootNode = rootNode || 'body';
    this.debug = false;
    this.listeners = {};
    this.initialCommands = [];
};

// Event management

/**
 * Add an event listener.
 *
 * @param event the event's name
 * @param callback a callback to run when the event is triggered.
 * @returns {Application} This
 */
Application.prototype.on = function(event, callback)
{
    // Maintain listeners index
    if (!(event in this.listeners))
    {
        this.listeners[event] = [];
    }

    // Add the listenenr
    this.listeners[event].push(callback);

    // Return
    return this;
};

/**
 * Remove an event listener.
 *
 * @param event The even'ts name
 * @param callback The callback to be removed. If omitted all listeners to the given event will be removed.
 * @returns {Application} This
 */
Application.prototype.off = function(event, callback)
{
    // Format arguments
    callback = callback || null;

    // Handle non-existing event
    if (!(event in this.listeners))
    {
        return;
    }

    // Remove all listeners in case of null callback
    if (null === callback)
    {
        delete this.listeners[event];
        return;
    }

    // Remove a specific listener
    for(var i = 0; i < this.listeners[event].length; ++i)
    {
        if (this.listeners[event][i] == callback)
        {
            delete this.listeners[event][i];
            return;
        }
    }

    // Return
    return this;
};

/**
 * Trigger an event. All listener currently listening to the given event will be triggered.
 *
 * @param event The event's name
 * @param arguements The event's arguments.
 */
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

// Application's life cycle

/**
 * Start the application.
 *
 * @param givenArguments An object representing arguments.
 * @returns {Application} This
 */
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

/**
 * Refreshed the whole page (application) or a part of it. What I mean by refresh is re-parsing (if necessary) and re-interpreting a part of the page with new data (maybe).
 *
 * @param rootNode The node where we should start refreshing.
 * @param context A refresh context, accessible for interpreters. Can contains context specifics variable.
 * @param depth The current refresh depth, used to control recursion.
 */
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
    var commands = depth == 0 ? this.initialCommands : [];
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

// Exports
module.exports = Application;

},{}],2:[function(_dereq_,module,exports){
// Require statements
var Interpreter = _dereq_('./Interpreter');

/**
 * Attrbiuts interpreter will change a set of HTMLAttribute on the targeted Node.
 * The value of the attribute can be take from storage, but can also be plain strings.
 * Additionally the end user can provide a set of condition to bring logic the the attribute injection.
 *
 * @param storage A Storage object
 * @param conditionEvaluator A helper class to handle the condition evaluation logic.
 * @constructor
 */
var AttributeInterpreter = function(storage, conditionEvaluator)
{
    Interpreter.call(this, storage);

    this.conditionEvaluator = conditionEvaluator;
};

AttributeInterpreter.prototype = new Interpreter();

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
        conditions[i] = this.conditionEvaluator.evaluate(this, command.context, conditions[i].trim());
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
},{"./Interpreter":7}],3:[function(_dereq_,module,exports){
/**
 * This a basic condition evaluator. It should be improved to be honest.
 * But it allows the end user to write simple logical expressions.
 * This class is mean to be used within an interpreter as it works with interpreter's varaibles.
 *
 * @param interpreter An Interpreter object.
 * @constructor
 */
var ConditionEvaluator = function()
{
};

/**
 * Evaluate a logical expression using the bound interpreter, its storage and a given context. And will return TRUE or FALSE..
 *
 * @param interpreter An interpreter to use in the evaluation.
 * @param context An evaluation context.
 * @param input The string to parse and evaluate as TRUE or FALSE.
 * @returns {boolean}
 */
ConditionEvaluator.prototype.evaluate = function(interpreter, context, input)
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
                    component = interpreter.getValue(context, component, component);
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
},{}],4:[function(_dereq_,module,exports){
// Require statements
var Interpreter = _dereq_('./Interpreter');

/**
 * The ForInterpreter create loops. it will duplicated the child element of a node based on a variable stored in the Storage.
 * Those newly created child node will be parsed and interpreted by the application within a context.
 *
 * @param storage A Storage boejct.
 * @constructor
 */
var ForInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

ForInterpreter.prototype = new Interpreter();

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
        context._parent = command.context;
        context._loopIndex = i;
        context._loopLength = value.length;

        // Create new node and interpret it
        command.target.append(newElements[i]);
        command.application.refresh(newElements[i], context, depth + 1);
    }

    return true;
};

// Exports
module.exports = ForInterpreter;
},{"./Interpreter":7}],5:[function(_dereq_,module,exports){
// Require statements
var Interpreter = _dereq_('./Interpreter');

/**
 * This interpreter will show or hide a node (or a set of node) based on a condition.
 * Condition operand can be take from storage, context or can just be plain strings.
 *
 * @param storage A Storage class
 * @param conditionEvaluator A ConditionEvaluator to help with logic parsing.
 * @constructor
 */
var IfInterpreter = function(storage, conditionEvaluator)
{
    Interpreter.call(this, storage);

    this.conditionEvaluator = conditionEvaluator;
    this.conditionEvaluator.interpreter = this;
};

IfInterpreter.prototype = new Interpreter();

IfInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'if')
    {
        return false;
    }

    // Get value from storage
    var value = this.conditionEvaluator.evaluate(this, command.context, command.getArguments().join(' '));

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
},{"./Interpreter":7}],6:[function(_dereq_,module,exports){
// Require statements
var Interpreter = _dereq_('./Interpreter');

/**
 * The InputInterpreter is specially geared for Node targetting form elements as it binds their values to a storage
 * variable.
 *
 * @param storage A Storage class.
 * @constructor
 */
var InputInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

InputInterpreter.prototype = new Interpreter();

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
},{"./Interpreter":7}],7:[function(_dereq_,module,exports){
/**
 * Interpreter objects are the one doing the job of taking one command an running the logic on HTMLNode and Storage class.
 *
 * @param storage
 * @constructor
 */
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
 * might get resolved in the object itself.
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
},{}],8:[function(_dereq_,module,exports){
// Require statements
var Interpreter = _dereq_('./Interpreter');

/**
 * On click, this interpreter will trigger the save method of the given storage.
 *
 * @param storage A Storage object to save.
 * @constructor
 */
var SaveInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

SaveInterpreter.prototype = new Interpreter();

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
},{"./Interpreter":7}],9:[function(_dereq_,module,exports){
// Require statements
var Interpreter = _dereq_('./Interpreter');

/**
 * The text interpreter set the HTML of a node based on the argument provided.
 * The main us of this interpreter is to display storage variable somewhere on the end-user page.
 *
 * @param storage A Storage object to take variables from.
 * @constructor
 */
var TextInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

TextInterpreter.prototype = new Interpreter();

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
    command.target.setHtml(value + "");

    return true;
};

// Exports
module.exports = TextInterpreter;
},{"./Interpreter":7}],10:[function(_dereq_,module,exports){
// Require statements
var Interpreter = _dereq_('./Interpreter');

/**
 * The UserDefined interpreter class is simply an interpreter which work based on a callbck.
 * So why is it not "CallbackInterpreter" well the callback is usually provided by this library user through Application.addCommand() method.
 *
 * @param storage A Storage object
 * @param commandName The commandName to handle
 * @param callback The callback to execute.
 * @constructor
 */
var UserDefinedInterpreter = function(storage, commandName, callback)
{
    Interpreter.call(this, storage);

    this.commandName = commandName;
    this.callback = callback;
};

UserDefinedInterpreter.prototype = new Interpreter();

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
},{"./Interpreter":7}],11:[function(_dereq_,module,exports){
/**
 * The Mock storage is the default storage provided by our library. It's their for the sake of providing a sandbox
 * for testing the library. A web widget developer will typically write a class which looks like this one.
 *
 * @param data
 * @constructor
 */
var MockStorage = function(data)
{
    this.data = data || {};
};

/**
 * Set a value in this storage.
 * Additionally you can a do a "flag" set, by calling set with only one parameter. The value will be set to one.
 * @param key The name of the variable to set in the storage.
 * @param value The value to store in the set varaible.
 * @returns {MockStorage} This
 */
MockStorage.prototype.set = function(key, value)
{
    // Handle "flag" set.
    if (1 == arguments.length)
    {
        value = 1;
    }

    // Store the value
    this.data[key] = value;

    // Return
    return this;
};

/**
 * Get a value from this storage. If not found it will return the provided defaultValue
 * @param key The name of the variable to retrieve from this storage.
 * @param defaultValue A default value to return if the variable wasn't found. (optional)
 * @returns {*} The stored variable.
 */
MockStorage.prototype.get = function(key, defaultValue)
{
    return this.data[key] ? this.data[key] : defaultValue;
};

/**
 * Return whether this storage contains the given variable or not.
 * @param key The name of the variable to check.
 * @returns {boolean} TRUE if the variable exists, FALSE otherwise.
 */
MockStorage.prototype.has = function(key)
{
    return key in this.data;
};

/**
 * Delete a varaible from this storage.
 * @param key The name of the variable to delete.
 * @returns {MockStorage} This
 */
MockStorage.prototype.unset = function(key)
{
    delete this.data[key];

    return this;
};

/**
 * Persist the storage.
 *
 * @returns {MockStorage}
 */
MockStorage.prototype.save = function()
{
    var message = "YouMe's MockStorage is now saving: " + JSON.stringify(this.data);

    alert(message);
    console.log(message);

    return this;
};

// Exports
module.exports = MockStorage;
},{}],12:[function(_dereq_,module,exports){
/**
 * Command objects store all elements which might be useful to Interpreter classes in order to do their job.
 *
 * @param application Our main application
 * @param target The target on which the command should be appllied
 * @param context The context of the command: A set of variable (for instance in a "for" loop, the context would be the current element and index...)
 * @param name The name of the command.
 * @param arguments The parameters of this command.
 * @constructor
 */
var Command = function(application, target, context, name, arguments)
{
    this.application = application;
    this.target = target;
    this.context = context;
    this.name = name || '';
    this.arguments = arguments || {};
    this.wasInterpreted  = false;
};

/**
 * Get an argument's value specifying its name or index.
 *
 * @param index The index of the argument.
 * @param defaultValue A default value to return if the argument wasn't found.
 * @returns {*}
 */
Command.prototype.getArgument = function(index, defaultValue)
{
    // Try to find the argument by its name.
    if (index in this.arguments)
    {
        return this.arguments[index];
    }

    // Try to find the argument by its index.
    var argumentIndex = 0;
    for(var argumentKey in this.arguments)
    {
        if (argumentIndex == index)
        {
            return this.arguments[argumentIndex];
        }
        ++argumentIndex;
    }

    // Return the default value otherwise.
    return defaultValue;
};

Command.prototype.getArguments = function()
{
    var arrayArguments = [];

    for(var name in this.arguments)
    {
        arrayArguments.push(this.arguments[name]);
    }

    return arrayArguments;
};

Command.prototype.toString = function()
{
    return this.name + '(' + JSON.stringify(this.arguments) + ')';
};

// Exports
module.exports = Command;

},{}],13:[function(_dereq_,module,exports){
// Require statements
var Command = _dereq_('./Command');

/**
 * The command parser class helps DocumentParser and CommentParser classes in building comments.
 * Its role is simply to take a string representation of the command (what the end-user will write on its webpage) and create a command object.
 *
 * @constructor
 */
var CommandParser = function()
{
};

/**
 * Parse a string and obtain a Command object to be used during the interpretation phase.
 * @param application Our application
 * @param target The target node which will as the command's target.
 * @param context A context for the command.
 * @param input The string to parse.
 * @returns {array} An array of new command objects
 */
CommandParser.prototype.parse = function(application, target, context, input)
{
    var commands = [];
    var commandString = "";
    var jsonDepth = 0;
    for(var i = 0; i < input.length; ++i)
    {
        var character = input[i];

        switch(character)
        {
            case '{':
                ++jsonDepth;
                commandString += character;
                break;
            case '}':
                --jsonDepth;
                commandString += character;
                break;
            case ',':
                if (jsonDepth == 0)
                {
                    commands.push(this.parseCommandString(application, target, context, commandString));
                    commandString = "";
                } else {
                    commandString += character;
                }
                break;
            default:
                commandString += character;
                break;
        }
    }
    commands.push(this.parseCommandString(application, target, context, commandString));

    return commands;
};

CommandParser.prototype.parseCommandString = function(application, target, context, input)
{
    // Create command's variables
    var commandComponents = input.split(':');
    var commandName = commandComponents.shift().trim();
    var commandArguments = [];
    var argumentsString = commandComponents.join(':');
    var argumentString = "";
    var jsonDepth = 0;

    // parse arguments
    for(var i = 0; i < argumentsString.length; ++i)
    {
        var character = argumentsString[i];

        switch(character)
        {
            case '{':
                ++jsonDepth;
                argumentString += character;
                break;
            case '}':
                --jsonDepth;
                argumentString += character;
                break;
            case ' ':
                if (jsonDepth == 0)
                {
                   if (argumentString.length != 0)
                   {
                       commandArguments.push(argumentString);
                   }
                    argumentString = "";
                } else {
                    argumentString += character;
                }
                break;
            default:
                argumentString += character;
                break;
        }
    }

    if (argumentString.length != 0)
    {
        commandArguments.push(argumentString);
    }

    // Return
    return new Command(application, target, context, commandName, commandArguments);
};

// Exports
module.exports = CommandParser;
},{"./Command":12}],14:[function(_dereq_,module,exports){
// Require statements
var VirtualNode = _dereq_('./Nodes/VirtualNode');

/**
 * The comment parser construct set of commands based on HTML comments. To do it rely on the VirtualNode class.
 *
 * @constructor
 */
var CommentParser = function()
{
    this.startCommentRegex = null;
    this.endCommentRegex = null;
    this._commentNodesHaveTextProperty = null;
};

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
                    var parsedCommands = application.commandParser.parse(application, new VirtualNode(scope.startNode, scope.contentNodes, scope.endNode), context, scope.commandString);
                    for(var i = 0; i < parsedCommands.length; ++i)
                    {
                        commands.push(parsedCommands[i]);
                    }
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
},{"./Nodes/VirtualNode":17}],15:[function(_dereq_,module,exports){
// Require statements
var NormalNode = _dereq_('./Nodes/NormalNode');

/**
 * The document parser constructs a set of commands based on HTMLElements in the DOM.
 *
 * @constructor
 */
var DocumentParser = function()
{
};

DocumentParser.prototype.parse = function(application, rootNode, context, hookName)
{
    var commands = [];

    $(rootNode).each(function (index, element) {
        var rootNodeAttribute = $(element).attr('data-' + hookName);
        if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
        {
            var parsedCommands = application.commandParser.parse(application, new NormalNode(element), context, rootNodeAttribute);
            for(var i = 0; i < parsedCommands.length; ++i)
            {
                commands.push(parsedCommands[i]);
            }
        }

        $(rootNode).find('[data-' + hookName + ']').each(function (index, element) {
            var parsedCommands = application.commandParser.parse(application, new NormalNode(element), context, $(element).attr('data-' + hookName));
            for(var i = 0; i < parsedCommands.length; ++i)
            {
                commands.push(parsedCommands[i]);
            }
        });
    });

    return commands;
};

// Exports
module.exports = DocumentParser;
},{"./Nodes/NormalNode":16}],16:[function(_dereq_,module,exports){
/**
 *
 * This class represents a node created from a simple (or a set of simple) HTMLElements.
 * A node is basically a DOM abstraction that our library will consider as the lowest component of a web page.
 * They basically abstract DOM manipulation.
 *
 * @param node An HTMLElement
 * @constructor
 */
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
},{}],17:[function(_dereq_,module,exports){
/**
 *
 * This class represents a node created from an HTML comment (Knockout's style).
 * A node is basically a DOM abstraction that our library will consider as the lowest component of a web page.
 * They basically abstract DOM manipulation.
 *
 * @param node An HTMLElement
 * @constructor
 */
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
// Require statements
var Application = _dereq_('./Application');
var CommentParser = _dereq_('./Parsing/DocumentParsers/CommentParser');
var DocumentParser = _dereq_('./Parsing/DocumentParsers/DocumentParser');
var CommandParser = _dereq_('./Parsing/CommandParsers/CommandParser');
var ConditionEvaluator = _dereq_('./Execution/Interpreters/ConditionEvaluator');
var AttributeInterpreter = _dereq_('./Execution/Interpreters/AttributeInterpreter');
var ForInterpreter = _dereq_('./Execution/Interpreters/ForInterpreter');
var IfInterpreter = _dereq_('./Execution/Interpreters/IfInterpreter');
var InputInterpreter = _dereq_('./Execution/Interpreters/InputInterpreter');
var SaveInterpreter = _dereq_('./Execution/Interpreters/SaveInterpreter');
var TextInterpreter = _dereq_('./Execution/Interpreters/TextInterpreter');
var UserDefinedInterpreter = _dereq_('./Execution/Interpreters/UserDefinedInterpreter');
var MockStorage = _dereq_('./Execution/Storages/MockStorage');

// exports
module.exports = function(storage)
{
    return {
        // Object members

        application: new Application([
            new CommentParser(),
            new DocumentParser()
        ], new CommandParser()),

        storage: storage || new MockStorage(),

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

        // Event management

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

        // Application related methods

        addCommand: function(commandName, callback)
        {
            this.application.interpreters.push(new UserDefinedInterpreter(this.storage, commandName, callback));
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
};
},{"./Application":1,"./Execution/Interpreters/AttributeInterpreter":2,"./Execution/Interpreters/ConditionEvaluator":3,"./Execution/Interpreters/ForInterpreter":4,"./Execution/Interpreters/IfInterpreter":5,"./Execution/Interpreters/InputInterpreter":6,"./Execution/Interpreters/SaveInterpreter":8,"./Execution/Interpreters/TextInterpreter":9,"./Execution/Interpreters/UserDefinedInterpreter":10,"./Execution/Storages/MockStorage":11,"./Parsing/CommandParsers/CommandParser":13,"./Parsing/DocumentParsers/CommentParser":14,"./Parsing/DocumentParsers/DocumentParser":15}]},{},["u88BNT"])
("u88BNT")
});