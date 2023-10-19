import { join as getJoinedPath } from "deno_std/path/mod.ts";
import {
  build as bundleApp,
  stop as closeEsbuild,
  Plugin as EsbuildPlugin,
} from "esbuild";
import { denoPlugins as esbuildDenoAdapterPlugins } from "esbuild_deno_loader";
import { createElement } from "preact";
import { renderToString as preactRenderToString } from "preact-render-to-string";
import { InitialClientHtml } from "../client/html/InitialClientHtml.tsx";

await buildClient({
  buildDirectoryPath: "./__build",
});
closeEsbuild();

interface BuildClientApi {
  buildDirectoryPath: string;
}

async function buildClient(api: BuildClientApi) {
  const { buildDirectoryPath } = api;
  await Deno.mkdir(buildDirectoryPath, {
    recursive: true,
  });
  const clientAppScript = await bundleApp({
    platform: "browser",
    format: "iife",
    outdir: "out",
    bundle: true,
    write: false,
    minify: false,
    entryPoints: ["./client/app/main.ts"],
    plugins: [
      ...(esbuildDenoAdapterPlugins({
        loader: "native",
        configPath: `${Deno.cwd()}/deno.json`,
      }) as Array<EsbuildPlugin>),
    ],
    tsconfigRaw: {
      compilerOptions: {
        jsxFactory: "h",
        jsxFragmentFactory: "Fragment",
      },
    },
  });
  await Promise.all([
    Deno.writeTextFile(
      getJoinedPath(buildDirectoryPath, "./index.html"),
      `<!DOCTYPE html>${preactRenderToString(
        createElement(InitialClientHtml, {})
      )}`
    ),
    Deno.writeTextFile(
      getJoinedPath(buildDirectoryPath, "./app.js"),
      clientAppScript.outputFiles[0]!.text
    ),
  ]);
}
