var DocumentParser = require('./DocumentParser');
var NormalNode = require('./Nodes/NormalNode');

var DomParser = function()
{
    DocumentParser.call(this);

    this._seenNodes = [];
};

DomParser.prototype = Object.create(DocumentParser.prototype);

DomParser.prototype.parse = function(application, rootNode, context, hookName)
{
    var commands = [];

    $(rootNode).each(function (index, element) {
        var rootNodeAttribute = $(element).attr('data-' + hookName);
        if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
        {
            commands.push(application.commandParser.parse(application, new NormalNode(element), context, rootNodeAttribute));
        }

        $(rootNode).find('[data-' + hookName + ']').each(function (index, element) {
            commands.push(application.commandParser.parse(application, new NormalNode(element), context, $(element).attr('data-' + hookName)));
        });
    });

    return commands;
};

// Exports
module.exports = DomParser;