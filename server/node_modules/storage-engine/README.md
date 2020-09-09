# storage-engine

The `storage-engine` module is an high level abstraction for React-Native's
AsyncStorage. It allows you to easily customize the AsyncStorage using
plugins. These plugins can be applied to all keys, or just specific key patterns
giving you immense flexibility in the storage layer that you're creating.

## Installation

The package is released in the public npm registry and can be installed
by running:

```sh
npm install --save storage-engine
```

The `AsyncStorage` API has been moved to the React-Native Community as part
of their lean-core initiative and should now be installed as separate package:

```sh
npm install --save @react-native-community/async-storage
react-native link @react-native-community/async-storage
```

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [before](#before)
  - [after](#after)
  - [plugin](#plugin)
    - [Plugin API](#plugin-api)
  - [destroy](#destroy)
  - [api](#api)
  - [getItem](#getitem)
  - [setItem](#setitem)
  - [removeItem](#removeitem)
  - [mergeItem](#mergeitem)
  - [clear](#clear)
  - [getAllKeys](#getallkeys)
  - [flushGetRequests](#flushgetrequests)
  - [multiGet](#multiget)
  - [multiSet](#multiset)
  - [multiMerge](#multimerge)
  - [multiRemove](#multiremove)
- [License](#license)

## Usage

```js
import storage, { StorageEngine } from 'storage-engine';
```

We export a pre-initialized `StorageEngine` class by default so you can use
the API directly when you import the module. If you wish, you can create your
own instance by initializing a new `StorageEngine` class.

The storage instance has the following methods:

- [before](#before)
- [after](#after)
- [plugin](#plugin)
- [destroy](#destroy)
- [api](#api)

Enhanced `AsyncStorage` methods:

- [getItem](#getitem)
- [setItem](#setitem)
- [removeItem](#removeitem)
- [mergeItem](#mergeitem)
- [clear](#clear)
- [getAllKeys](#getallkeys)
- [flushGetRequests](#flushgetrequests)
- [multiGet](#multiget)
- [multiSet](#multiset)
- [multiMerge](#multimerge)
- [multiRemove](#multiremove)

### before

The `before` method allows you to **pre-process any AsyncStorage API call**.
You can intercept the request, change values, or even change keys. Want to merge
data with an remote data source? We gotchu, want to cancel a request, hell yeah.

```js
import storage from 'storage-engine';

storage.before('key*, another, more*', {
  setItem: function ({ key, value, method }) {
    console.log(method);  // setItem
    console.log(key);     // key-here
    console.log(value);   // bar

    return {
      value: 'Completely different value'
    }
  }
});

storage.after('*', {
  setItem: function ({ key, value, method }) {
    console.log(method);  // setItem
    console.log(key);     // key-here
    console.log(value);   // Completely different value
  },
  getItem: function ({ key, value, method }) {
    console.log(method);  // getItem
    console.log(key);     // key-here
    console.log(value);   // undefined
  }
})

await storage.setItem('key-here', 'bar');
const value = await storage.getItem('key-here');

console.log(value);   // Completely different value
```

In the example above, we've added a before hook that is triggered when the
`setItem` api is called. We can see which key is used, and which value would
be assigned. We've then returned a completely different value from the hook
which would be stored instead of the original provided value.

The `before` method accepts the following arguments:

- **`key`** A pattern of keys that would need to trigger the assigned `before`
  method. It can be `key1, key1, another-key` or use the `*` wildcard for all
  keys, or even a combination `key*, another-key, *bar`, which would match
  `key1`, `key0afaf`, `another-key`, `foobar`, `bbar` etc.
- **`methods`** An object where the key's are the names of the methods you
  would like to pre-process, and the value the `(async)function` that would
  handle the pre-processing. If you supply a `(async)function` instead of an
  object, it would be called for all available methods.
- **`options`** Additional options:
  - `order`: Allows you control the order of execution of your function, placing
    before or after other added methods in the execution chain. The order is
    set by default to `100` if no option is provided. The higher value, the
    important it is to execute this function early. So a `9000` will be executed
    before a order `100` and an order of `0` would be executed last.

### After

Exactly the same interface as `before`, but instead of **pre processing** this
method allows you to **post process** the response of the AsyncStorage API
call.

See [before](#before) for API and example.

### plugin

The plugin API allows you to load any custom plugin that can enhance your
storage instance. A plugin is basically an `(async) function` that is executed
with a bunch of plugin helper functions.

```js
import storage from 'storage-engine';
import { expire } from 'storage-modifiers';

storage.use('token*', expire, {
  duration: '30 minutes'
});

storage.use('pattern*', async function example(plugin) {
  const { before, after, destroy, options } = plugin;

  //
  // Main difference here is that plugins don't need to prefix before and
  // after functions with the pattern, this is done automatically.
  //
  before({
    getItem: () => {}
  });

  destroy(function () {
    //
    // Called when `storage.destroy()` is invoked.
    //
  });

  console.log(options); // { options: 'here'}
}, {
  options: 'here'
});
```

The plugin API accepts the following arguments:

- `pattern` The key pattern that it should be triggered on.
- `plugin` The actual plugin which can be an `async` or normal JavaScript
  function that will be executed with our [Plugin API](#plugin-api).
- `options` Additional options for the plugin.

>
> Please note, we do offer default plugins which are available in a separate
> module, [storage-modifiers](./modifiers) which provides useful features such
> as:
>
> - json: Automatic encoding, and decoding of values
> - emit: Emits an event when a given key, or method is accessed (configurable)
> - expire: Expires key/values based on a given TTL
> - encrypt: Adds an additional layer of protection by encrypting the data you
>   store.
>

#### Plugin API

When the plugin is executed by the [plugin](#plugin) it will be executed with
an `object` that contains the following properties and helper functions.

- `before` Reference to the [before](#before) method, but prefixed by default
  with the `pattern` that was supplied to the plugin.
- `after` Reference to the [after](#after) method, but prefixed by default
  with the `pattern` that was supplied to the plugin.
- `enabled` Function that checks if the passed `key` argument is enabled by
  the pattern that was supplied to the plugin, returns a boolean, `enabled(key)`.
- `destroy` Function that allows you to register a (async) clean-up callback
  which is executed when the [destroy](#destroy) method is called.
- `pattern` The pattern that was supplied to the [plugin](#plugin) as first
  argument.
- `engine` Reference to the initialized storage instance.
- `options` The options that was supplied to the [plugin](#plugin) as third
  argument.

### destroy

Destroy the initialized `storage` instance by removing all plugins, before,
and after hooks. This will call any `destroy` hook that are defined by plugins
but it **does not trigger the clear method**, so the data that you stored is
untouched.

```js
import storage from 'storage-engine';

storage.before('*', {
  setItem: () => ({
    value: 'all your values are this now, lol'
  })
});

await storage.setItem('foo', 'bar');
await storage.getItem('foo') // all your values are this now, lol

await storage.destroy();

await storage.setItem('foo', 'bar');
await storage.getItem('foo') // bar
```

### api

Provides direct access to the AsyncStorage API that we're wrapping. This API
will not execute any of the plugins or before/after modifications that are
registered. This is the API we use internally to communicate with `AsyncStorage`.

```js
import storage from 'storage-engine';

await storage.api('setItem', 'foo', 'bar');
```

The method accepts the following arguments:

- `method` The name of the method that needs to be executed.
- `...args` The args that you would have normally passed into the original API.

---

The rest of the API methods are the API methods that exist on the AsyncStorage
API that is provided by React-Native / React-Native Community. Some of the API
have been enhanced to allow a more sensible argument or return format. For
example, we only allow the async/await interface instead of an additional 3rd
callback argument. We're just gonna go briefly over this API and make the
assumption that you already have prior knowledge of the existing React-Native
AsyncStorage API:

---

### getItem

The `getItem` allows you to retrieve a previously stored value. When the value
does not exist, a `null` will be returned instead.

```js
const value = await storage.getItem('key');
console.log(value); // key
```

- `key` The key of the value you want to retrieve.

### setItem

Stores a new item. Yup, that's it.

```js
await storage.setItem('key', 'value');
```

- `key` The key where the value will be stored at.
- `value` The contents that needs to be stored, should be string, unless
  a plugin allows you to use a different format.

### removeItem

Removes the previously stored value.

```js
await storage.removeItem('key');
```

- `key` The key of the value you want to remove.

### mergeItem

Merge the contents of the key, with the supplied value.

```js
await storage.mergeItem('key', '{"json": "here"}');
```

- `key` The key of the value you want to update.
- `value` A stringified JSON object that will be merged with the existing value

### clear

Removes **all** the data that you've stored. Everything. Gone. Forever. Like
it never existed. This method is officially approved by Thanos.

```js
await storage.clear();
```

### getAllKeys

Retrieve all keys that are stored in the AsyncStorage.

```js
const keys = await storage.getAllKeys();
```

### flushGetRequests

Does anyone actually this method? Why am I even documenting this.

```js
await storage.flushGetRequests();
```

### multiGet

Retrieves multiple values at once.

```js
const [one, two] = await storage.multiGet(['one', 'two']);

// one: { key: one, value: ... }
// two: { key: two, value: ... }
```

> The data that is returned by the **multi** API is slightly different, as we've
> wrapped each item in an object which has `key`, and `value` property.

### multiSet

Store multiple values at once.

```js
await storage.multiSet([
  ['one', 'value'],
  ['two', 'another value']
]);

//
// Also supported:
//
await storage.multiSet([
  { key: 'one', value: 'value' },
  { key: 'two', value, 'another value' }
]);
```

> The data that is returned by the **multi** API is slightly different, as we've
> wrapped each item in an object which has `key`, and `value` property.

### multiMerge

Merge multiple values at once.

```js
await storage.multiMerge([
  ['key', '{"json": "blob"}'],
  ['another', '{"cow": "moo"}']
]);

//
// Also supported:
//
await storage.multiMerge([
  { key: 'key', value: '{"json": "blob"}'},
  { key: 'another', value: '{"cow":"moo"}'}
]);
```

> The data that is returned by the **multi** API is slightly different, as we've
> wrapped each item in an object which has `key`, and `value` property.

### multiRemove

Thanos multiple keys at once.

```js
await storage.multiRemove(['one', 'two']);
```

> The data that is returned by the **multi** API is slightly different, as we've
> wrapped each item in an object which has `key`, and `value` property.

## License

[MIT](LICENSE)
