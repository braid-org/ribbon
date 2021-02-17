# Ribbon

A microblog on the Braid. Demonstrates the [Braid-HTTP](https://braid.news) protocol.

## Getting Started

To get started locally, run:

```
yarn install
yarn start
```

You can also run TLS on the backend, which is recommended because HTTP 1.1 allows for only 6 simultaneous connections. Braid takes advantage of HTTP 2.0 multiplexing to access more than 6 subscriptions at a time:

```
yarn start-http2
```

Note that you may need to give your browser permission to use the provided self-signed TLS certificate. For example, on Chrome you can enable insecure localhost via the flag at `chrome://flags/#allow-insecure-localhost`.

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
/posts -> [{"$link": "/post/0"},{"$link": "/post/1"},...]
/post/N -> {"index": N, "title": "Hello", "body": "World"}
/likes -> [{"url":"https://invisible.college:4545/post/2"}]
```
{"$link": "https://invisible.college:4545/post/2"},{"$link": "https://invisible.college:4545/posts"}

/feed

/posts
/post


It's possible this schema will change in the future, for example, by incorporating `mf2+json` as a schema for post entries.

### Getting Data

Ribbon follows the Braid spec for getting data: if you send a `Subscribe: keep-alive` header in your request, the HTTP request will be kept open and subsequent changes to that resource will be sent as patches. If you don't send a `Subscribe` header, you'll get the current state of the resource returned as a regular HTTP GET response body.

### Setting Data

Currently, Ribbon supports two types of operations:

1. Create a new blog Post: send a regular PUT request to /post/N where N is the next available integer in the sequence of Post indices, and a new blog post will be created with that index.
2. Append to the list of blog Posts: using the Braid protocol, send a PATCH request with a json range of `[-0:-0]` and a patch body with a new `link` to the post resource just created. The range `[-0:-0]` means "select from after the end to after the end" and replace nothing with something (a link to a blog post, in this case). This will update the list of links to posts to include a new link at the end.

Currently, no `Parents` or `Version` headers are used (specified in the Braid protocol).

## Getting started

```
yarn install
yarn start
```
