var Application = require('./Application');
var SimpleCommentParser = require('./Parsing/DocumentParsers/SimpleCommentParser');
var SimpleDomParser = require('./Parsing/DocumentParsers/SimpleDomParser');
var SimpleCommandParser = require('./Parsing/CommandParsers/SimpleCommandParser');
var ForInterpreter = require('./Execution/Interpreters/ForInterpreter');
var IfInterpreter = require('./Execution/Interpreters/IfInterpreter');
var SaveInterpreter = require('./Execution/Interpreters/SaveInterpreter');
var TextInterpreter = require('./Execution/Interpreters/TextInterpreter');
var MockStorage = require('./Execution/Storages/MockStorage');

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
                new ForInterpreter(storage),
                new IfInterpreter(storage),
                new SaveInterpreter(storage),
                new TextInterpreter(storage)
            ], hookName, rootNode)
            .run(arguments);
    },
    createMockStorage: function(data)
    {
        return new MockStorage(data);
    }
};