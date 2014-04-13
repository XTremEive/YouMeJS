var Interpreter = require('./Interpreter');

var IfInterpreter = function(storage)
{
    Interpreter.call(this);

    this.storage = storage || null;
};

IfInterpreter.prototype = Object.create(Interpreter.prototype);

IfInterpreter.prototype.interpret = function(command)
{
    if (command.name != 'if')
    {
        return;
    }

    var value = this.storage.get(command.getArgument(0), false);

    if (value)
    {
        command.target.show();
    } else {
        command.target.hide();
    }
};

// Exports
module.exports = IfInterpreter;