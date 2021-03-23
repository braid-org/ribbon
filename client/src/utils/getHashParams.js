export function getHashParams() {
  return window.location.hash
    .replace(/^#/, "")
    .split("&")
    .reduce((acc, pair) => {
      const parts = pair.split("=");
      acc[parts[0]] = parts[1];
      return acc;
    }, {});
}
