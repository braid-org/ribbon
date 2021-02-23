/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: "/",
    src: "/dist",
  },
  plugins: ["@snowpack/plugin-typescript", "@snowpack/plugin-svelte"],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: "es2018",
  },
  alias: {
    "node-web-streams": "./src/shim/node-web-streams.js"
  },
  packageOptions: {
    // Useful for 'assert' in browser, for example
    polyfillNode: true
  },
  devOptions: {},
  buildOptions: {},
};
