export default async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/feed.xml") {
    url.pathname = "/feed/";
    url.search = "";
    return Response.redirect(url, 301);
  }

  if (
    (url.pathname === "/feed" || url.pathname === "/feed/") &&
    url.searchParams.get("type") === "rss"
  ) {
    url.pathname = "/feed/";
    url.search = "";
    return Response.redirect(url, 301);
  }
};
