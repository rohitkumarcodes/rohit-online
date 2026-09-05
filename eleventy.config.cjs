const pluginRss = require("@11ty/eleventy-plugin-rss");
const { injectIntrinsicImageDimensions, normalizeFeedMedia } = require("./scripts/feed-media.cjs");
const SITE_HOSTS = new Set(["rohit.onl", "www.rohit.onl"]);
const FEED_OUTPUT_PATH = "/feed/index.html";

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

function isExternalHttpHref(href) {
  if (!href) {
    return false;
  }

  try {
    const url = new URL(href, "https://rohit.onl");
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    return !SITE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function withSafeExternalLinks(content) {
  if (!content) {
    return content;
  }

  return content.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/\bhref=(["'])(.*?)\1/i);
    if (!hrefMatch || !isExternalHttpHref(hrefMatch[2])) {
      return match;
    }

    const nextAttrs = attrs
      .replace(/\s+\btarget=(["']).*?\1/gi, "")
      .replace(/\s+\brel=(["']).*?\1/gi, "");

    return `<a${nextAttrs} target="_blank" rel="noopener noreferrer">`;
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.amendLibrary("md", (markdownLib) => {
    markdownLib.set({
      html: true,
      linkify: true,
    });

    const defaultLinkOpen =
      markdownLib.renderer.rules.link_open ||
      ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

    markdownLib.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const href = tokens[idx].attrGet("href");
      if (isExternalHttpHref(href)) {
        tokens[idx].attrSet("target", "_blank");
        tokens[idx].attrSet("rel", "noopener noreferrer");
      }

      return defaultLinkOpen(tokens, idx, options, env, self);
    };
  });

  eleventyConfig.addCollection("publishedPosts", (collectionApi) =>
    collectionApi
      .getFilteredByTag("posts")
      .filter((item) => item.data.permalink !== false)
      .filter((item) => item.data.eleventyExcludeFromCollections !== true)
      .sort((left, right) => toDate(right.date) - toDate(left.date)),
  );

  eleventyConfig.addFilter("postDate", (value) => {
    const date = toDate(value);
    return new Intl.DateTimeFormat("en", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(date);
  });

  eleventyConfig.addFilter("rfc3339Date", (value) => toDate(value).toISOString());
  eleventyConfig.addFilter("feedMedia", (html, postUrl) =>
    normalizeFeedMedia(html, {
      postUrl,
      rootDir: __dirname,
    }),
  );
  eleventyConfig.addFilter("safeExternalLinks", withSafeExternalLinks);
  eleventyConfig.addFilter("startsWithHeading", (html) => /^\s*<h[1-6]\b/i.test(html || ""));
  eleventyConfig.addFilter("plainExcerpt", (html, maxLength = 180) => {
    const text = (html || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}\u2026`;
  });

  eleventyConfig.addTransform("safe-external-links", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html") || outputPath.endsWith(FEED_OUTPUT_PATH)) {
      return content;
    }

    return withSafeExternalLinks(content);
  });

  eleventyConfig.addTransform("add-image-dimensions", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html") || outputPath.endsWith(FEED_OUTPUT_PATH)) {
      return content;
    }

    return injectIntrinsicImageDimensions(content, {
      rootDir: __dirname,
    });
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["md", "njk"],
  };
};
