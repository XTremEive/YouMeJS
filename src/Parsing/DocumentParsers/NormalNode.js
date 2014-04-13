var NormalNode = function(node)
{
    this.node = $(node);
};

NormalNode.prototype.html = function(htmlContent)
{
    this.node.html(htmlContent);
};

// Exports
module.exports = NormalNode;