var DocumentParser = require('./DocumentParser');
var VirtualNode = require('./VirtualNode');

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