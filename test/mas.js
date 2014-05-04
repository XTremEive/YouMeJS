/* user service */
MyAwesomeService = {
    load: function(callback)
    {
        // You don't want to say that you used a kick-ass library so you create an alias.
        MyAwesomeService = YouMe();

        // Loading external dependencies
        MyAwesomeService.addStyleDependency('http://yandex.st/highlightjs/8.0/styles/sunburst.min.css', function () {
            return !(window.hljs);
        });
        MyAwesomeService.addScriptDependency('http://yandex.st/highlightjs/8.0/highlight.min.js', function () {
            return !(window.hljs);
        }, function(application) {
            window.hljs.configure({useBR: true});

            application.$('code.html').each(function(i, e) {window.hljs.highlightBlock(e, 'html')});
            application.$('code.js').each(function(i, e) {window.hljs.highlightBlock(e, 'js')});
        });

        // Here we're using a mock storage built-in YouMe. But this typically the class (or object) that you want to write on your own to handle API call
        MyAwesomeService.storage = MyAwesomeService.createMockStorage({
            'textVariable': 'This is a simple text',
            'booleanTrueVariable': true,
            'booleanFalseVariable': false,
            'arrayVariable': ['foo', 'bar', 'baz'],
            'objectVariable': {
                property: "This is an object property",
                toString: function()
                {
                    return JSON.stringify(this);
                }
            },
            'arrayWithObjectsVariable': [
                {
                    id: 25,
                    name: 'Pikachu',
                    toString: function()
                    {
                        return JSON.stringify(this);
                    }
                },
                {
                    id: 26,
                    name: 'Raichu',
                    toString: function()
                    {
                        return JSON.stringify(this);
                    }
                },
            ]
        });

        // Then you define some methods to interact with your client pages. It's usally a good idea to expose a "start" method.
        MyAwesomeService.start = function(debug) {
            // Finally you call "fuse" with a root node to start parsing, a a custom alias (see client code below)
            this.fuse(document, 'mas', { // "mas" stands for "MyAwesomeService"... Obviously.
                debug: debug
            });
        };

        // You can optionally create your own commands
        MyAwesomeService.addCommand('chu', function (command) { // This one will replace a content by a paragraph with some text
            command.target.setHtml('<p>Chu chuuuu!</p>');
        });

        // here is another custom command
        MyAwesomeService.addCommand('add', function (command) { // This one willadd numbers passed as arguments.
            command.target.on('click', function () {
                var result = parseInt(command.getArgument(0)) + parseInt(command.getArgument(1));
                command.target.setHtml(result);
            });
        });

        // Call user entry function
        if (callback)
        {
            callback.call(MyAwesomeService);
        }
    }
};