/**
 * Widget developer's code (that's you!).
 * You might consider moving such code to your own server so the client can access it using
 * <script src="http://myawesomedomain.com/api/mas.js"></script> or something.
 */

// We expose a application interface in the global space.
MyAwesomeService = {

    // The load function will our client's entry point.
    load: function(callback)
    {
        // For the sake of the demo we're using jQuery to load the YouMe
        // but in a real case scenario youme.x.x.x.min.js and mas.js would be one file.
        var YouMePath = 'js/youme.0.0.4.min.js';
        $.getScript(YouMePath, function() {

            // We transform our application interface in an advanced application interface using YouMe
            MyAwesomeService = YouMe();

            // For the sake of the demo we're using a mock storage built-in YouMe.
            MyAwesomeService.storage.data = {
                'aSimpleVariable': 'Buuh!',
                'aSimpleTrueBoolean': true,
                'aSimpleFalseBoolean': false,
                'aSimpleArray': [
                    "Grass",
                    "Fire",
                    "Water",
                    "Electric",
                    "Ice",
                    "Dark",
                    "Psychic",
                    "Dragon",
                    "Ghost",
                    "Rock"
                ],
                'aSimpleObject': {
                    id: 25,
                    name: "Pikachu",
                    url: "http://en.wikipedia.org/wiki/Pikachu",
                    image: "http://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Sugimoris025.png/200px-Sugimoris025.png",
                    toString: function()
                    {
                        return JSON.stringify(this).replace(/([,:])/g, "$1 ");
                    }
                }
            };

            // Then we expose a start() function to our client.
            // For the sake of the demo the parameter provided is a debug flag... But it doesn't have to be exposed in a real case..
            // We also provide a selector to work only on the demo part of the document... Think about the possibilities.
            MyAwesomeService.start = function(debug, selector) {

                // Finally we call fuse() (a function from the initial YouMe object).
                // The first argument is a selector.
                // The second argument is an name to use in document parsing. Here it's "mas".
                // The third parameter is a set of options.
                this.fuse(selector, 'mas', { // "mas" stands for "MyAwesomeService"... Obviously.
                    debug: debug
                });
            };

            // Here we add a custom command
            MyAwesomeService.addCommand('sum', function (command) {
                // We listen to the click event
                command.target.on('click', function () {
                    // We do the operation using to command interface provided by YouMe
                    var sum = parseInt(command.getArgument(0)) + parseInt(command.getArgument(1));

                    // We set the HTML of the target HTML element
                    command.target.setHtml(sum);
                });
            });

            // Call user entry function if provided
            if (callback)
            {
                callback(MyAwesomeService);
            }
        });
    }
};
