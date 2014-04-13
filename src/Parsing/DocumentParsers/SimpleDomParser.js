var DocumentParser = require('./DocumentParser');
var NormalNode = require('./NormalNode');

var SimpleDomParser = function()
{
    DocumentParser.call(this);

    this._seenNodes = [];
};

SimpleDomParser.prototype = Object.create(DocumentParser.prototype);

SimpleDomParser.prototype.parse = function(commandParser, rootNode, hookName)
{
    var commands = [];

    var rootNodeAttribute = $(rootNode).attr('data-' + hookName);
    if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
    {
        commands.push(commandParser.parse(rootNode, rootNodeAttribute));
    }
    $(rootNode).find('[data-' + hookName + ']').each(function (index, element) {
        commands.push(commandParser.parse(new NormalNode(element), $(element).attr('data-' + hookName)));
    });

    return commands;
};

// Exports
module.exports = SimpleDomParser;