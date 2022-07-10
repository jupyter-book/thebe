const cdn = "https://cdn.jsdelivr.net/npm/";

/**
 * Load a package using requirejs and return a promise
 *
 * @param pkg Package name or names to load
 */
function requirePromise(moduleName: string) {
  return new Promise((resolve, reject) =>
    window.requirejs([`${moduleName}`], resolve, reject)
  );
}

function moduleNameToCDNUrl(moduleName: string, moduleVersion: string) {
  let packageName = moduleName;
  let fileName = "index"; // default filename
  // if a '/' is present, like 'foo/bar', packageName is changed to 'foo', and path to 'bar'
  // We first find the first '/'
  let index = moduleName.indexOf("/");
  if (index !== -1 && moduleName[0] === "@") {
    // if we have a namespace, it's a different story
    // @foo/bar/baz should translate to @foo/bar and baz
    // so we find the 2nd '/'
    index = moduleName.indexOf("/", index + 1);
  }
  if (index !== -1) {
    fileName = moduleName.substr(index + 1);
    packageName = moduleName.substr(0, index);
  }
  return `${cdn}${packageName}@${moduleVersion}/dist/${fileName}`;
}

async function requireFromCDN(moduleName: string, moduleVersion: string) {
  const url = moduleNameToCDNUrl(moduleName, moduleVersion);
  const conf: { paths: { [key: string]: string } } = { paths: {} };
  conf.paths[moduleName] = moduleNameToCDNUrl(moduleName, moduleVersion);
  window.requirejs.config(conf);

  try {
    // note: await needed here for try/catch behaviour
    const module = requirePromise(moduleName);
    return module;
  } catch (err: any) {
    console.error(`thebe:loader requirejs error on cdn require`, err);
    throw err;
  }
}

/**
 * Load an amd module locally and fall back to specified CDN if unavailable.
 *
 * @param moduleName The name of the module to load..
 * @param version The semver range for the module, if loaded from a CDN.
 *
 * By default, the CDN service used is cdn.jsdelivr.net. However, this default can be
 * overridden by specifying another URL via the HTML attribute
 * "data-jupyter-widgets-cdn" on a script tag of the page.
 *
 * The semver range is only used with the CDN.
 */
export async function requireLoader(
  moduleName: string,
  moduleVersion: string,
  useCDNOnly: boolean = false
): Promise<any> {
  if (window.requirejs === undefined) {
    console.error(`thebe:loader requirejs is undefined`);
    throw new Error(
      "Requirejs is needed, please ensure it is loaded on the page."
    );
  }
  console.log(`thebe:loader loading ${moduleName}@${moduleVersion}`);
  if (useCDNOnly) {
    return requireFromCDN(moduleName, moduleVersion);
  } else {
    try {
      // Try to load the module locally
      // note: await needed here for try/catch behaviour
      const module = await requirePromise(moduleName);
      return module;
    } catch (err: any) {
      const failedId = err.requireModules && err.requireModules[0];
      window.requirejs.undef(failedId);
      if (!failedId) {
        console.error(`thebe:loader requirejs error on local require`, err);
        throw err;
      } else {
        // If it fails, try to load it from the CDN
        console.debug(
          `thebe:loader falling back to ${cdn} for ${moduleName}@${moduleVersion}`
        );
        window.requirejs.undef(failedId);
        return requireFromCDN(moduleName, moduleVersion);
      }
    }
  }
}
