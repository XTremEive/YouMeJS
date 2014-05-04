// We just concatained the code from one of YouMe's releases.

/* youme v0.0.5: 05/04/2014 */
!function(a){if("object"==typeof exports)module.exports=a();else if("function"==typeof define&&define.amd)define(a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.YouMe=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){var c=function(a,b,c,d,e){this.documentParsers=a||[],this.commandParser=b||null,this.interpreters=c||[],this.hookName=d||"missingHookName",this.rootNode=e||"body",this.debug=!1,this.listeners={},this.initialCommands=[],this.dependencies=[],this.$=null,this.isRunning=!1};c.prototype.on=function(a,b){return a in this.listeners||(this.listeners[a]=[]),this.listeners[a].push(b),this},c.prototype.off=function(a,b){if(b=b||null,a in this.listeners){if(null===b)return void delete this.listeners[a];for(var c=0;c<this.listeners[a].length;++c)if(this.listeners[a][c]==b)return void delete this.listeners[a][c];return this}},c.prototype.trigger=function(a,b){if(a in this.listeners)for(var c=0;c<this.listeners[a].length;++c)this.listeners[a][c](b)},c.prototype.run=function(a){var b=this;a=a||{};var c={debug:!0},d=c;for(var e in a)d[e]=a[e];return this.addDependency("script","//code.jquery.com/jquery-1.11.0.min.js",function(){return void 0===window.jQuery||"1.11.0"!==window.jQuery.fn.jquery},function(a){a.$=window.jQuery.noConflict(!0)}),this.loadDependencies(function(){b.debug=d.debug,b.isRunning=!0,b.trigger("start",b),b.refresh()}),this},c.prototype.addDependency=function(a,b,c,d){d=d||null,this.dependencies.push({type:a,url:b,check:c,success:d})},c.prototype.loadDependencies=function(a){for(var b,c=this.dependencies.length,d=0;b=this.dependencies[d];++d)if(this.debug&&console.log("YouMe: Loading dependency: "+b.url),b.check()){var e=null;switch(b.type){case"script":e=document.createElement("script"),e.setAttribute("type","text/javascript"),e.setAttribute("src",b.url);break;case"style":e=document.createElement("link"),e.setAttribute("rel","stylesheet"),e.setAttribute("type","text/css"),e.setAttribute("href",b.url)}if(null===e)throw"YouMe Error: Unknown dependency of type "+b.type;!function(b,d){e.readyState?e.onreadystatechange=function(){("complete"==this.readyState||"loaded"==this.readyState)&&(null!==d.success&&d.success(b),--c,0==c&&a())}:e.onload=function(){null!==d.success&&d.success(b),--c,0==c&&a()}}(this,b),(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(e)}else null!==b.success&&b.success(self),--c,0==c&&a()},c.prototype.refresh=function(a,b,c){if(this.isRunning){c=c||0,a=a||this.rootNode,b=b||{},0==c&&this.trigger("beforeRefresh",this);var d=0==c?this.initialCommands:[];if(0==d.length)for(var e,f=0;e=this.documentParsers[f];++f)for(var g=e.parse(this,a,b,this.hookName),h=0;h<g.length;++h)d.push(g[h]);for(var h=0;h<d.length;++h){d[h].wasInterpreted=!1;for(var i,f=0;i=this.interpreters[f];++f)d[h].wasInterpreted=i.interpret(d[h],c)||d[h].wasInterpreted;d[h].wasInterpreted&&++d[h].executionCount,this.debug&&!d[h].wasInterpreted&&console.log("YouMe WARNING: command "+d[h]+" unknown.")}0==c&&this.trigger("afterRefresh",this)}},b.exports=c},{}],2:[function(a,b){var c=a("./Interpreter"),d=function(a,b){c.call(this,a),this.conditionEvaluator=b};d.prototype=new c,d.prototype.interpret=function(a){if("attribute"!=a.name)return!1;var b=JSON.parse(a.getArgument(0)),c=JSON.parse(a.getArgument(1,"{}"));for(var d in b)b[d]=b[d].trim();for(var d in c)c[d]=this.conditionEvaluator.evaluate(this,a.context,c[d].trim());for(var e in b){var f=this.getValue(a.context,b[e],b[e]),g=e in c?c[e]:!0;g&&a.target.setAttribute(e,f)}return!0},b.exports=d},{"./Interpreter":7}],3:[function(a,b){var c=function(){};c.prototype.evaluate=function(a,b,c){for(var d,e=!0,f=c.split(" "),g="&&",h=0;d=f[h];++h)switch(d=d.trim()){case"&&":case"||":case">":case"<":case">=":case"<=":case"==":case"!=":g=d;break;default:switch(d="true"==d?!0:"false"==d?!1:a.getValue(b,d,d),g){case"==":e=e==d;break;case"!=":e=e!=d;break;case"&&":e=e&&d;break;case"||":e=e||d;break;case">":e=e>d;break;case"<":e=d>e;break;case">=":e=e>=d;break;case"<=":e=d>=e}}return e},b.exports=c},{}],4:[function(a,b){var c=a("./Interpreter"),d=function(a){c.call(this,a)};d.prototype=new c,d.prototype.interpret=function(a,b){if("for"!=a.name)return!1;for(var c=this.getValue(a.context,a.getArgument(0),[]),d=[],e=0;e<c.length;++e)d.push(a.target.createTemplate());a.target.clear();for(var e=0;e<c.length;++e){var f={item:c[e],parent:a.context,loopIndex:e,loopLength:c.length};a.target.append(d[e]),a.application.refresh(d[e],f,b+1)}return!0},b.exports=d},{"./Interpreter":7}],5:[function(a,b){var c=a("./Interpreter"),d=function(a,b){c.call(this,a),this.conditionEvaluator=b,this.conditionEvaluator.interpreter=this};d.prototype=new c,d.prototype.interpret=function(a){if("if"!=a.name)return!1;var b=this.conditionEvaluator.evaluate(this,a.context,a.getArguments().join(" "));return b?a.target.show():a.target.hide(),!0},b.exports=d},{"./Interpreter":7}],6:[function(a,b){var c=a("./Interpreter"),d=function(a){c.call(this,a)};d.prototype=new c,d.prototype.interpret=function(a){if("input"!=a.name)return!1;var b=this.getValue(a.context,a.getArgument(0),"");return a.target.setValue(b),function(b,c,d,e){a.target.on("change",function(){b.storage.set(d,e.getValue()),c.refresh()})}(this,a.application,a.getArgument(0),a.target),!0},b.exports=d},{"./Interpreter":7}],7:[function(a,b){var c=function(a){this.storage=a||null};c.prototype.interpret=function(){throw"Not implemented!"},c.prototype.getValue=function(a,b,c){var d=b.split("."),e=[],f=c;if("context"==d[0]){for(f=a,d.shift();d.length>0;){if(null!=a&&"object"==typeof a&&d.join(".")in a){f=a[d.join(".")];break}e.unshift(d.pop())}for(var g=0;g<e.length;++g){if(null==f||"object"!=typeof f||!(e[g]in f))return c;f=f[e[g]]}return f}for(;d.length>0;){if(this.storage.has(d.join("."))){f=this.storage.get(d.join("."));break}e.unshift(d.pop())}for(var g=0;g<e.length;++g){if(null==f||"object"!=typeof f||!(e[g]in f))return c;f=f[e[g]]}return f},b.exports=c},{}],8:[function(a,b){var c=a("./Interpreter"),d=function(a){c.call(this,a)};d.prototype=new c,d.prototype.interpret=function(a){return"save"!=a.name?!1:a.executionCount>0?!0:(function(b,c){a.target.on("click",function(){b.trigger("beforeSave",c.storage),c.storage.save(),b.trigger("afterSave",c.storage)})}(a.application,this),!0)},b.exports=d},{"./Interpreter":7}],9:[function(a,b){var c=a("./Interpreter"),d=function(a){c.call(this,a)};d.prototype=new c,d.prototype.interpret=function(a){if("text"!=a.name)return!1;var b=this.getValue(a.context,a.getArgument(0),"undefined");return a.target.setHtml(b+""),!0},b.exports=d},{"./Interpreter":7}],10:[function(a,b){var c=a("./Interpreter"),d=function(a,b,d){c.call(this,a),this.commandName=b,this.callback=d};d.prototype=new c,d.prototype.interpret=function(a){return a.name!=this.commandName?!1:(this.callback.call(this,a),!0)},b.exports=d},{"./Interpreter":7}],11:[function(a,b){var c=function(a){this.data=a||{}};c.prototype.set=function(a,b){return 1==arguments.length&&(b=1),this.data[a]=b,this},c.prototype.get=function(a,b){return this.data[a]?this.data[a]:b},c.prototype.has=function(a){return a in this.data},c.prototype.unset=function(a){return delete this.data[a],this},c.prototype.save=function(){var a="YouMe's MockStorage is now saving: "+JSON.stringify(this.data);return alert(a),console.log(a),this},b.exports=c},{}],12:[function(a,b){var c=function(a,b,c,d,e){this.application=a,this.target=b,this.context=c,this.name=d||"",this.arguments=e||{},this.wasInterpreted=!1,this.executionCount=0};c.prototype.getArgument=function(a,b){if(a in this.arguments)return this.arguments[a];var c=0;for(var d in this.arguments){if(c==a)return this.arguments[c];++c}return b},c.prototype.getArguments=function(){var a=[];for(var b in this.arguments)a.push(this.arguments[b]);return a},c.prototype.toString=function(){return this.name+"("+JSON.stringify(this.arguments)+")"},b.exports=c},{}],13:[function(a,b){var c=a("./Command"),d=function(){};d.prototype.parse=function(a,b,c,d){for(var e=[],f="",g=0,h=0;h<d.length;++h){var i=d[h];switch(i){case"{":++g,f+=i;break;case"}":--g,f+=i;break;case",":0==g?(e.push(this.parseCommandString(a,b,c,f)),f=""):f+=i;break;default:f+=i}}return e.push(this.parseCommandString(a,b,c,f)),e},d.prototype.parseCommandString=function(a,b,d,e){for(var f=e.split(":"),g=f.shift().trim(),h=[],i=f.join(":"),j="",k=0,l=0;l<i.length;++l){var m=i[l];switch(m){case"{":++k,j+=m;break;case"}":--k,j+=m;break;case" ":0==k?(0!=j.length&&h.push(j),j=""):j+=m;break;default:j+=m}}return 0!=j.length&&h.push(j),new c(a,b,d,g,h)},b.exports=d},{"./Command":12}],14:[function(a,b){var c=a("./Nodes/VirtualNode"),d=function(){this.startCommentRegex=null,this.endCommentRegex=null,this._commentNodesHaveTextProperty=null};d.prototype.parse=function(a,b,d,e){var f=[],g=this;return a.$(b).each(function(b,h){var i=[a.$(h).get(0)];g._commentNodesHaveTextProperty=document&&"<!--test-->"===document.createComment("test").text,g._startCommentRegex=new RegExp(g._commentNodesHaveTextProperty?"^<!--\\s*"+e+"(?:\\s+([\\s\\S]+))?\\s*-->$":"^\\s*"+e+"(?:\\s+([\\s\\S]+))?\\s*$"),g._endCommentRegex=new RegExp(g._commentNodesHaveTextProperty?"^<!--\\s*/"+e+"\\s*-->$":"^\\s*/"+e+"\\s*$");for(var j=[];i.length>0;){var k=i.shift();switch(!0){case g.isStartComment(k):j.push({startNode:k,commandString:g.getCommentValue(k).substring(g.getCommentValue(k).indexOf(e)+e.length,g.getCommentValue(k).length).trim(),contentNodes:[],endNode:null});break;case g.isEndComment(k):j[j.length-1].endNode=k;for(var l=j.pop(),m=a.commandParser.parse(a,new c(a.$,l.startNode,l.contentNodes,l.endNode),d,l.commandString),n=0;n<m.length;++n)f.push(m[n]);break;default:j.length>0&&j[j.length-1].contentNodes.push(k)}for(var o,n=0;o=k.childNodes[n];++n)i.push(o)}}),f},d.prototype.isStartComment=function(a){return 8==a.nodeType&&this._startCommentRegex.test(this.getCommentValue(a))},d.prototype.isEndComment=function(a){return 8==a.nodeType&&this._endCommentRegex.test(this.getCommentValue(a))},d.prototype.getCommentValue=function(a){return this._commentNodesHaveTextProperty?a.text:a.nodeValue},b.exports=d},{"./Nodes/VirtualNode":17}],15:[function(a,b){var c=a("./Nodes/NormalNode"),d=function(){};d.prototype.parse=function(a,b,d,e){var f=[];return a.$(b).each(function(b,g){var h=a.$(g).attr("data-"+e);if("undefined"!=typeof h&&h!==!1)for(var i=a.commandParser.parse(a,new c(a.$,g),d,h),j=0;j<i.length;++j)f.push(i[j]);a.$(g).find("[data-"+e+"]").each(function(b,g){for(var h=a.commandParser.parse(a,new c(a.$,g),d,a.$(g).attr("data-"+e)),i=0;i<h.length;++i)f.push(h[i])})}),f},b.exports=d},{"./Nodes/NormalNode":16}],16:[function(a,b){var c=function(a,b){this.node=a(b),this.template=this.node.clone()};c.prototype.append=function(a){this.node.append(a)},c.prototype.clear=function(){this.setHtml("")},c.prototype.createTemplate=function(){return this.template.children().clone()},c.prototype.getAttribute=function(a){return this.node.attr(a)},c.prototype.setAttribute=function(a,b){return this.node.attr(a,b)},c.prototype.getHtml=function(){return this.node.html()},c.prototype.setHtml=function(a){this.node.html(a)},c.prototype.setValue=function(a){this.node.val(a)},c.prototype.getValue=function(){return this.node.val()},c.prototype.hide=function(){this.node.hide()},c.prototype.on=function(a,b){this.node.on(a,b)},c.prototype.show=function(){this.node.show()},b.exports=c},{}],17:[function(a,b){var c=function(a,b,c,d){this.$=a,this.startComment=a(b),this.nodes=c,this.endComment=a(d),this.template=a(this.nodes).clone()};c.prototype.append=function(a){var b=a;this.endComment.before(b),this.nodes.push(b)},c.prototype.clear=function(){this.setHtml("")},c.prototype.createTemplate=function(){return this.template.clone()},c.prototype.setAttribute=function(a,b){this.startComment.attr(a,b)},c.prototype.getAttribute=function(a){return this.startComment.attr(a)},c.prototype.getHtml=function(){throw"Not available"},c.prototype.setHtml=function(a){for(var b=0;b<this.nodes.length;++b)this.$(this.nodes[b]).remove();this.nodes=[],$content=this.$(a),this.startComment.after($content),this.nodes.push($content)},c.prototype.setValue=function(a){for(var b=0;b<this.nodes.length;++b)this.$(this.nodes[b]).val(a)},c.prototype.getValue=function(){return this.$(this.nodes).val()},c.prototype.hide=function(){this.$(this.nodes).hide()},c.prototype.on=function(a,b){this.$(this.nodes).on(a,b)},c.prototype.show=function(){this.$(this.nodes).show()},b.exports=c},{}],YouMe:[function(a,b){b.exports=a("u88BNT")},{}],u88BNT:[function(a,b){var c=a("./Application"),d=a("./Parsing/DocumentParsers/CommentParser"),e=a("./Parsing/DocumentParsers/DocumentParser"),f=a("./Parsing/CommandParsers/CommandParser"),g=a("./Execution/Interpreters/ConditionEvaluator"),h=a("./Execution/Interpreters/AttributeInterpreter"),i=a("./Execution/Interpreters/ForInterpreter"),j=a("./Execution/Interpreters/IfInterpreter"),k=a("./Execution/Interpreters/InputInterpreter"),l=a("./Execution/Interpreters/SaveInterpreter"),m=a("./Execution/Interpreters/TextInterpreter"),n=a("./Execution/Interpreters/UserDefinedInterpreter"),o=a("./Execution/Storages/MockStorage");b.exports=function(a){return{application:new c([new d,new e],new f),storage:a||new o,createMockStorage:function(a){return new o(a)},set:function(a,b){return this.storage.set(a,b),this.application.refresh(),this},unset:function(a){return this.storage.unset(a),this.application.refresh(),this},get:function(a,b){return this.storage.get(a,b),this},has:function(a){return this.storage.has(a),this},save:function(){return this.storage.save(),this},on:function(a,b){return this.application.on(a,b),this},off:function(a,b){return this.application.off(a,b),this},trigger:function(a){this.application.trigger(a)},addCommand:function(a,b){return this.application.interpreters.push(new n(this.storage,a,b)),this},addScriptDependency:function(a,b){return b=b||function(){return!0},this.application.addDependency("script",a,b),this},addStyleDependency:function(a,b,c){return b=b||function(){return!0},this.application.addDependency("style",a,b,c),this},fuse:function(a,b,c){b=b||"youme",c=c||{},this.application.rootNode=a,this.application.hookName=b;for(var d,e=[new h(this.storage,new g),new i(this.storage),new k(this.storage),new j(this.storage,new g),new l(this.storage),new m(this.storage)],f=0;d=e[f];++f)this.application.interpreters.push(d);return this.application.run(c)}}}},{"./Application":1,"./Execution/Interpreters/AttributeInterpreter":2,"./Execution/Interpreters/ConditionEvaluator":3,"./Execution/Interpreters/ForInterpreter":4,"./Execution/Interpreters/IfInterpreter":5,"./Execution/Interpreters/InputInterpreter":6,"./Execution/Interpreters/SaveInterpreter":8,"./Execution/Interpreters/TextInterpreter":9,"./Execution/Interpreters/UserDefinedInterpreter":10,"./Execution/Storages/MockStorage":11,"./Parsing/CommandParsers/CommandParser":13,"./Parsing/DocumentParsers/CommentParser":14,"./Parsing/DocumentParsers/DocumentParser":15}]},{},["u88BNT"])("u88BNT")});

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
        // We transform our application interface in an advanced application interface using YouMe
        MyAwesomeService = YouMe();

        // This interactive guide depends on highlight.js (http://highlightjs.org/) .So we are going to load it and its style..
        // The first arguments for those functions is the url of the dependency to load.
        // The second argument is a user define function which is supposed to check if the dependency should be load (and avoid doubles).
        // The third argument is a function defining the actions to take once the dependency is loaded.
        MyAwesomeService.addStyleDependency('http://yandex.st/highlightjs/8.0/styles/sunburst.min.css', function () {
            return !(window.hljs);
        });
        MyAwesomeService.addScriptDependency('http://yandex.st/highlightjs/8.0/highlight.min.js', function () {
            return !(window.hljs);
        }, function(application) {
            window.hljs.configure({useBR: true});

            application.$('code.html').each(function(i, e) {hljs.highlightBlock(e, 'html')});
            application.$('code.js').each(function(i, e) {hljs.highlightBlock(e, 'js')});
        });

        // For the sake of this interactive guide we're using a mock storage built-in YouMe.
        // In a real case scenario you shoud define your own storage and pass it to the YouMe() function.
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
    }
};
