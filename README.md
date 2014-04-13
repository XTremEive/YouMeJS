YouMeJS
===

YouMe is a KnockoutJS inspired library to help you integrate logic on your partners websites.

You might want to know
===

- **This project's state:** Work in progress
- **This library depends on:** jQuery... For now.
- **This library was inspired by:** Knockout.JS and I strongly encourage you to use it instead of this.
- **This library is not production ready**

Todolist
===

- Complete the todolist
- Add the comment parsing
- Add recursion in the comment parsing
- Add the for binding
- Add the if binding
- Add the save (or send) binding
- Add some input binding (with reload)
- ...


Use case example
===

```html
<!DOCTYPE html>
<html>
<head>
    <title>YouMe.JS - Demo document</title>
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="../build/dev/youme.js"></script>

    <!-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       -->
    <!-- Widget Developer entry point (that's you!). You might consider moving the code a javascript file on your server so the client can access it using http://myawesomedomain.com/api/mas.js -->
    <!-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       -->

    <script>

        // Obviously you don't want to say that you used a kick ass library that's why you create an alias.
        var MyAwesomeService = YouMe;

        // Then you define some methods to interact with your client pages.
        MyAwesomeService.start = function(debug) {

            // Here we're using a mock storage built-in YouMe. But this typically the class (or object) that you want to write on your own to handle API call
            var storage = YouMe.createMockStorage({
                'foo': 'This is foo',
                'bar': 'This is bar'
            });

            // Finally we call the "fuse" method with our storage, the root node to start parsing, and a custom alias (see client code below)
            this.fuse(storage, document, 'mas', { // "mas" stands for "MyAwesomeService"... Obviously.
                debug: debug
            });
        };
    </script>
</head>

<!-- ---------------------------------------------------------------------------------------------------- -->
<!-- Client entry point (that's the developer using your awesome service (not how our alias "mas" is used -->
<!-- ---------------------------------------------------------------------------------------------------- -->

<body onload="MyAwesomeService.start()">

<div>
    <!-- Example of comment bindings -->
    <!-- mas text: foo -->
    <p>This will be removed and replaced by the content of "foo"</p>
    <!-- /mas -->

    <!-- Example of standard HTML binding -->
    <p data-mas="text: bar">This text will be replaced by the content of bar</p>
</div>

</body>
</html>
```