import { router as authorsRouter } from "./authors";
import { router as messagesRouter } from "./messages";

export function serverApi(app) {
  app.use(authorsRouter);
  app.use(messagesRouter);
}
