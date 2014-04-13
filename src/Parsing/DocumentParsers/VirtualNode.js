var VirtualNode = function (startComment, nodes, endComment)
{
    this.startComment = startComment;
    this.nodes = nodes;
    this.endComment = endComment;
};

VirtualNode.prototype.html = function(htmlContent)
{
    $(this.nodes).remove();
    $(this.startComment).after(htmlContent);
};

// Exports
module.exports = VirtualNode;