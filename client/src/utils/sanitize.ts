export function sanitize(string) {
  if (string && string.length >= 1) {
    return string
      .toLowerCase()
      .replace(/[^a-z\-]+/, "-")
      .replace(/^\-+/, "")
      .replace(/\-+$/, "");
  } else {
    return string;
  }
}
