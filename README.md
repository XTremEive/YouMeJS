YouMeJS
===

What is it?
---

YouMe is a [Knockout](https://github.com/knockout/knockout) inspired library create to help widget and API developers injecting code logic into their partners websites.


What does it do?
---

Here is a showcase of the current features.

```html
<!DOCTYPE html>
<html>
<head>
    <title>YouMe.JS - Demo document</title>
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="../build/dev/youme.js"></script>

    <!--
    ---------------------------------------------------------------
    Widget Developer's code (that's you!).
    You might consider moving this code to your own javascript file
    on your server so the client can access it using
    <script src="http://myawesomedomain.com/api/mas.js"></script> or something.
    ---------------------------------------------------------------
    -->

    <script>

        // You don't want to say that you used a kick-ass library so you create an alias.
        var MyAwesomeService = YouMe;

        // Then you define some methods to interact with your client pages.
        MyAwesomeService.start = function(debug) {

            // Here we're using a mock storage built-in YouMe. But this typically the class (or object) that you want to write on your own to handle API call
            var storage = YouMe.createMockStorage({
                'textVariable': 'This is a simple text',
                'booleanTrueVariable': true,
                'booleanFalseVariable': false
            });

            // Finally you call "fuse" with a storage, a root node to start parsing, a a custom alias (see client code below)
            this.fuse(storage, document, 'mas', { // "mas" stands for "MyAwesomeService"... Obviously.
                debug: debug
            });
        };
    </script>
</head>

<!--
---------------------------------------------------------------
Client entry point (that's the developer using your awesome service).
Please note how our alias "mas" is used.
This part also aim at showcasing what we can do so far.
---------------------------------------------------------------
-->

<body onload="MyAwesomeService.start()">

<h2>Text binding</h2>
<div>
    <!-- mas text: textVariable -->
    <p>This paragraph will be replaced by the content of foo.</p>
    <!-- /mas -->
    <p data-mas="text: textVariable">The content of this paragraph will be replace by the content of bar</p>
</div>

<h2>If binding</h2>
<div>
    <!-- mas if: booleanTrueVariable -->
    <p>This paragraph should be shown</p>
    <!-- /mas -->
    <!-- mas if: booleanFalseVariable -->
    <p>This paragraph should be hidden</p>
    <!-- /mas -->
    <p data-mas="if: booleanTrueVariable">This paragraph should be shown</p>
    <p data-mas="if: booleanFalseVariable">But not this one.</p>
</div>

</body>
</html>
```


Can I use it in production?
---

**No**. This project is a work in progress, as such it is yet to be documented or even tested in a production environment.
If you really want to play with those feature such as the template system, I encourage you to use [Knockout](https://github.com/knockout/knockout) instead.

What do I need to use it anyway?
---

A build of the library is available in the */build/dev/* directory.
If you're an widget / API developer. Keep in mind that you, and your clients will have to have [jQuery](https://github.com/jquery/jquery) available.
If you want to modify and the library itself you might consider installing [Browserify](https://github.com/substack/node-browserify) and run the *resouces/Scripts/build_dev.sh* to generate a new build (this script should be run at the root of the library.


What is left to do in order to have a kickass library? (todolist)
---

- Complete the todolist
- Add recursion in the comment parsing
- Add the save (or send) binding
- Add some input binding (with reload)
- Add the unknown command warning
- ...

