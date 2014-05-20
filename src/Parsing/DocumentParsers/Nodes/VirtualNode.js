/**
 *
 * This class represents a node created from an HTML comment (Knockout's style).
 * A node is basically a DOM abstraction that our library will consider as the lowest component of a web page.
 * They basically abstract DOM manipulation.
 *
 * @param node An HTMLElement
 * @constructor
 */
var VirtualNode = function ($, startComment, nodes, endComment)
{
    this.$ = $;
    this.startComment = $(startComment);
    this.nodes = nodes;
    this.endComment = $(endComment);
    this.template = $(this.nodes).clone();
};

VirtualNode.prototype.append = function(content)
{
    var $content = content;
    this.endComment.before($content);
    this.nodes.push($content);
};

VirtualNode.prototype.clear = function()
{
    this.setHtml('');
};

VirtualNode.prototype.createTemplate = function()
{
    return this.template.clone();
};

VirtualNode.prototype.setAttribute = function(name, value)
{
    this.startComment.attr(name, value);
};

VirtualNode.prototype.unsetAttribute = function(name)
{
    return this.$(this.nodes).removeAttr(name);
};

VirtualNode.prototype.getAttribute = function(name)
{
    return this.startComment.attr(name);
};

VirtualNode.prototype.getHtml = function()
{
    throw "Not available";
};

VirtualNode.prototype.setHtml = function(htmlContent)
{
    for(var i = 0; i < this.nodes.length; ++i)
    {
        this.$(this.nodes[i]).remove();
    }
    this.nodes = [];

    $content = this.$(htmlContent);
    this.startComment.after($content);
    this.nodes.push($content);
};

VirtualNode.prototype.setValue = function(value)
{
    for(var i = 0; i < this.nodes.length; ++i)
    {
        this.$(this.nodes[i]).val(value);
    }
};

VirtualNode.prototype.getValue = function()
{
    return this.$(this.nodes).val();
};

VirtualNode.prototype.hide = function()
{
    this.$(this.nodes).hide();
};

VirtualNode.prototype.on = function(eventName, callback)
{
    this.$(this.nodes).on(eventName, function(event) {
        event.preventDefault();

        callback(event);
    });
};

VirtualNode.prototype.show = function()
{
    this.$(this.nodes).show();
};

// Exports
module.exports = VirtualNode;