var Application = require('./Application');
var SimpleCommentParser = require('./Parsing/DocumentParsers/SimpleCommentParser');
var SimpleDomParser = require('./Parsing/DocumentParsers/SimpleDomParser');
var SimpleCommandParser = require('./Parsing/CommandParsers/SimpleCommandParser');
var ForInterpreter = require('./Execution/Interpreters/ForInterpreter');
var IfInterpreter = require('./Execution/Interpreters/IfInterpreter');
var InputInterpreter = require('./Execution/Interpreters/InputInterpreter');
var SaveInterpreter = require('./Execution/Interpreters/SaveInterpreter');
var TextInterpreter = require('./Execution/Interpreters/TextInterpreter');
var MockStorage = require('./Execution/Storages/MockStorage');

// exports
module.exports = {
    application: new Application([
        new SimpleCommentParser(),
        new SimpleDomParser()
    ], new SimpleCommandParser()),

    storage: new MockStorage(),

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
        this.application.interpreters = [
            new ForInterpreter(this.storage),
            new InputInterpreter(this.storage),
            new IfInterpreter(this.storage),
            new SaveInterpreter(this.storage),
            new TextInterpreter(this.storage)
        ];
        this.application.rootNode = rootNode;
        this.application.hookName = hookName;
        return this.application.run(arguments);
    },

    createMockStorage: function(data)
    {
        return new MockStorage(data);
    }
};