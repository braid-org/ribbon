export function postHtml(data) {
  return `<div class="h-entry">
    <div class="p-name">${data.post.title}</div>
    <div class="e-content">${data.post.body}</div>
    <div class="u-url">${data.resource}</div>
  </div>`;
}

export function postsPageHtml(shortname, pageUrl, postsData) {
  return `<html>
  <head>
    <title>${shortname}'s Posts</title>
    <style>.h-entry{margin:16px} .p-name{font-weight:bold}</style>
  </head>
  <body>
  <h1>${shortname}'s Posts</h1>
  <div class="authorship">
    Posts by <a class="h-card" href="${pageUrl}">${shortname}</a>
  </div>
  ${postsData.map((data) => postHtml(data)).join("\n")}
  </body>
  </html>`;
}
