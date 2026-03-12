const pluginRss = require("@11ty/eleventy-plugin-rss");

const SITE_HOSTS = new Set(["rohit.online", "www.rohit.online"]);
const EMAIL_SIGNUP_PLACEHOLDER = /\{\{\s*email-signup\s*\}\}/g;
const EMAIL_SIGNUP_MARKUP = `
<section class="signup-shell">
  <h2>Subscribe</h2>
  <p>Email signup is not connected yet. This placeholder is carried over from the Bear export.</p>
  <form class="signup-form" aria-label="Email signup placeholder">
    <label for="email-address">Email address</label>
    <input id="email-address" name="email" type="email" placeholder="you@example.com" disabled>
    <button type="submit" disabled>Subscribe</button>
  </form>
</section>
`.trim();

function normalizeHref(href) {
  if (!href) {
    return { href, external: false };
  }

  if (href.startsWith("tab:")) {
    return {
      href: href.slice(4),
      external: true,
    };
  }

  if (href === "/feed/" || href === "/feed" || href === "/feed.xml") {
    return { href: "/feed/", external: false };
  }

  try {
    const parsed = new URL(href);

    if (SITE_HOSTS.has(parsed.hostname)) {
      if (
        parsed.pathname === "/feed/" ||
        parsed.pathname === "/feed" ||
        parsed.pathname === "/feed.xml"
      ) {
        return { href: "/feed/", external: false };
      }

      const normalizedPath = `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
      return { href: normalizedPath, external: false };
    }
  } catch {}

  return { href, external: false };
}

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

function coerceFrontMatterValue(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "null" || value === "~") {
    return null;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseRelaxedFrontMatter(source) {
  const root = {};
  const stack = [{ indent: -1, value: root }];
  const lines = source.split(/\r?\n/);

  for (const rawLine of lines) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) {
      continue;
    }

    const indent = rawLine.match(/^ */)[0].length;
    const trimmed = rawLine.trim();
    const separatorIndex = trimmed.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trimStart();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].value;

    if (rawValue === "") {
      parent[key] = {};
      stack.push({ indent, value: parent[key] });
      continue;
    }

    parent[key] = coerceFrontMatterValue(rawValue);
  }

  return root;
}

function normalizeHtmlContent(content) {
  if (!content) {
    return content;
  }

  let normalized = content.replace(
    /href=(["'])([^"']+)\1/g,
    (_match, _quote, href) => {
      const next = normalizeHref(href);
      const externalAttrs = next.external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `href="${next.href}"${externalAttrs}`;
    },
  );

  normalized = normalized.replace(
    /<p>\s*\{\{\s*email-signup\s*\}\}\s*<\/p>/g,
    EMAIL_SIGNUP_MARKUP,
  );

  normalized = normalized.replace(EMAIL_SIGNUP_PLACEHOLDER, EMAIL_SIGNUP_MARKUP);
  normalized = normalized.replace(
    /<p>&lt;img src=&quot;<a href="([^"]+)">[^<]+<\/a>&quot; width=&quot;(\d+)&quot;&quot; alt=&quot;([^"]*)&quot;&gt;<\/p>/g,
    '<img src="$1" width="$2" alt="$3">',
  );

  return normalized;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.setFrontMatterParsingOptions({
    engines: {
      yaml: parseRelaxedFrontMatter,
    },
  });

  eleventyConfig.amendLibrary("md", (markdownLib) => {
    markdownLib.set({
      html: true,
      linkify: true,
    });
  });

  eleventyConfig.addCollection("publishedPosts", (collectionApi) =>
    collectionApi
      .getFilteredByTag("posts")
      .filter((item) => item.data.publish !== false)
      .sort(
        (left, right) => toDate(right.data.published_date) - toDate(left.data.published_date),
      ),
  );

  eleventyConfig.addFilter("postDate", (value) => {
    const date = toDate(value);
    return new Intl.DateTimeFormat("en", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(date);
  });

  eleventyConfig.addFilter("rfc3339Date", (value) => toDate(value).toISOString());
  eleventyConfig.addFilter("startsWithHeading", (html) => /^\s*<h[1-6]\b/i.test(html || ""));
  eleventyConfig.addFilter("normalizeContent", normalizeHtmlContent);
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

  eleventyConfig.addTransform("normalize-bear-content", function (content, outputPath) {
    if (
      !outputPath ||
      !outputPath.endsWith(".html") ||
      outputPath.endsWith("/feed/index.html")
    ) {
      return content;
    }

    return normalizeHtmlContent(content);
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
