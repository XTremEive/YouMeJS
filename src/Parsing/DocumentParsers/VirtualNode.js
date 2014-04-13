var VirtualNode = function (startComment, nodes, endComment)
{
    this.startComment = $(startComment);
    this.nodes = $(nodes);
    this.endComment = $(endComment);
    this.template = this.nodes.clone();
};

VirtualNode.prototype.append = function(content)
{
    this.endComment.before(content);
};

VirtualNode.prototype.clear = function()
{
    this.setHtml('');
};

VirtualNode.prototype.createTemplate = function()
{
    return this.template.clone().get(0);
};


VirtualNode.prototype.setAttribute = function()
{
    throw "Not available";
}
VirtualNode.prototype.getAttribute = function()
{
    throw "Not available";
}

VirtualNode.prototype.getHtml = function()
{
    throw "Not available";
}

VirtualNode.prototype.setHtml = function(htmlContent)
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