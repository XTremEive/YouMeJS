YouMeJS
===

What is it?
---

YouMe is a [Knockout](https://github.com/knockout/knockout) inspired library create to help web widget developers injecting logic into their partners websites.


What does it do?
---

Check out the source code of */demo/index.html*.

Requirements
---

-[jQuery](https://github.com/jquery/jquery) on the client's page.

Can I use it in production?
---

**At your own risk**.
This project is a work in progress, and as such it has yet to be documented or even tested in a production environment.
However a build of the library is available in the `/build/release/` folder.
If you really want to play with those kind of features I encourage you to use [Knockout](https://github.com/knockout/knockout) instead.

Developer additional documentation
---

### A typical storage class
```js
var Storage = function(data)
{
    this.data = data;

};

Storage.prototype = Object.create(Storage.prototype);

Storage.prototype.set = function(key, value)
{
    throw "This will be called when your application tries to set a variable in the storage.";

    return this;
};

Storage.prototype.get = function(key, defaultValue)
{
    throw "This will be called your application tries to get a variable from the storage. If you don't have the variable please return the defaultValue argument.";

    return defaultValue;
};

Storage.prototype.unset = function(key)
{
    throw "The will be called when your application tries to remove a variable from the storage.";

    return this;
};

Storage.prototype.has = function(key)
{
    throw "This will be called when your application tries to check if a variable exists in your storage.";

    return false;
};

Storage.prototype.save = function()
{
    throw "This is called when your application try to save this storage. Is typically when you send stored data to your server or something..!";

    return this;
};

// Exports
module.exports = Storage;
```