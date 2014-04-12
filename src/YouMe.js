var Application = require('./Application');
var SimpleDomParser = require('./Parsing/DocumentParsers/SImpleDomParser');
var SimpleCommandParser = require('./Parsing/CommandParsers/SimpleCommandParser');
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