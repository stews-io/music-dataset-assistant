import { throwInvalidPathError } from "library/throwInvalidPathError.ts";
import { render as preactRender, h as preactH } from "preact";
import { ClientApp } from "./ClientApp.tsx";

Object.assign(globalThis, {
  h: preactH,
});

preactRender(
  preactH(ClientApp, {}),
  document.getElementById("appContainer") ??
    throwInvalidPathError("preactRender.appContainer")
);
