---
name: eleventy-frontend
description: Use for frontend work on this Eleventy site: layouts, pages, styling, content rendering, feed output, route behavior, responsive fixes, and Eleventy-native content organization.
---

# Eleventy Frontend

Use this skill when changing the UI or rendered output of `https://www.rohit.onl`.

## Use When

- Updating layouts or page templates
- Changing typography, spacing, colors, or responsive behavior
- Fixing rendered Markdown or HTML output
- Adjusting homepage, feed, navigation, or route presentation
- Maintaining route and rendering parity while improving the site shell

## Design Philosophy

- Treat the browser and operating system as the design system.
- Prefer native HTML behavior over custom UI abstractions.
- Let function dictate form; this site should feel like a fast, readable document, not a branded web app.
- Use progressive enhancement: links should navigate natively and forms should submit natively unless JavaScript is clearly necessary.
- Optimize for speed and clarity. Avoid engineered loading states, overlay systems, and decorative UI flourishes.
- Treat performance as a form of respect. Prefer instant state changes, server-rendered updates, and native page loading behavior over spinners, skeletons, and splash screens.

## Decision Defaults

- Default to server-rendered pages, not SPA-style flows.
- Default to native HTML elements, not custom components.
- Default to text, whitespace, and document structure over decorative UI.
- Default to root-relative internal links and Markdown external links, with safe attributes added at render time.
- Default to CSS that helps content flow naturally rather than CSS that forces rigid layouts.
- Default to keeping authored content untouched and fixing presentation around it.

## Project Context

- Static site generator: Eleventy 3
- Templating: Nunjucks layouts and pages
- Content source: `content/posts/*.md` and `content/pages/*.md`
- Directory data: `content/posts/posts.11tydata.js` and `content/pages/pages.11tydata.js`
- Shared site data: `_data/site.js`
- Layouts: `_includes/layouts/`
- Homepage: `index.njk`
- Feed: `feed.njk`
- Styling: `assets/styles.css`
- Design reference: `skills/eleventy-frontend/design-principles.md`

## Workflow

1. Inspect existing frontend patterns before adding new ones.
2. Treat authored content in `content/` as immutable unless the user explicitly asks to edit copy.
3. Prefer plain Markdown and root-relative internal links in content, and let the render layer handle external-link attributes.
4. Preserve existing slug-based routes and generated URLs unless the user explicitly asks for route changes.
5. Keep desktop and mobile behavior both working.
6. Verify with `pnpm build` after frontend changes.
7. If a UI problem can be solved with semantic HTML and small CSS changes, do that before considering JavaScript.
8. If a request conflicts with the native-first rules, follow the request but keep the deviation narrow and intentional.

## Commands

- Install deps: `pnpm install`
- Build: `pnpm build`
- Dev server: `pnpm dev`

## Core UI Rules

- Keep the site lightweight; do not introduce a client-side framework unless explicitly requested.
- Reuse the existing Nunjucks layout structure before adding new templates.
- Preserve raw Markdown and HTML rendering from the authored content.
- Keep navigation simple and editorial; this site does not need app-style UI patterns.
- Use semantic HTML first, CSS second, JavaScript only when there is a clear interaction need.
- Maintain readable content width, clear link states, and mobile-safe spacing.
- Use root-relative links for internal navigation inside authored content.
- Write external links as normal Markdown and rely on the render layer to add `target="_blank"` and `rel="noopener noreferrer"` for external HTTP(S) URLs.
- Preserve `/feed.xml` behavior and avoid breaking internal links.
- Do not remove default browser focus styles.
- Do not add custom component libraries, CSS frameworks, SVG icon packs, or decorative animations unless explicitly requested.

## Native-First Interaction Rules

