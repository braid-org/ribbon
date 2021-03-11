import { router as postsRouter } from "./posts";
import { router as likesRouter } from "./likes";
import { router as feedRouter } from "./feed";
import { error } from "./utils";
import { authors, Author } from "./authors";

/**
 * If an author's `shortname` is available as a param, add the
 * corresponding Author to the request object at `request.author`.
 */
function withAuthor(request, response, next) {
  const author: Author = authors.value[request.params.shortname];
  if (!author) error(response, "author not found", 404);

  request.author = author;
  next();
}

export function serverApi(app) {
  app.use("/author/:shortname", withAuthor, [
    // We let each of the author-based routers have a go at
    // matching the URL, in turn.
    postsRouter,
    likesRouter,
    feedRouter,
  ]);
}
