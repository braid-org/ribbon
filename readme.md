# braidjs

This project shows how we might use typescript for all of the following:
- braidjs library
- a server that depends on braidjs
- a client that depends on braidjs

## project structure

```
(root) [yarn workspaces]
 |
 +- braidjs [library]
 |
 +- examples/server [server that depends on braidjs]
 |
 +- examples/client [client that depends on braidjs]
```

## tools

1. yarn - package manager; provides workspaces so that examples can depend on the braidjs lib without complicated linking or re-installing
2. typescript - type checker; superset of javascript; we use `tsc` to compile to plain js
3. ts-node-dev - nodejs, but with typescript support & watches for changes so you don't have to manually restart the server
4. snowpack - front-end build tool
5. svelte - reactive front-end library

