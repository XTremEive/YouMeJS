// Require statements
var NormalNode = require('./Nodes/NormalNode');

/**
 * The document parser constructs a set of commands based on HTMLElements in the DOM.
 *
 * @constructor
 */
var DocumentParser = function()
{
};

DocumentParser.prototype.parse = function(application, rootNode, context, hookName)
{
    var commands = [];

    application.$(rootNode).each(function (index, element) {
        var rootNodeAttribute = application.$(element).attr('data-' + hookName);
        if (typeof rootNodeAttribute !== 'undefined' && rootNodeAttribute !== false)
        {
            var parsedCommands = application.commandParser.parse(application, new NormalNode(application.$, element), context, rootNodeAttribute);
            for(var i = 0; i < parsedCommands.length; ++i)
            {
                commands.push(parsedCommands[i]);
            }
        }

        application.$(element).find('[data-' + hookName + ']').each(function (index, element) {
            var parsedCommands = application.commandParser.parse(application, new NormalNode(application.$, element), context, application.$(element).attr('data-' + hookName));
            for(var i = 0; i < parsedCommands.length; ++i)
            {
                commands.push(parsedCommands[i]);
            }
        });
    });

    return commands;
};

// Exports
module.exports = DocumentParser;