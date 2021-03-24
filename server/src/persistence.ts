import fs from "fs";
import { join } from "path";

import { dataDir } from "./config";
import { Author, makeAuthor } from "./makeAuthor";

function readDataDir(path: string): Array<[PropertyKey, any]> {
  return fs.readdirSync(path).map((fileName) => {
    const filePath = join(path, fileName);
    const shortname: string = fileName.replace(".json", "");
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    content.shortname = shortname;
    return [shortname, content];
  });
}

export function save() {}

export function load(): Record<string, Author> {
  const data = readDataDir(dataDir);
  const arr = data.map((entry) => [entry[0], makeAuthor(entry[1])]);
  const value = Object.fromEntries(new Map(arr as any));
  return value as Record<string, Author>;
}
