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
    application: new Application([
        new CommentParser(),
        new DomParser()
    ], new KeyValueCommandParser()),

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
    },

    createMockStorage: function(data)
    {
        return new MockStorage(data);
    }
};