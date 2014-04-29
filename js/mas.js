/**
 * Widget developer's code (that's you!).
 * You might consider moving such code to your own server so the client can access it using
 * <script src="http://myawesomedomain.com/api/mas.js"></script> or something.
 */

// We expose a communication interface in the global space.
MyAwesomeService = {

    // The load function will our client's entry point.
    load: function(callback)
    {
        // For the sake of the demo we're using jQuery to load the origin YouMe, but in a real case scenario youme.x.x.x.min.js and mas.js would be one file.
        var YouMePath = 'js/youme.0.0.2.min.js';
        $.getScript(YouMePath, function() {

            // We transform our communication interface in an advance communication interface using YouMe (You could use YouMe directly, but that's lame).
            MyAwesomeService = YouMe;

            // For the sake of the demo we're using a mock storage built-in YouMe.
            // But this is typically the  object that you want to replace with your own to handle API call.
            MyAwesomeService.storage = YouMe.createMockStorage({
                'aSimpleVariable': 'Buuh!',
                'aSimpleObject': {
                    id: 25,
                    name: "Pikachu"
                }
            });

            // Then you define some function to be exposed to our client.
            // For the sake of the demo the parameter provided is a debug flag... But it doesn't have to be exposed in a real case..
            // We also provide a selector to work only on the demo part of the document... Think about the possibilities.
            MyAwesomeService.start = function(debug, selector) {

                // Finally you call "fuse" (a function from the initial YouMe object)
                // The first argument is a selector
                // The second argument is an name to use in parsing. Here it's "mas"
                // The third parameter is a set of options.
                this.fuse(selector, 'mas', { // "mas" stands for "MyAwesomeService"... Obviously.
                    debug: debug
                });
            };

            // Call user entry function if provided
            if (callback)
            {
                callback(MyAwesomeService);
            }
        });
    }
};
