# CHANGELOG

### 3.0.7

- Only bump eventemitter3 to latest.

### 3.0.6

- Revert dependencies bump of 3.0.5

### 3.0.5

- Bumped dependencies to latest

### 3.0.4

- Remove `peerDependencies` It's a nice concept, but it's output is confusing
  when we're used as optional dependency in projects.

### 3.0.3

- Remove `diagnostics` as we didn't do any useful debugging, and were causing
  an require cycle for React-Native where storage-engine was depended upon
  by diagnostics, which we dependend up..

### 3.0.2

- Added support for ordering to fix plugin/modifier race conditions.

### 3.0.1

- Ensure that our compatibility check is also ran against the `lib` folder
  so the correct library is also loaded for our ES5 build.

### 3.0.0

- Complete rewrite of internals.

### 2.0.1

- Encode falsy values, update tests/mocks to reflect string requirement from
  AsyncStorage.

### 2.0.0

- Now encodes and decodes data automatically as JSON values.

### 1.0.1

- Added a pre-build, non es6 version so it can more easily be imported for
  testing purposes.
