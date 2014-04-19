var Application = require('./Application');
var CommentParser = require('./Parsing/DocumentParsers/CommentParser');
var DomParser = require('./Parsing/DocumentParsers/DomParser');
var KeyValueCommandParser = require('./Parsing/CommandParsers/KeyValueCommandParser');
var ConditionEvaluator = require('./Execution/Interpreters/Evaluators/ConditionEvaluator');
var AttributeInterpreter = require('./Execution/Interpreters/AttributeInterpreter');
var ForInterpreter = require('./Execution/Interpreters/ForInterpreter');
var IfInterpreter = require('./Execution/Interpreters/IfInterpreter');
var InputInterpreter = require('./Execution/Interpreters/InputInterpreter');
var SaveInterpreter = require('./Execution/Interpreters/SaveInterpreter');
var TextInterpreter = require('./Execution/Interpreters/TextInterpreter');
var UserDefinedInterpreter = require('./Execution/Interpreters/UserDefinedInterpreter');
var MockStorage = require('./Execution/Storages/MockStorage');

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