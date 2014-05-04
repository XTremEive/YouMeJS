// Require statements
var VirtualNode = require('./Nodes/VirtualNode');

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

    application.$(rootNode).each(function(index, element) {
        var nodesToParse = [application.$(element).get(0)];

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
                    var parsedCommands = application.commandParser.parse(application, new VirtualNode(application.$, scope.startNode, scope.contentNodes, scope.endNode), context, scope.commandString);
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