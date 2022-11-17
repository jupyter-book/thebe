import type { IRequireJS } from './requireJsLoader';

const cdn = 'https://cdn.jsdelivr.net/npm/';

/**
 * Load a package using requirejs and return a promise
 */
function requirePromise(requirejs: IRequireJS, moduleName: string) {
  return new Promise((resolve, reject) => requirejs.require([`${moduleName}`], resolve, reject));
}

/**
 * The URL structure is /npm/package@version/file.js
 */
function moduleNameToCDNUrl(moduleName: string, moduleVersion: string) {
  let packageName = moduleName;
  let fileName = 'index'; // default filename
  // if a '/' is present, like 'foo/bar', packageName is changed to 'foo', and path to 'bar'
  // We first find the first '/'
  let index = moduleName.indexOf('/');
  if (index !== -1 && moduleName[0] === '@') {
    // if we have a namespace, it's a different story
    // @foo/bar/baz should translate to @foo/bar and baz
    // so we find the 2nd '/'
    index = moduleName.indexOf('/', index + 1);
  }
  if (index !== -1) {
    fileName = moduleName.substr(index + 1);
    packageName = moduleName.substr(0, index);
  }
  return `${cdn}${packageName}@${moduleVersion}/dist/${fileName}`;
}

async function requireFromCDN(requirejs: IRequireJS, moduleName: string, moduleVersion: string) {
  const url = moduleNameToCDNUrl(moduleName, moduleVersion);
  const conf: { paths: { [key: string]: string } } = { paths: {} };
  conf.paths[moduleName] = url;
  requirejs.require.config(conf);

  try {
    // note: await needed here for try/catch behaviour
    const module = await requirePromise(requirejs, moduleName);
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
  requirejs: IRequireJS,
  moduleName: string,
  moduleVersion: string,
  useCDNOnly = false,
): Promise<any> {
  console.log(`thebe:loader loading ${moduleName}@${moduleVersion}`);
  if (useCDNOnly) {
    return requireFromCDN(requirejs, moduleName, moduleVersion);
  } else {
    if (requirejs.require.defined(moduleName)) {
      return requirePromise(requirejs, moduleName);
    }
    console.debug(`thebe:loader falling back to ${cdn} for ${moduleName}@${moduleVersion}`);
    return requireFromCDN(requirejs, moduleName, moduleVersion);
  }
}
