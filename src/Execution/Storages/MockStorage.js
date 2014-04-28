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

/**
 * Set a value in this storage.
 * Additionally you can a do a "flag" set, by calling set with only one parameter. The value will be set to one.
 * @param key The name of the variable to set in the storage.
 * @param value The value to store in the set varaible.
 * @returns {MockStorage} This
 */
MockStorage.prototype.set = function(key, value)
{
    // Handle "flag" set.
    if (1 == arguments.length)
    {
        value = 1;
    }

    // Store the value
    this.data[key] = value;

    // Return
    return this;
};

/**
 * Get a value from this storage. If not found it will return the provided defaultValue
 * @param key The name of the variable to retrieve from this storage.
 * @param defaultValue A default value to return if the variable wasn't found. (optional)
 * @returns {*} The stored variable.
 */
MockStorage.prototype.get = function(key, defaultValue)
{
    return this.data[key] ? this.data[key] : defaultValue;
};

/**
 * Return whether this storage contains the given variable or not.
 * @param key The name of the variable to check.
 * @returns {boolean} TRUE if the variable exists, FALSE otherwise.
 */
MockStorage.prototype.has = function(key)
{
    return key in this.data;
};

/**
 * Delete a varaible from this storage.
 * @param key The name of the variable to delete.
 * @returns {MockStorage} This
 */
MockStorage.prototype.unset = function(key)
{
    delete this.data[key];

    return this;
};

/**
 * Persist the storage.
 *
 * @returns {MockStorage}
 */
MockStorage.prototype.save = function()
{
    var message = "YouMe's MockStorage is now saving: " + JSON.stringify(this.data);

    alert(message);
    console.log(message);

    return this;
};

// Exports
module.exports = MockStorage;