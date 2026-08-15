function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    // "/results/" -> "/results/index.html"
    request.uri += "index.html";
  } else if (!uri.includes(".")) {
    // "/results" -> "/results/index.html"
    request.uri += "/index.html";
  }
  // Anything with a file extension already (e.g. /favicon.ico) is left untouched.

  return request;
}