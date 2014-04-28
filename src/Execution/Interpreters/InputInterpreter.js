// Require statements
var Interpreter = require('./Interpreter');

/**
 * The InputInterpreter is specially geared for Node targetting form elements as it binds their values to a storage
 * variable.
 *
 * @param storage A Storage class.
 * @constructor
 */
var InputInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

InputInterpreter.prototype = new Interpreter();

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

    (function (instance, application, variable, target) {
        command.target.on('change', function () {
            instance.storage.set(variable, target.getValue())
            application.refresh();
        });
    })(this, command.application, command.getArgument(0), command.target);

    return true;
};

// Exports
module.exports = InputInterpreter;