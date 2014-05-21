// Require statements
var Application = require('./Application');
var CommentParser = require('./Parsing/DocumentParsers/CommentParser');
var DocumentParser = require('./Parsing/DocumentParsers/DocumentParser');
var CommandParser = require('./Parsing/CommandParsers/CommandParser');
var ConditionEvaluator = require('./Execution/Interpreters/ConditionEvaluator');
var AttributeInterpreter = require('./Execution/Interpreters/AttributeInterpreter');
var ForInterpreter = require('./Execution/Interpreters/ForInterpreter');
var IfInterpreter = require('./Execution/Interpreters/IfInterpreter');
var InputInterpreter = require('./Execution/Interpreters/InputInterpreter');
var SaveInterpreter = require('./Execution/Interpreters/SaveInterpreter');
var TextInterpreter = require('./Execution/Interpreters/TextInterpreter');
var UserDefinedInterpreter = require('./Execution/Interpreters/UserDefinedInterpreter');
var MockStorage = require('./Execution/Storages/MockStorage');

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
        refresh: function()
        {
            this.application.refresh();

            return this;
        },
        set: function(key, value)
        {
            this.storage.set(key, value);
            this.refresh();

            return this;
        },
        unset: function(key)
        {
            this.storage.unset(key);
            this.refresh();

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

            return this;
        },
        off: function(event, callback)
        {
            this.application.off(event, callback);

            return this;
        },
        trigger: function(event)
        {
            this.application.trigger(event);
        },

        // Application related methods

        addCommand: function(commandName, callback)
        {
            this.application.addInterpreter(new UserDefinedInterpreter(this.storage, commandName, callback));

            return this;
        },
        addScriptDependency: function(url, check, success)
        {
            // Format parameters
            check = check || function() {return true;}

            this.application.addDependency('script', url, check, success);

            return this;
        },
        addStyleDependency: function(url, check, success)
        {
            // Format parameters
            check = check || function() {return true;}

            this.application.addDependency('style', url, check, success);

            return this;
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
