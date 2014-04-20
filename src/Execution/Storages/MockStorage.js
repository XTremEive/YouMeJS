/**
 * The Mock storage is the default storage provided by our library. It's their for the sake of providing a sandbox
 * for testing the library. A web widget developer will typically write a class which looks like this one.
 *
 * @param data
 * @constructor
 */
var MockStorage = function(data)
{
    this.data = data || {};
};

MockStorage.prototype.set = function(key, value)
{
    // Handle "flag" set.
    if (1 == arguments.length)
    {
        value = 1;
    }

    this.data[key] = value;

    return this;
};

MockStorage.prototype.get = function(key, defaultValue)
{
    return this.data[key] ? this.data[key] : defaultValue;
};

MockStorage.prototype.has = function(key)
{
    return key in this.data;
};

MockStorage.prototype.unset = function(key)
{
    delete this.data[key];

    return this;
};

MockStorage.prototype.save = function()
{
    var message = "YouMe's MockStorage is now saving: " + JSON.stringify(this.data);

    alert(message);
    console.log(message);

    return this;
};

// Exports
module.exports = MockStorage;