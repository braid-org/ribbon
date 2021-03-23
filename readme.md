# Ribbon

A microblog on the Braid. Demonstrates the [Braid-HTTP](https://braid.news) protocol.

## Getting Started

To get started locally, run:

```
yarn install
./certs.sh
```

This will install localhost TLS certificates, which is necessary because HTTP 1.1 allows for only 6 simultaneous connections. Braid takes advantage of HTTP 2.0 multiplexing to access more than 6 subscriptions at a time.

Note that you may need to give your browser permission to use the provided self-signed TLS certificate. For example, on Chrome you can enable insecure localhost via the flag at `chrome://flags/#allow-insecure-localhost`. 

Next:

```
yarn start
```

This starts TWO dev servers simultaneously:

```
http://localhost:3000  <-- Back-end Braid server
http://localhost:8080  <-- Front-end Snowpack server
```

If you edit any code in the client or server, the typescript will automatically re-compile and the browser should re-load so you can instantly see the change.

## Running in Production

You can also run Ribbon in a "production" environment, meaning you have your own domain certificate for TLS, and you want Ribbon to run on a single port.

First, run `yarn build` in the project root. This will build the front-end code served by Snowpack into a javascript bundle (i.e. Snowpack is no longer needed) and then copy the bundle to the server's public directory.

There are three environment variables you can use to configure Ribbon:

```
# The "origin" must be `https` and have a domain and port (of your choice):
export RIBBON_ORIGIN=https://mydomain.com:4005

# The "key" is the path to the file holding your domain's private key
export RIBBON_KEY=/home/deploy/ribbon/server/keys/mydomain.key

# The "cert" is the path to the file holding your domain's certificate
export RIBBON_CERT=/home/deploy/ribbon/server/keys/mydomain.cert
```

With those env vars set, you need start ONLY the server (note that `yarn start` in the project root will start both the server and the client):

```
cd server # <-- important
yarn start
```

You can check your config by visiting, e.g. `https://mydomain.com:4005/config.js`.

## Project Structure

```
(root) [yarn workspaces]
 |
 +- server [nodejs server]
 |
 +- client [svelte/snowpack front end client]
```

## Subprotocol

The Braid protocol constrains certain aspects of the way Ribbon communicates with other servers, but the protocol leaves a great deal unspecified. Below is a kind of Ribbon-specific "sub-protocol" that outlines our design decisions at the protocol level:

### Schema

```
/author/NAME/posts -> [
  {
    "resource": "https://localhost:3000/author/NAME/post/0",
    "post": {"title": "Hello", "body": "World"}
  },...]
/author/NAME/post/N -> {"index": N, "title": "Hello", "body": "World"}
/author/NAME/likes -> [{"$link":"https://invisible.college:4545/post/2"}]
```

It's possible this schema will change in the future, for example, by incorporating `mf2+json` as a schema for post entries.

### Getting Data

Ribbon follows the Braid spec for getting data: if you send a `Subscribe: keep-alive` header in your request, the HTTP request will be kept open and subsequent changes to that resource will be sent as patches. If you don't send a `Subscribe` header, you'll get the current state of the resource returned as a regular HTTP GET response body.

Try loading http://localhost:3000/author/default/posts or http://localhost:3000/author/default/post/0 directly to see how you can still use a regular GET to see Braid data.

You can also use `curl` on the commande-line to subscribe to posts:

```
curl -k -H 'Subscribe: keep-alive` http://localhost:3000/author/default/posts
```

Then add a post and you'll see the update come through in the command line.

### Setting Data

Currently, Ribbon supports only the 'append' operation on `posts` and `likes`:

1. **Append to the list of blog Posts:** using the Braid protocol, send a PATCH request with a json range of `[-0:-0]` and a patch body with an object `{"title": "x", "body": "y"}` to the `posts` resource, e.g. `https://localhost:3000/author/default/posts`. The range `[-0:-0]` means "select from after the end to after the end" and replace nothing with something (a link to a blog post, in this case). This will update the list of links to posts to include a new link at the end.
2. **Append to the list of Likes:** using the Braid protocol, send a PATCH request with a json range of `[-0:-0]` and a patch body with an object `{"$link": "https://..."}` to the `likes` resource, e.g. `https://localhost:3000/author/default/likes`. 

Currently, no `Parents` or `Version` headers are used (specified in the Braid protocol).
