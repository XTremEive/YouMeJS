var NormalNode = function(node)
{
    this.node = $(node);
    this.template = this.node.clone();
};

NormalNode.prototype.append = function(content)
{
    this.node.append(content);
};

NormalNode.prototype.clear = function()
{
    this.setHtml('');
};

NormalNode.prototype.createTemplate = function()
{
    return this.template.children().clone();
};
NormalNode.prototype.getAttribute = function(name)
{
    return this.node.attr(name);
};
NormalNode.prototype.setAttribute = function(name, value)
{
    return this.node.attr(name, value);
};
NormalNode.prototype.getHtml = function()
{
    return this.node.html();
};
NormalNode.prototype.setHtml = function(htmlContent)
{
    this.node.html(htmlContent);
};
NormalNode.prototype.setValue = function(value)
{
    this.node.val(value);
};

NormalNode.prototype.getValue = function()
{
    return this.node.val();
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