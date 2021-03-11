import { router as postsRouter } from "./posts";
import { router as likesRouter } from "./likes";
import { router as feedRouter } from "./feed";
import { send, error } from "./utils";
import { authors } from "./authors";
import { Router } from "express";

function withAuthor(request, response, next) {
  request.author = authors.value[request.params.shortname];
  if (request.author) next();
  else error(response, "author not found", 404);
}

export function serverApi(app) {
  app.use("/author/:shortname", withAuthor, [
    postsRouter,
    likesRouter,
    feedRouter,
  ]);
}
