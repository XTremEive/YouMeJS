var Storage = function(data)
{
    this.data = data;

};

Storage.prototype = Object.create(Storage.prototype);

Storage.prototype.set = function(key, value)
{
    throw "Not implemented!";

    return this;
};

Storage.prototype.get = function(key, defaultValue)
{
    throw "Not implemented!";
};

Storage.prototype.unset = function(key)
{
    throw "Not implemented!";

    return this;
};

Storage.prototype.save = function()
{
    throw "Not implemented!";

    return this;
};

// Exports
module.exports = Storage;