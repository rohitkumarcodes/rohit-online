const { parser } = require("posthtml-parser");
const { render } = require("posthtml-render");
const { capDimensions, getLocalImageDimensions } = require("./media-dimensions.cjs");

const FEED_MAX_WIDTH = 640;
const FEED_MAX_HEIGHT = 640;

function parseFragment(html) {
  return parser(html || "");
}

function renderFragment(nodes) {
  return render(nodes || []);
}

function isTag(node, tagName) {
  return Boolean(node && typeof node === "object" && node.tag === tagName);
}

function cloneNode(node) {
  if (typeof node === "string") {
    return node;
  }

  if (!node || typeof node !== "object") {
    return node;
  }

  return {
    ...node,
    attrs: node.attrs ? { ...node.attrs } : undefined,
    content: Array.isArray(node.content) ? node.content.map(cloneNode) : node.content,
  };
}

function parseStyleAttribute(styleText) {
  const order = [];
  const values = new Map();

  for (const declaration of String(styleText || "").split(";")) {
    const [property, ...valueParts] = declaration.split(":");
    const key = property.trim().toLowerCase();
    const value = valueParts.join(":").trim();
    if (!key || !value) {
      continue;
    }

    if (!values.has(key)) {
      order.push(key);
    }

    values.set(key, value);
  }

  return { order, values };
}

function mergeInlineStyles(existingStyle, additions) {
  const parsed = parseStyleAttribute(existingStyle);

  for (const [property, value] of Object.entries(additions)) {
    if (!parsed.values.has(property)) {
      parsed.order.push(property);
      parsed.values.set(property, value);
    }
  }

  return parsed.order.map((property) => `${property}: ${parsed.values.get(property)}`).join("; ");
}

function hasExplicitDimensions(attrs = {}) {
  return Object.prototype.hasOwnProperty.call(attrs, "width") || Object.prototype.hasOwnProperty.call(attrs, "height");
}

function getCaptionText(node) {
  if (typeof node === "string") {
    return node;
  }

  if (!node || typeof node !== "object" || !Array.isArray(node.content)) {
    return "";
  }

  return node.content.map(getCaptionText).join("");
}

function needsSpacer(content) {
  if (!Array.isArray(content) || content.length === 0) {
    return false;
  }

  const lastNode = content[content.length - 1];
  if (typeof lastNode !== "string") {
    return true;
  }

  return !/\s$/.test(lastNode);
}

function makeLinkNode(href, text) {
  return {
    tag: "a",
    attrs: { href },
    content: [text],
  };
}

function makeFeedLinkParagraph(href, text) {
  return {
    tag: "p",
    content: [makeLinkNode(href, text)],
  };
}

function decorateImageNode(node, options = {}) {
  const nextNode = cloneNode(node);
  const attrs = nextNode.attrs || {};
  const mode = options.mode || "page";

  if (mode === "feed") {
    attrs.style = mergeInlineStyles(attrs.style, {
      "max-width": "100%",
      height: "auto",
    });
  }

  if (!attrs.src || hasExplicitDimensions(attrs)) {
    nextNode.attrs = attrs;
    return nextNode;
  }

  const intrinsicDimensions = getLocalImageDimensions(attrs.src, options);
  if (!intrinsicDimensions) {
    nextNode.attrs = attrs;
    return nextNode;
  }

  const dimensions =
    mode === "feed"
      ? capDimensions(intrinsicDimensions, FEED_MAX_WIDTH, FEED_MAX_HEIGHT)
      : intrinsicDimensions;

  attrs.width = String(dimensions.width);
  attrs.height = String(dimensions.height);
  nextNode.attrs = attrs;
  return nextNode;
}

function appendFeedLinkToCaption(captionNode, href, text) {
  const nextCaption = isTag(captionNode, "figcaption")
    ? cloneNode(captionNode)
    : {
        tag: "figcaption",
        content: [],
      };

  nextCaption.content = Array.isArray(nextCaption.content) ? nextCaption.content : [];
  if (needsSpacer(nextCaption.content)) {
    nextCaption.content.push(" ");
  }
  nextCaption.content.push(makeLinkNode(href, text));
  return nextCaption;
}

