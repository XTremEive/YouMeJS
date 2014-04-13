var NormalNode = function(node)
{
    this.node = $(node);
};

NormalNode.prototype.html = function(htmlContent)
{
    this.node.html(htmlContent);
};

NormalNode.prototype.hide = function()
{
    this.node.hide();
};

NormalNode.prototype.show = function()
{
    this.node.show();
};

// Exports
module.exports = NormalNode;