- If an element changes the URL, use an `<a>`.
- If an element submits data, runs an action, or changes on-page state, use a `<button>`.
- Use native form controls: `<input>`, `<textarea>`, `<select>`, `<fieldset>`, `<legend>`, and browser validation attributes such as `required`, `pattern`, and correct `type` values.
- Prefer `disabled`, inline helper text, `title`, `<details>`, and `<dialog>` over custom toasts, tooltips, accordions, or modal frameworks.
- For collapsible content, prefer `<details>` and `<summary>`.
- For modal behavior, prefer `<dialog>` if the feature truly needs interruption.
- Use inline status text or label changes instead of floating notifications where practical.
- Do not hide navigation or actions behind non-semantic click targets.

## Typography And Layout Rules

- Prefer typography and whitespace over decoration.
- Use system font stacks or the project’s current default stack; do not add web fonts unless explicitly requested.
- Favor native high-contrast colors and simple link styling over custom palette systems.
- Prefer fluid layouts using `rem`, `%`, `ch`, Flexbox, and Grid over rigid breakpoint-heavy layouts.
- Avoid shadows, gradients, badges, panels, and ornamental borders unless they are needed to separate information clearly.
- Keep content readable at browser zoom and on narrow mobile viewports.
- Let links look like links; default browser blue and purple link behavior is acceptable.
- Use borders and background fills only when they help separate distinct information, not as default decoration.
- Prefer one readable content column over card grids or dashboard-style chrome.

## Content And Rendering Rules

- Never “clean up” or rewrite authored prose unless the user explicitly asks for copy edits.
- Preserve route parity for published content at `/<slug>/`.
- Preserve raw HTML in Markdown where possible.
- Prefer editing legacy content into plain Markdown or HTML rather than carrying compatibility syntax forward.
- Keep feed generation and content rendering working after any frontend change.
- Preserve browser accessibility defaults, including focus rings, zooming, and native control appearance.

## When Complex UI Is Requested

- For tables, use semantic `<table>` markup and rely on horizontal scrolling instead of hiding columns with JavaScript.
- For sortable tables, prefer query-parameter-driven links and server-rendered sorting over in-memory client sorting.
- Prefer discrete pagination links over infinite scroll.
- For multi-step flows, prefer distinct URLs over client-side wizards.
- Rely on native form validation before inventing custom validation UI.
- For settings-like interfaces, use linear forms and native checkboxes instead of custom toggles or tab systems.
- For charts or simple proportional data, prefer server-rendered SVG, `<progress>`, `<meter>`, or plain HTML/CSS over heavy charting libraries.
- For dynamic partial updates, prefer server-rendered HTML fragments over JSON-plus-client-rendering when possible.
- If a requested interaction starts pushing the site toward SPA behavior, pause and confirm that the added complexity is intentional.

## Anti-Patterns

- Do not add loading spinners, skeleton screens, or page transition animations by default.
- Do not introduce infinite scroll, sticky app shells, floating action menus, or toast systems without a strong reason.
- Do not replace native checkboxes, selects, dialogs, or disclosure widgets with stylized clones.
- Do not add framework code or client-side state machinery for problems that are mostly document rendering.
- Do not add icon packs when text labels or simple Unicode symbols are enough.

## Review Checklist

- `pnpm build` succeeds
- Published routes still render at `/<slug>/`
- Homepage and feed still generate
- Desktop and mobile layouts remain readable
- Content in `content/` has not been rewritten accidentally
- External Markdown links render with safe attributes, and feed output still works
- Raw images, figures, and small inline HTML snippets still render correctly
- Links still look and behave like links, and buttons still behave like buttons
- No custom UI abstraction was introduced where native HTML would have been enough
- Default focus visibility and zoom/readability still work
- No unnecessary loading UI or decorative motion was added
- Any complex UI request still resolves to simple, semantic markup where possible

## References

- `eleventy.config.cjs` for filters and collections
- `_includes/layouts/base.njk` for shared shell
- `_includes/layouts/page.njk` and `_includes/layouts/post.njk` for content presentation
- `assets/styles.css` for all current styling
- `skills/eleventy-frontend/design-principles.md` for the full native-first design philosophy
