// Require statements
var Interpreter = require('./Interpreter');

/**
 * On click, this interpreter will trigger the save method of the given storage.
 *
 * @param storage A Storage object to save.
 * @constructor
 */
var SaveInterpreter = function(storage)
{
    Interpreter.call(this, storage);
};

SaveInterpreter.prototype = new Interpreter();

SaveInterpreter.prototype.interpret = function(command)
{
    // Discard any command that has nothing to do with this interpreter
    if (command.name != 'save')
    {
        return false;
    }

    // ...
    if (command.executionCount > 0)
    {
        return true;
    }

    // Process
    (function(application, instance) {
        command.target.on('click', function()
        {
            application.trigger('beforeSave', instance.storage);
            instance.storage.save();
            application.trigger('afterSave', instance.storage);
        });
    })(command.application, this)

    return true;
};

// Exports
module.exports = SaveInterpreter;