function makePosterImageNode(src, captionNode, options) {
  const captionText = getCaptionText(captionNode).trim();
  return decorateImageNode(
    {
      tag: "img",
      attrs: {
        src,
        alt: captionText || "Video preview",
      },
    },
    { ...options, mode: "feed" },
  );
}

function buildPosterFigure(figureNode, videoNode, captionNode, options) {
  const posterHref = options.postUrl;
  const posterImage = makePosterImageNode(videoNode.attrs.poster, captionNode, options);
  const figure = {
    tag: "figure",
    attrs: figureNode.attrs ? { ...figureNode.attrs } : undefined,
    content: [
      {
        tag: "a",
        attrs: { href: posterHref },
        content: [posterImage],
      },
      appendFeedLinkToCaption(captionNode, posterHref, "Watch video on site"),
    ],
  };

  return [figure];
}

function buildFallbackFigure(figureNode, captionNode, options, linkText) {
  return [
    {
      tag: "figure",
      attrs: figureNode.attrs ? { ...figureNode.attrs } : undefined,
      content: [
        makeLinkNode(options.postUrl, linkText),
        appendFeedLinkToCaption(captionNode, options.postUrl, "Open post"),
      ],
    },
  ];
}

function transformFigureNode(node, options) {
  const content = Array.isArray(node.content) ? node.content : [];
  const captionNode = content.find((child) => isTag(child, "figcaption"));
  const videoNode = content.find((child) => isTag(child, "video"));
  if (videoNode) {
    if (videoNode.attrs && videoNode.attrs.poster) {
      return buildPosterFigure(node, videoNode, captionNode, options);
    }

    return buildFallbackFigure(node, captionNode, options, "Watch video on site");
  }

  const iframeNode = content.find((child) => isTag(child, "iframe"));
  if (iframeNode) {
    return buildFallbackFigure(node, captionNode, options, "Open embedded media on site");
  }

  const nextNode = cloneNode(node);
  nextNode.content = content.flatMap((child) => transformFeedNode(child, options));
  return [nextNode];
}

function transformFeedNode(node, options) {
  if (typeof node === "string") {
    return [node];
  }

  if (!node || typeof node !== "object") {
    return [node];
  }

  if (node.tag === "figure") {
    return transformFigureNode(node, options);
  }

  if (node.tag === "img") {
    return [decorateImageNode(node, { ...options, mode: "feed" })];
  }

  if (node.tag === "video") {
    if (node.attrs && node.attrs.poster) {
      return [
        {
          tag: "a",
          attrs: { href: options.postUrl },
          content: [makePosterImageNode(node.attrs.poster, null, options)],
        },
      ];
    }

    return [makeFeedLinkParagraph(options.postUrl, "Watch video on site")];
  }

  if (node.tag === "iframe") {
    return [makeFeedLinkParagraph(options.postUrl, "Open embedded media on site")];
  }

  const nextNode = cloneNode(node);
  if (Array.isArray(node.content)) {
    nextNode.content = node.content.flatMap((child) => transformFeedNode(child, options));
  }
  return [nextNode];
}

function transformPageNode(node, options) {
  if (typeof node === "string") {
    return [node];
  }

  if (!node || typeof node !== "object") {
    return [node];
  }

  if (node.tag === "img") {
    return [decorateImageNode(node, { ...options, mode: "page" })];
  }

  const nextNode = cloneNode(node);
  if (Array.isArray(node.content)) {
    nextNode.content = node.content.flatMap((child) => transformPageNode(child, options));
  }
  return [nextNode];
}

function normalizeFeedMedia(html, options = {}) {
  const tree = parseFragment(html);
  return renderFragment(tree.flatMap((node) => transformFeedNode(node, options)));
}

function injectIntrinsicImageDimensions(html, options = {}) {
  const tree = parseFragment(html);
  return renderFragment(tree.flatMap((node) => transformPageNode(node, options)));
}

module.exports = {
  injectIntrinsicImageDimensions,
  normalizeFeedMedia,
};
