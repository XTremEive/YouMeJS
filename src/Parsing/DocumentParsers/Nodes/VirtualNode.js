var VirtualNode = function (startComment, nodes, endComment)
{
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
        $(this.nodes[i]).remove();
    }
    this.nodes = [];

    $content = $(htmlContent);
    this.startComment.after($content);
    this.nodes.push($content);
};

VirtualNode.prototype.setValue = function(value)
{
    for(var i = 0; i < this.nodes.length; ++i)
    {
        $(this.nodes[i]).val(value);
    }
};

VirtualNode.prototype.getValue = function()
{
    return $(this.nodes).val();
};

VirtualNode.prototype.hide = function()
{
    $(this.nodes).hide();
};

VirtualNode.prototype.on = function(eventName, callback)
{
    $(this.nodes).on(eventName, callback);
};

VirtualNode.prototype.show = function()
{
    $(this.nodes).show();
};

// Exports
module.exports = VirtualNode;