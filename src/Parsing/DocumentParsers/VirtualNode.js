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

VirtualNode.prototype.hide = function()
{
    this.nodes.hide();
};

VirtualNode.prototype.show = function()
{
    this.nodes.show();
};

// Exports
module.exports = VirtualNode;