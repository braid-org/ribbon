import fs from "fs";
import { join } from "path";

import { dataDir } from "./config";
import { Author, makeAuthor } from "./makeAuthor";

function readDataDir(path: string): Array<[PropertyKey, any]> {
  return fs.readdirSync(path).map((filename) => {
    const filePath = join(path, filename);
    const shortname: string = filename.replace(".json", "");
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return [shortname, content];
  });
}

function resourceToInitial(resource) {
  return {
    value: resource.value,
    version: resource.version,
  };
}

export function saveAuthor(author: Author) {
  const filename = `${author.shortname}.json`;
  const path = join(dataDir, filename);
  const data = JSON.stringify(
    {
      shortname: author.shortname,
      posts: resourceToInitial(author.posts),
      likes: resourceToInitial(author.likes),
    },
    null,
    2
  );
  fs.writeFileSync(path, data, "utf8");
}

export function loadAuthors(): Record<string, Author> {
  const data = readDataDir(dataDir);
  const arr = data.map((entry) => [entry[0], makeAuthor(entry[1])]);
  const value = Object.fromEntries(new Map(arr as any));
  return value as Record<string, Author>;
}
