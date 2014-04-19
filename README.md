YouMeJS
===

What is it?
---

YouMe is a [Knockout](https://github.com/knockout/knockout) inspired library create to help web widget developers injecting code logic into their partners websites.


What does it do?
---

Here is a showcase of currently implemented features.

```html

<!DOCTYPE html>
<html>
<head>
    <title>YouMe.JS - Demo</title>
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

        // Then you define some methods to interact with your client pages.
        MyAwesomeService.start = function(debug) {
            // Finally you call "fuse" with a root node to start parsing, a a custom alias (see client code below)
            this.fuse(document, 'mas', { // "mas" stands for "MyAwesomeService"... Obviously.
                debug: debug
            });
        };

        // You  can even create your own commands
        MyAwesomeService.addCommand('chu', function (command) { // This one will replace a content by a paragraph with some text
            command.target.setHtml('<p>Chu chuuuu!</p>');
        });

        MyAwesomeService.addCommand('add', function (command) { // This one willadd numbers passed as arguments.
            command.target.on('click', function () {
                var result = parseInt(command.getArgument(0)) + parseInt(command.getArgument(1));
                command.target.setHtml(result);
            });
        });

    </script>
</head>

<!--
---------------------------------------------------------------
Client entry point (that's the developer using your awesome service).
Please note how our alias "mas" is used.
This part also aim at showcasing what we can do so far.
---------------------------------------------------------------
-->

<body>
<style type="text/css">
    .highlight {
        background: #fee;
    }
</style>

<h1>YouMe.JS demo</h1>
<p>Don't just stare at this page, check its source code to understand what's happening.</p>

<h2>Text binding</h2>
<div>
    <!-- mas text: textVariable -->
    <p>This paragraph will be replaced by the content of foo.</p>
    <!-- /mas -->
    <p data-mas="text: textVariable">The content of this paragraph will be replace by the content of textVariable</p>
    <p data-mas="text: objectVariable.property">We can even access object properties</p>
</div>

<h2>Attribute binding</h2>
<div>
    <a href="#" data-mas='attribute: {"title": "textVariable"}'>Mouse over to see a tooltip set using the binding system.</a>
</div>

<h2>Conditions</h2>
<h3>If statement</h3>
<div>
    <!-- mas if: booleanTrueVariable -->
    <p>This paragraph should be shown</p>
    <!-- /mas -->
    <!-- mas if: booleanFalseVariable -->
    <p>This paragraph should be hidden</p>
    <!-- /mas -->
    <p data-mas="if: booleanTrueVariable">This paragraph should be shown</p>
    <p data-mas="if: booleanFalseVariable">But not this one.</p>
    <p data-mas="if: booleanTrueVariable && booleanFalseVariable">And not this one either.</p>
    <p data-mas="if: booleanTrueVariable || booleanFalseVariable">And this one should be visible too.</p>
</div>

<h2>Conditional attribute binding (the second parameter contains indexed conditions)</h2>
<div>
    <a href="#" data-mas='attribute: {"class": "highlight"}, {"class": "booleanTrueVariable"}'>This will display a CSS class as booleanTrueVariable is true</a><br />
    <a href="#" data-mas='attribute: {"class": "highlight"}, {"class": "booleanFalseVariable"}'>This will not add a CSS class as booleanFalseVariable is false..</a><br />
    <a href="#" data-mas='attribute: {"class": "highlight"}, {"class": "arrayVariable.length > 2"}'>This will add a CSS class as arrayVariables contains more than 2 elements..</a>
</div>

<h2>Loops</h2>
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
        <li><b data-mas="text: context.id"></b> <span data-mas="text: context.name"></span><br />
        Loop index: <span data-mas="text: context.loopIndex"></span></li>
    </ul>

</div>

<h2>Nesting</h2>
<div>
    <!-- mas if: booleanTrueVariable -->
        <p>This paragraph should be shown</p>

        <!-- mas if: booleanFalseVariable -->
        <p>This paragraph should be hidden</p>
        <!-- /mas -->

        <ul data-mas="for: arrayVariable">
            <li data-mas="text: context"></li>
            <ul data-mas="for: arrayWithObjectsVariable">
                <li><b data-mas="text: context.parent"></b> <span data-mas="text: context.name"></span></li>
            </ul>
        </ul>

        <ul>
            <!-- mas for: arrayVariable -->
            <li data-mas="text: context"></li>
            <ul>
                <!-- mas for: arrayWithObjectsVariable -->
                <li><b data-mas="text: context.parent"></b> <span data-mas="text: context.name"></span></li>
                <!-- /mas -->
            </ul>
            <!-- /mas -->
        </ul>
    <!-- /mas -->
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

<h2>Javascript controls</h2>
<p data-mas="text: javascriptBoundVariable"></p>
<script>
    $(window).load(function () {
        // Javascript hooks

        MyAwesomeService.on('start', function () {
            alert("This javascript hook is triggered on application's start (but before any refresh)") ;
        });
        MyAwesomeService.on('beforeRefresh', function () {
            alert("This javascript hook is triggered just before refreshing") ;
        });
        MyAwesomeService.on('afterRefresh', function () {
            alert("This javascript hook is triggered just after refreshing") ;
        });

        MyAwesomeService.on('beforeSave', function () {
            alert("This javascript hook is triggered just before saving") ;
        });
        MyAwesomeService.on('afterSave', function () {
            alert("This javascript hook is triggered just after saving") ;
        });

        // Javascript manipulation
        MyAwesomeService.set('javascriptBoundVariable', new Date().getMilliseconds());
        setInterval(function() {
            MyAwesomeService.set('javascriptBoundVariable', new Date().getMilliseconds());
        }, 10000);
    });
</script>

<h2>Custom user-defined binding</h2>
<!-- mas chu -->
    <p>This will be overwritten</p>
<!-- /mas -->

<p data-mas="add: 1, 3">Click here to see how much is 1 + 3</p>

<script>
    // User will start the service like so.
    $(window).load(function () {
        MyAwesomeService.start(true); // The parameter provided in start() is a debug flag... But that's your (widget developer) decision.
    });
</script>

</body>
</html>


```


Can I use it in production?
---

**At your own risk**.
This project is a work in progress, and as such it has yet to be documented or even tested in a production environment.
If you really want to play with those feature such as the template system, I encourage you to use [Knockout](https://github.com/knockout/knockout) instead.


I still want to use it, so what do I need anyway?
---

A build of the library is available in the */build/dev/* directory.
If you're a widget developer keep in mind that your clients will have to have [jQuery](https://github.com/jquery/jquery) available.
If you want to modify the library itself you might consider installing [Browserify](https://github.com/substack/node-browserify) and run the *resouces/Scripts/build_dev.sh* to generate a new build (this script should be run at the root of the library.

