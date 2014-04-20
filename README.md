YouMeJS
===

What is it?
---

YouMe is a [Knockout](https://github.com/knockout/knockout) inspired Javascript library created to help web widget developers injecting logic into their partners websites.


What does it do?
---

Check out the source code in `/demo/index.html`.

Requirements
---

- [jQuery](https://github.com/jquery/jquery) on the client's page.

Can I use it in production?
---

**Not really, no.**. This project is a work in progress, and as such it has yet to be documented or even tested in a production environment.


But I want to use it anyway.
---

A build of the library is available in the `/build/release/` folder. But I encourage you to use [Knockout](https://github.com/knockout/knockout) instead for this kind of work.

Developer additional documentation
---

### A typical storage class

Even if YouMe works out of the box with the MockStorage. You will have to provide thie library with your own "Storage" in order to make it useful.
Here is an example of a storage class. You can additionally take a look at the MockStorage class for more informations.


```js
var Storage = function(data)
{
    this.data = data;

};

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