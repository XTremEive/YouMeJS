/**
 * Widget Developer's code (that's you!).
 * You might consider moving this code to your own javascript file
 * on your server so the client can access it using
 * <script src="http://myawesomedomain.com/api/mas.js"></script> or something.
 */

MyAwesomeService = {
    load: function(callback)
    {
        // Build the service
        var YouMePath = '../build/release/youme.0.0.1.min.js';
        $.getScript(YouMePath, function() {

            // You don't want to say that you used a kick-ass library so you create an alias.
            MyAwesomeService = YouMe;

            // Here we're using a mock storage built-in YouMe. But this typically the class (or object) that you want to write on your own to handle API call
            MyAwesomeService.storage = YouMe.createMockStorage({
                'textVariable': 'This is a simple text',
                'booleanTrueVariable': true,
                'booleanFalseVariable': false,
                'arrayVariable': ['foo', 'bar', 'baz'],
                'objectVariable': {
                    property: "This is an object property",
                },
                'arrayWithObjectsVariable': [
                    {
                        id: 25,
                        name: 'Pikachu'
                    },
                    {
                        id: 26,
                        name: 'Raichu'
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
        });
    }
};
