// Require statements
var Interpreter = require('./Interpreter');

/**
 * The text interpreter set the HTML of a node based on the argument provided.
 * The main us of this interpreter is to display storage variable somewhere on the end-user page.
 *
 * @param storage A Storage object to take variables from.
 * @constructor
 */
var TextInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

TextInterpreter.prototype = new Interpreter();

TextInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'text')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), 'undefined');

    // Handle object representation
    if (value !== null && typeof value === 'object')
    {
        value = JSON.stringify(value);
    }

    // Process
    command.target.setHtml(value);

    return true;
};

// Exports
module.exports = TextInterpreter;