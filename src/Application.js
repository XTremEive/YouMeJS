/**
 * The application class is simply the main class of YouMe.
 * This is the class which will be first "run" on the end-user webpage and will inject your logic.
 * But to do so it depends on some components.
 *
 * @param documentParsers An array of DocumentParser used to parse client's webpage.
 * @param commandParser An instance of a CommandParser used to parse command strings.
 * @param interpreters An array of interpreters used to execute parsed commands and run business logic.
 * @param hookName This is the name of the hook define by the web widget developper
 * @param rootNode This is the starting node (or the set of starting nodes) to begin our parsing.
 * @constructor
 */
var Application = function (documentParsers, commandParser, interpreters, hookName, rootNode)
{
    this.documentParsers = documentParsers || [];
    this.commandParser = commandParser || null;
    this.interpreters = interpreters || [];
    this.hookName = hookName || 'missingHookName'
    this.rootNode = rootNode || 'body';
    this.debug = false;
    this.listeners = {};
    this.initialCommands = [];
};

// Event management

/**
 * Add an event listener.
 *
 * @param event the event's name
 * @param callback a callback to run when the event is triggered.
 * @returns {Application} This
 */
Application.prototype.on = function(event, callback)
{
    // Maintain listeners index
    if (!(event in this.listeners))
    {
        this.listeners[event] = [];
    }

    // Add the listenenr
    this.listeners[event].push(callback);

    // Return
    return this;
};

/**
 * Remove an event listener.
 *
 * @param event The even'ts name
 * @param callback The callback to be removed. If omitted all listeners to the given event will be removed.
 * @returns {Application} This
 */
Application.prototype.off = function(event, callback)
{
    // Format arguments
    callback = callback || null;

    // Handle non-existing event
    if (!(event in this.listeners))
    {
        return;
    }

    // Remove all listeners in case of null callback
    if (null === callback)
    {
        delete this.listeners[event];
        return;
    }

    // Remove a specific listener
    for(var i = 0; i < this.listeners[event].length; ++i)
    {
        if (this.listeners[event][i] == callback)
        {
            delete this.listeners[event][i];
            return;
        }
    }

    // Return
    return this;
};

/**
 * Trigger an event. All listener currently listening to the given event will be triggered.
 *
 * @param event The event's name
 * @param arguements The event's arguments.
 */
Application.prototype.trigger = function (event, arguements)
{
    if (!(event in this.listeners))
    {
        return;
    }

    for(var i = 0; i < this.listeners[event].length; ++i)
    {
        this.listeners[event][i](arguements);
    }
};

// Application's life cycle

/**
 * Start the application.
 *
 * @param givenArguments An object representing arguments.
 * @returns {Application} This
 */
Application.prototype.run = function(givenArguments)
{
    givenArguments = givenArguments || {};

    // Handle arguments
    var defaultArguments = {
        debug: true
    };
    var arguments = defaultArguments;
    for(var argumentName in givenArguments)
    {
        arguments[argumentName] = givenArguments[argumentName];
    }

    // Run
    this.debug = arguments.debug;
    this.trigger('start', this);
    this.refresh();

    // Return
    return this;
};

/**
 * Refreshed the whole page (application) or a part of it. What I mean by refresh is re-parsing (if necessary) and re-interpreting a part of the page with new data (maybe).
 *
 * @param rootNode The node where we should start refreshing.
 * @param context A refresh context, accessible for interpreters. Can contains context specifics variable.
 * @param depth The current refresh depth, used to control recursion.
 */
Application.prototype.refresh = function(rootNode, context, depth)
{
    depth = depth || 0;
    rootNode = rootNode || this.rootNode;
    context = context || {};

    // Handle pre events
    if (depth == 0)
    {
        this.trigger('beforeRefresh', this);
    }

    // Parse
    var commands = depth == 0 ? this.initialCommands : [];
    if (commands.length == 0)
    {
        for(var index = 0, documentParser; documentParser = this.documentParsers[index]; ++index)
        {
            var parsedCommands = documentParser.parse(this, rootNode, context, this.hookName);
            for(var i = 0; i < parsedCommands.length; ++i)
            {
                commands.push(parsedCommands[i]);
            }
        }
    }

    // Interpret
    for(var i = 0; i < commands.length; ++i)
    {
        // Interpret command
        for(var index = 0, interpreter; interpreter = this.interpreters[index]; ++index)
        {
            commands[i].wasInterpreted = interpreter.interpret(commands[i], depth) || commands[i].wasInterpreted;
        }

        // Send user feedback in case of unknown command
        if(this.debug && !commands[i].wasInterpreted)
        {
            console.log('YouMe WARNING: command ' + commands[i] +  ' unknown.');
        }
    }

    // Handle post events
    if (depth == 0)
    {
        this.trigger('afterRefresh', this);
    }
};

// Exports
module.exports = Application;
