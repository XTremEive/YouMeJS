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
        var YouMePath = '/js/youme.0.0.2.min.js';
        $.getScript(YouMePath, function() {

            // You don't want to say that you used a kick-ass library so you create an alias.
            MyAwesomeService = YouMe;

            // Here we're using a mock storage built-in YouMe. But this typically the class (or object) that you want to write on your own to handle API call
            MyAwesomeService.storage = YouMe.createMockStorage({
                'aSimpleVariable': 'Buuh!',
                'aSimpleObject': {
                    id: 25,
                    name: "Pikachu"
                }
            });

            // Then you define some methods to interact with your client pages. It's usually a good idea to expose a "start" method.
            // For the sake of the demo the parameter provided in start() is a debug flag... But that's your (widget developer) decision.
            // We also provide a selector to work only on the demo part of the document
            MyAwesomeService.start = function(debug, selector) {
                // Finally you call "fuse" with a root node to start parsing, a a custom alias (see client code below)
                this.fuse(selector, 'mas', { // "mas" stands for "MyAwesomeService"... Obviously.
                    debug: debug
                });
            };

            // Call user entry function
            if (callback)
            {
                callback(MyAwesomeService);
            }
        });
    }
};