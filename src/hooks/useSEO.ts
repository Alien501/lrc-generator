import { useEffect } from "react";

type MetaAttr = "name" | "property";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: "website" | "article" | "product";
  siteName?: string;
  locale?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const setMeta = (attr: MetaAttr, key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const clearJsonLd = () => {
  document
    .querySelectorAll('script[type="application/ld+json"][data-seo]')
    .forEach((n) => n.remove());
};

export const useSEO = ({
  title,
  description,
  keywords,
  image,
  imageAlt,
  url,
  type = "website",
  siteName = "LRC Generator",
  locale = "en_US",
  twitterCard = "summary_large_image",
  twitterSite = "@Alien501",
  twitterCreator,
  robots = "index, follow, max-image-preview:large",
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    document.title = title;

    // --- Base ---
    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);
    setMeta("name", "robots", robots);

    // --- Open Graph ---
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:locale", locale);
    if (url) setMeta("property", "og:url", url);
    if (image) {
      setMeta("property", "og:image", image);
      setMeta("property", "og:image:width", "1200");
      setMeta("property", "og:image:height", "630");
      if (imageAlt) setMeta("property", "og:image:alt", imageAlt);
    }

    // --- Twitter Card (name, NOT property) ---
    setMeta("name", "twitter:card", twitterCard);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (twitterSite) setMeta("name", "twitter:site", twitterSite);
    if (twitterCreator) setMeta("name", "twitter:creator", twitterCreator);
    if (image) {
      setMeta("name", "twitter:image", image);
      if (imageAlt) setMeta("name", "twitter:image:alt", imageAlt);
    }

    // --- Canonical ---
    if (url) setLink("canonical", url);

    // --- JSON-LD (replace, don't accumulate) ---
    clearJsonLd();
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      for (const block of blocks) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seo = "true";
        script.textContent = JSON.stringify(block);
        document.head.appendChild(script);
      }
    }

    // On unmount, drop JSON-LD so the next route doesn't see two schemas.
    // Meta tags are intentionally left; the next route's useSEO overwrites them.
    return clearJsonLd;
  }, [
    title,
    description,
    keywords,
    image,
    imageAlt,
    url,
    type,
    siteName,
    locale,
    twitterCard,
    twitterSite,
    twitterCreator,
    robots,
    jsonLd,
  ]);
};