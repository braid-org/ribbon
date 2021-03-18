export function capitalize(string) {
  if (string && string.length >= 1) {
    return string.substring(0, 1).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
}
