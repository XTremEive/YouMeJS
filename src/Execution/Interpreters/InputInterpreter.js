var Interpreter = require('./Interpreter');

var InputInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

InputInterpreter.prototype = Object.create(Interpreter.prototype);

InputInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'input')
    {
        return false;
    }

    // Get value from storage
    var value = this.getValue(command.context, command.getArgument(0), '');

    // Process
    command.target.setValue(value);

    (function (instance, variable, target) {
        command.target.on('change', function () {
            instance.storage.set(variable, target.getValue())
        });
    })(this, command.getArgument(0), command.target);

    return true;
};

// Exports
module.exports = InputInterpreter;