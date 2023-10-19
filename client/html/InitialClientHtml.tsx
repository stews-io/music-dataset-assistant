import { JSX } from "preact";

export interface InitialClientHtmlProps {}

export function InitialClientHtml(props: InitialClientHtmlProps): JSX.Element {
  const {} = props;
  return (
    <html lang={"en"}>
      <head>
        <title>{"music dataset assistant"}</title>
        <meta
          name={"description"}
          content={"an app for building music datasets"}
        />
        <meta charSet={"utf-8"} />
        <meta
          name={"viewport"}
          content={"width=device-width,initial-scale=1"}
        />
        <meta name={"mobile-web-app-capable"} content={"yes"} />
        <meta name={"apple-mobile-web-app-capable"} content={"yes"} />
      </head>
      <body>
        <div id={"appContainer"} />
        <script src={`/app.js`} />
      </body>
    </html>
  );
}
