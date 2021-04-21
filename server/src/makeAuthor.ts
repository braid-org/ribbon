export type InitialAuthor = {
  shortname: string;
};

export type Author = {
  shortname: string;
};

export function makeAuthor(initial: InitialAuthor): Author {
  return { shortname: initial.shortname };
}

export const asRecords = (prefix: string) => (
  authors: Record<string, Author>
) => {
  return Object.keys(authors).map((shortname) => ({
    resource: `${prefix}/author/${shortname}`,
    shortname,
  }));
};
