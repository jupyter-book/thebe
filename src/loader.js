// TODO; Import the version from @jupyter-widgets/html-manager

var requirePromise = function(pkg) {
  return new Promise(function(resolve, reject) {
    var require = window.require;
    if (require === undefined) {
      reject("Requirejs is needed, please ensure it is loaded on the page.");
    } else {
      require(pkg, resolve, reject);
    }
  });
};

function moduleNameToCDNUrl(moduleName, moduleVersion) {
  let packageName = moduleName;
  let fileName = "index"; // default filename
  // if a '/' is present, like 'foo/bar', packageName is changed to 'foo', and path to 'bar'
  // We first find the first '/'
  let index = moduleName.indexOf("/");
  if (index != -1 && moduleName[0] == "@") {
    // if we have a namespace, it's a different story
    // @foo/bar/baz should translate to @foo/bar and baz
    // so we find the 2nd '/'
    index = moduleName.indexOf("/", index + 1);
  }
  if (index != -1) {
    fileName = moduleName.substr(index + 1);
    packageName = moduleName.substr(0, index);
  }
  return `https://unpkg.com/${packageName}@${moduleVersion}/dist/${fileName}`;
}

export function requireLoader(moduleName, moduleVersion) {
  return requirePromise([`${moduleName}`]).catch(err => {
    let failedId = err.requireModules && err.requireModules[0];
    if (failedId) {
      console.log(
        `Falling back to unpkg.com for ${moduleName}@${moduleVersion}`
      );
      let require = window.requirejs;
      if (require === undefined) {
        throw new Error(
          "Requirejs is needed, please ensure it is loaded on the page."
        );
      }
      const conf = { paths: {} };
      conf.paths[moduleName] = moduleNameToCDNUrl(moduleName, moduleVersion);
      require.undef(failedId);
      require.config(conf);
      return requirePromise([`${moduleName}`]);
    }
  });
}
