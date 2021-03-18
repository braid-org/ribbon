export function possessive(string) {
  if (string.toLowerCase() === "default") {
    return "My";
  } else {
    return string + "'s";
  }
}
