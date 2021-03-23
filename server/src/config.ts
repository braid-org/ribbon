function getPortFromOrigin() {
  const origin = process.env.RIBBON_ORIGIN;
  if (origin) {
    const match = origin.match(/:(\d+)$/);
    if (match) return match[1];
  }
}

export const port = process.env.PORT || getPortFromOrigin() || 3000;

export const origin = process.env.RIBBON_ORIGIN || `https://localhost:${port}`;

export const populateInitialPosts =
  process.env.RIBBON_INITIAL_POSTS === "0" ? false : true;
