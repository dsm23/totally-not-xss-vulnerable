import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Web site created with vite for demonstrating a XSS vulnerability"
        />
        <meta property="og:title" content="Totally not XSS Vulnerable" />
        <meta
          property="og:description"
          content="Web site created with vite for demonstrating a XSS vulnerability"
        />
        {/*<!-- Icon by <a href='https://iconpacks.net/?utm_source=link-attribution&utm_content=16976'>Iconpacks</a> -->*/}
        <meta
          property="og:image"
          content="https://totally-not-xss-vulnerable.davidmurdoch.site/xss.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta
          property="og:image:alt"
          content="A flat icon depicting a desktop window with the text xss"
        />
        <title>Totally not XSS Vulnerable</title>
        <Meta />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
