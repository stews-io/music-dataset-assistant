import { parse as parseDenoArgs } from "deno_std/flags/mod.ts";
import { contentType as getContentType } from "deno_std/media_types/mod.ts";
import { extname as getPathExtension } from "deno_std/path/mod.ts";
import * as PathToRegexp from "path-to-regexp";

serveClient({
  buildDirectoryPath: `${parseDenoArgs(Deno.args)._[0]}`,
});

interface ServeClientApi {
  buildDirectoryPath: string;
}

function serveClient(api: ServeClientApi) {
  const { buildDirectoryPath } = api;
  Deno.serve({ port: 8080 }, async (someRequest: Request) => {
    try {
      const unmodifiedRequestPathname = new URL(someRequest.url).pathname;
      console.log(unmodifiedRequestPathname);
      const emptyPathRegexp = PathToRegexp.pathToRegexp("/");
      const rewriteRequestPathnameToIndexHtml = emptyPathRegexp.test(
        unmodifiedRequestPathname
      );
      const filePath = `${buildDirectoryPath}${
        rewriteRequestPathnameToIndexHtml
          ? "/index.html"
          : unmodifiedRequestPathname
      }`;
      console.log(filePath);
      console.log("\n");
      const responseContentLength = (await Deno.stat(filePath)).size;
      const responseContentType =
        getContentType(getPathExtension(filePath)) ??
        "application/octet-stream";
      const responseBody = (await Deno.open(filePath)).readable;
      return new Response(responseBody, {
        headers: {
          "content-length": `${responseContentLength}`,
          "content-type": responseContentType,
        },
      });
    } catch (someError) {
      console.error(someError);
      return someError instanceof Deno.errors.NotFound
        ? new Response(null, { status: 404 })
        : new Response(null, { status: 500 });
    }
  });
}
