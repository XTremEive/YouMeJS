var NormalNode = function(node)
{
    this.node = $(node);
};

NormalNode.prototype.append = function(content)
{
    this.node.append(content);
};

NormalNode.prototype.clear = function()
{
    this.html('');
};

NormalNode.prototype.createTemplate = function()
{
    return this.node.children().clone().get(0);
};

NormalNode.prototype.html = function(htmlContent)
{
    this.node.html(htmlContent);
};

NormalNode.prototype.hide = function()
{
    this.node.hide();
};

NormalNode.prototype.on = function(eventName, callback)
{
    this.node.on(eventName, callback);
};

NormalNode.prototype.show = function()
{
    this.node.show();
};

// Exports
module.exports = NormalNode;