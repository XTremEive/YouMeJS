var VirtualNode = function (startComment, nodes, endComment)
{
    this.startComment = $(startComment);
    this.nodes = $(nodes);
    this.endComment = $(endComment);
};

VirtualNode.prototype.append = function(content)
{
    this.endComment.before(content);
};

VirtualNode.prototype.clear = function()
{
    this.html('');
};

VirtualNode.prototype.createTemplate = function()
{
    return this.nodes.clone().get(0);
};

VirtualNode.prototype.html = function(htmlContent)
{
    this.nodes.remove();
    this.startComment.after(htmlContent);
};

VirtualNode.prototype.setValue = function(value)
{
    this.nodes.val(value);
};

VirtualNode.prototype.getValue = function()
{
    return this.nodes.val();
};

VirtualNode.prototype.hide = function()
{
    this.nodes.hide();
};

VirtualNode.prototype.on = function(eventName, callback)
{
    this.nodes.on(eventName, callback);
};

VirtualNode.prototype.show = function()
{
    this.nodes.show();
};

// Exports
module.exports = VirtualNode;