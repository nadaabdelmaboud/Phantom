const path = require('path');
const fs = require('fs');

//
// Story time children:
//
// As the code we write for React-Native is compiled by the metro bundler at
// compile time, it means it cannot support conditional requires and would
// throw when we attempt to require a non-existing file. So in order to support
// both the react-native-community as well as the regular React-native
// AsyncStorage API's we need to do this feature detection upon installation
// and display the correct file. Thats why this file is executed on `postinstall`
// of the package.
//
// When we can resolve @react-native-community/async-storage we know it's
// installed as a dependency, and it would be save to use that api. If we
// cannot resolve it, we assume we need to use the React-Native based API
// instead and use that as entry file.
//
(function () {
  //
  // We're also bundling compiled code, so we want to make sure that our `lib`
  // folder also updates it's detection script when we run
  //
  const lib = path.join(__dirname, '..', 'lib', 'compatibility', 'detect.js');
  if (fs.existsSync(lib)) require(lib);

  try { require.resolve('@react-native-community/async-storage'); }
  catch (e) {
    const rnative = fs.readFileSync(path.join(__dirname, 'react-native.js'));
    return fs.writeFileSync(path.join(__dirname, 'index.js'), rnative);
  }

  //
  // It could be that the index.js file was previously replaced with the
  // react-native version, so ensure that the index is still the community.js
  // file content.
  //
  const community = fs.readFileSync(path.join(__dirname, 'community.js'));
  fs.writeFileSync(path.join(__dirname, 'index.js'), community);
}())
