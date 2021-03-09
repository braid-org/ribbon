import { Post, initialPosts } from "./initialPosts";

const origin = process.env.RIBBON_SERVER_ORIGIN || "http://localhost:3000";

type Resource<T> = {
  version: number;
  subscriptions: Set<any>;
  value: T;
  serialize: (value: T) => string
};

const posts: Resource<Record<string, Post>> = {
  version: 0,
  subscriptions: new Set(),
  value: Object.assign({}, initialPosts),
  serialize: (value) => JSON.stringify(Object.entries(posts.value).map(([key, value]) => ({
    resource: `${origin}/post/${key}`,
    ...value,
  })))
};

export function ribbonAPI(app) {
  app.get("/posts", (request, response) => {
    const allPosts = posts.serialize(posts.value);
    if (request.subscribe) {
      response.startSubscription()
      response.sendVersion({
        version: posts.version,
        body: allPosts,
      });
      posts.subscriptions.add(response);
    } else {
      console.log("normal GET");
      send(response, allPosts);
    }
  });

  app.put("/posts", async (request, response) => {
    const patches = await request.patches();
    if (patches.length > 0) {
      // Possibly more than one thing can be appended
      for (const patch of patches) {
        // We only accept appending via 'json' content-range type
        if (patch.unit === "json" && patch.range === "[-0:-0]") {
          const content = JSON.parse(patch.content);
          // New posts must belong to this server
          if (content.resource && content.resource.indexOf(origin) === 0) {
            // New posts must follow the /post/ID path pattern
            const match = content.resource
              .slice(origin.length)
              .match(/^\/post\/([^\/]+)$/);
            if (match) {
              const id = match[1];
              // Must be a new post
              if (!(id in posts.value)) {
                posts.value[id] = content;
              } else {
                error(response, `'${content.resource}' already exists`);
                return;
              }
            } else {
              error(
                response,
                "path of 'resource' must match pattern '/post/[ID]'"
              );
              return;
            }
          } else {
            error(response, `origin of 'resource' must be '${origin}'`);
            return;
          }
        } else {
          error(response, "only appending to posts is supported");
          return;
        }
      }
    } else {
      error(response, "patch required");
    }

    // Increment version & send an update to any subscribers
    update(posts);

    // Acknowledge post(s) appended
    send(response, { success: true });
  });
}

function update<T>(resource: Resource<T>) {
  resource.version++;
  for (const response of resource.subscriptions) {
    response.sendVersion({
      version: resource.version,
      body: resource.serialize(resource.value),
    });
  }
}

function send(response, json, statusCode = 200) {
  response.statusCode = statusCode;
  response.end(typeof json === 'string' ? json : JSON.stringify(json));
}

function error(response, message, statusCode = 400) {
  send(response, { error: message }, statusCode);
}
