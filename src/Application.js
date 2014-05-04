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
    this.dependencies = [];
    this.$ = null;
    this.isRunning = false;
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

    // Add the listener
    this.listeners[event].push(callback);

    // Return
    return this;
};

/**
 * Remove an event listener.
 *
 * @param event The event's name
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
 * @param arguments The event's arguments.
 */
Application.prototype.trigger = function (event, arguments)
{
    if (!(event in this.listeners))
    {
        return;
    }

    for(var i = 0; i < this.listeners[event].length; ++i)
    {
        this.listeners[event][i](arguments);
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
    var self = this;
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

    // Finish building the application
    // Add jQuery dependency
    this.addDependency('script', '//code.jquery.com/jquery-1.11.0.min.js', function() {
        return window.jQuery === undefined || window.jQuery.fn.jquery !== '1.11.0';
    }, function(application) {
        application.$ = window.jQuery.noConflict(true);
    }, true);

    // Load javascript dependencies
    this.loadDependencies(function () {
        // Run
        self.debug = arguments.debug;
        self.isRunning = true;
        self.trigger('start', self);
        self.refresh();
    });

    // Return
    return this;
};

Application.prototype.addDependency = function(type, url, check, success, prepend)
{
    // Format parameters
    success = success || null;
    prepend = prepend || false

    // Create the dependency object
    var dependency = {
        type: type,
        url: url,
        check: check,
        success: success,
    };

    // Add dependency
    if(prepend)
    {
        this.dependencies.unshift(dependency);
    } else {
        this.dependencies.push(dependency);
    }
};

Application.prototype.loadDependencies = function(callback)
{
    var dependenciesToLoad = this.dependencies.length;

    for(var i = 0, dependency; dependency = this.dependencies[i]; ++i)
    {
        // Developer feedback
        if(this.debug)
        {
            console.log("YouMe: Loading dependency: " + dependency.url);
        }

        // Check if the dependency should be added
        if(dependency.check())
        {
            var htmlTag = null;

            // Prepare the HTML tag to be added
            switch(dependency.type)
            {
                case "script":
                    htmlTag = document.createElement("script");
                    htmlTag.setAttribute("type","text/javascript");
                    htmlTag.setAttribute("src", dependency.url);
                    break;
                case "style":
                    htmlTag = document.createElement("link");
                    htmlTag.setAttribute("rel","stylesheet");
                    htmlTag.setAttribute("type","text/css");
                    htmlTag.setAttribute("href", dependency.url);
                    break;
            }

            // Handle "unknown dependency type" errors.
            if(null === htmlTag)
            {
                throw "YouMe Error: Unknown dependency of type " +dependency.type;
            }

            // Bind events to the HTML tag loading
            (function(self, dependency) {
                if (htmlTag.readyState) {
                    htmlTag.onreadystatechange = function () { // For old versions of IE
                        if (this.readyState == 'complete' || this.readyState == 'loaded') {
                            // Handle loaded dependency
                            if(null !== dependency.success)
                            {
                                dependency.success(self);
                            }
                            --dependenciesToLoad;
                            if(0 == dependenciesToLoad)
                            {
                                callback();
                            }
                        }
                    };
                } else { // Other browsers
                    htmlTag.onload = function() {
                        // Handle loaded dependency
                        if(null !== dependency.success)
                        {
                            dependency.success(self);
                        }
                        --dependenciesToLoad;
                        if(0 == dependenciesToLoad)
                        {
                            callback();
                        }
                    };
                }
            })(this, dependency);

            // Add the tag
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(htmlTag);
        } else {
            // Handle loaded dependency
            if(null !== dependency.success)
            {
                dependency.success(self);
            }
            --dependenciesToLoad;
            if(0 == dependenciesToLoad)
            {
                callback();
            }
        }
    }
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
    // Discard premature calls
    if(!this.isRunning)
    {
        return;
    }

    // Format arguments
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
        commands[i].wasInterpreted = false;
        for(var index = 0, interpreter; interpreter = this.interpreters[index]; ++index)
        {
            commands[i].wasInterpreted = interpreter.interpret(commands[i], depth) || commands[i].wasInterpreted;
        }

        if (commands[i].wasInterpreted)
        {
            ++commands[i].executionCount;
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
