var DocumentParser = require('./DocumentParser');
var NormalNode = require('./NormalNode');

var SimpleDomParser = function()
{
    DocumentParser.call(this);

    this._seenNodes = [];
};

SimpleDomParser.prototype = Object.create(DocumentParser.prototype);

SimpleDomParser.prototype.parse = function(application, rootNode, context, hookName)
{
    var commands = [];

    var rootNodeAttribute = $(rootNode).attr('data-' + hookName);
    if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
    {
        commands.push(application.commandParser.parse(application, new NormalNode(rootNode), context, rootNodeAttribute));
    }
    $(rootNode).find('[data-' + hookName + ']').each(function (index, element) {
        commands.push(application.commandParser.parse(application, new NormalNode(element), context, $(element).attr('data-' + hookName)));
    });

    return commands;
};

// Exports
module.exports = SimpleDomParser;