// oxlint-disable import/no-unassigned-import -- Allow side effect imports only in root route
import "temporal-polyfill/global";
import "zod/compile";
// oxlint-enable import/no-unassigned-import
import { type ReactNode } from "react";

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useLocale } from "react-aria/I18nProvider";

import { Footer } from "#components/layout/Footer";
import { Navbar } from "#components/layout/Navbar";
import { AppProvider } from "#components/misc/AppProvider";
import { LocaleProvider } from "#components/misc/LocaleProvider";
import { m } from "#paraglide/messages";
import {
  baseLocale,
  deLocalizeUrl,
  locales,
  localizeUrl,
} from "#paraglide/runtime";
import { getBaseUrl } from "#utils/getBaseUrl";
import { seo } from "#utils/seo";
import uiCss from "@exifi/ui/globals.css?url";

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const canonicalUrl = new URL(pathname, getBaseUrl()).toString();
  const { locale, direction } = useLocale();

  return (
    /**
     * `suppressHydrationWarning` is necessary since `<html>` element must be
     * updated by `next-themes` for dark mode. The property only applies one
     * level deep, so hydration warnings won't be blocked on children elements.
     *
     * @see {@link https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors}
     */
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <link rel="canonical" href={canonicalUrl} />
        {locales.map((linkLocale) => (
          <link
            key={linkLocale}
            rel="alternate"
            hrefLang={linkLocale}
            href={(linkLocale === baseLocale
              ? deLocalizeUrl(canonicalUrl)
              : localizeUrl(canonicalUrl, { locale: linkLocale })
            ).toString()}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={deLocalizeUrl(canonicalUrl).toString()}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="twitter:url" content={canonicalUrl} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
};

const RootComponent = () => {
  return (
    <LocaleProvider>
      <RootDocument>
        <AppProvider>
          <Navbar />
          <main className="grid grid-cols-1">
            <Outlet />
          </main>
          <Footer />
        </AppProvider>
      </RootDocument>
    </LocaleProvider>
  );
};

const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ...seo({
        title: m.layout_seo_site_title(),
        description: m.layout_seo_site_description(),
        keywords: m.layout_seo_site_keywords().split(","),
        image: {
          url: `${getBaseUrl()}/og-image.png`,
          type: "image/png",
          width: 1200,
          height: 600,
          alt: m.layout_seo_og_image_alt(),
        },
      }),
    ],
    links: [
      { rel: "stylesheet", href: uiCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "apple-touch-icon",
        type: "image/png",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/android-chrome-512x512.png",
      },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  component: RootComponent,
});

export { Route };
