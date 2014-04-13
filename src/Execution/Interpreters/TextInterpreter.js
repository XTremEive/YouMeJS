var Interpreter = require('./Interpreter');

var TextInterpreter = function(storage)
{
    Interpreter.call(this);

    this.storage = storage || null;
};

TextInterpreter.prototype = Object.create(Interpreter.prototype);

TextInterpreter.prototype.interpret = function(command)
{
    var value = this.storage.get(command.getArgument(0), 'undefined');

    command.target.html(value);
};

// Exports
module.exports = TextInterpreter;