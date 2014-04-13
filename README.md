YouMeJS
===

What is it?
---

YouMe is a [Knockout](https://github.com/knockout/knockout) inspired library create to help widget and API developers injecting code logic into their partners websites.


What does it do?
---

Here is a showcase of currently implemented features.

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
                'booleanFalseVariable': false,
                'arrayVariable': ['foo', 'bar', 'baz'],
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

<!-- The parameter provided in start() is a debug flag... But that's your (widget developer) decision -->
<body onload="MyAwesomeService.start(true)">

<h1>YouMe.JS demo file</h1>
<p>Don't just stare at this page, check its source code to understand what's happening.</p>

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

<h2>For binding</h2>
<div>
    <!-- mas for: arrayVariable -->
    <p>Current item <span data-mas="text: context"></span></p>
    <!-- /mas -->
    <ul data-mas="for: arrayVariable">
        <li data-mas="text: context"></li>
    </ul>

    <!-- mas for: arrayWithObjectsVariable -->
    <p>Id: <span data-mas="text: context.id"></span> <span data-mas="text: context.name"></span></p>
    <!-- /mas -->
    <ul data-mas="for: arrayWithObjectsVariable">
        <li><b data-mas="text: context.id"></b> <span data-mas="text: context.name"></span></li>
    </ul>

</div>

<h2>Input binding</h2>
<p>Click on save in the next section and see the result of your changes</p>
<form methd="post" action="">
    <input name="foo" type="text" value="This wil be filled with an existing variable and changing it will overwrite its content" data-mas="input: textVariable" />
    <input name="bar" type="text" value="This will set a new variable" data-mas="input: userDefinedTextVariable" />
</form>

<h2>Save binding</h2>
<form method="post" action="">
    <!-- mas save -->
        <a href="#" title="Clicking here wil trigger your storage's save method." >Save link</a>
    <!-- /mas -->

    <input type="button" data-mas="save" title="Clicking here wil trigger your storage's save method." value="Save button" />
</form>

<h2>Here are some error cases</h2>
<div>
    <p data-mas="text: nonExistingVariable">This will be replaced by undefined.</p>
    <p data-mas="unknownCommand: withParameters">This paragraph will trigger an unknown command warning</p>
    <p data-notMas="text: textVariable">This should stay visible</p>
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


What is left to do in order to have a ready-to-use library? (todolist)
---

- Add recursion in the comment parsing
- Add some refreshes when changing inputs
- Allow user to inject their own commands
- Add the HTML attribute binding
- Add a callback system for event

- ...

