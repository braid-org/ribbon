export function send(response, json, statusCode = 200) {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(json, null, 2));
}

export function error(response, message, statusCode = 400) {
  send(response, { error: message }, statusCode);
}
