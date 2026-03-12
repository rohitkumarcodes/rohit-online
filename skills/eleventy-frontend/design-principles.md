# Design & Engineering Philosophy: The Native-First Web

## I. Core Philosophy: The Environment is the Design System

This product rejects the cycle of reinventing UI patterns. Operating systems and web browsers have spent decades perfecting how inputs, buttons, and text should look and behave for maximum accessibility and usability. 

Our fundamental rule is: **We do not build custom components to fight the browser; we lean entirely into the browser's default rendering engines.** The software should feel less like a branded application and more like a native extension of the user's operating system. Function dictates form.

## II. User Experience (UX) Principles

* **Performance as Respect:** The speed of the application is its most important feature. We do not use loading spinners, splash screens, or skeleton loaders. Interactions should be resolved instantly on the client side, or rely on the browser's native page-loading indicators.
* **Semantic Affordances:** Users must never guess what an element does. 
    * If an element navigates the user to a new URL, it must be an `<a>` tag and look like a standard hyperlink. 
    * If an element executes a script, submits data, or changes an on-page state, it must be a `<button>` and look like an unstyled, native OS button. 
* **Native Feedback Loops:** Communicate system status using built-in mechanics rather than engineered overlay systems. 
    * Use the native `disabled` attribute to indicate an action cannot be taken.
    * Use inline text swaps instead of floating "toast" notifications.
    * Use native HTML attributes (like `title` for tooltips or `<dialog>` for modals) instead of building custom, absolute-positioned pop-ups.
* **Progressive Enhancement:** The core utility of the application should ideally function without JavaScript. Forms should submit natively, and links should route natively. JavaScript is only added to intercept these native behaviors to make them slightly faster, not to replace them entirely.

## III. User Interface (UI) Principles

* **Typography over Decoration:** Visual hierarchy is established *exclusively* through font sizing, semantic weight (e.g., `<strong>`, `<em>`), and whitespace. We do not use background colors, shadows, gradients, or borders to group items unless strictly necessary for data segregation.
* **System Default Typography:** Rely entirely on the operating system's default font stack (System Sans-serif, System Serif, or System Monospace). This guarantees perfect legibility, native text rendering, and zero layout shifts from downloading external font files.
* **The Default Color Palette:** Use the browser's high-contrast defaults. Text is native black or dark grey; backgrounds are native white or light grey. We rely on the universal web standard for interactive elements: blue for unvisited links, and purple for visited links. 
* **Fluidity over Breakpoints:** The layout must naturally wrap and flow based on the viewport. We favor CSS Flexbox and CSS Grid with relative units (like `ch`, `rem`, and `%`) over fixed pixel widths and complex media queries. The UI should stretch or compress like a fluid text document.
* **Accessible by Default:** We preserve all default browser accessibility features. We never remove or alter the default focus rings (`outline`) for keyboard navigators, and we allow the user's browser to freely zoom or scale the text without breaking the layout.

## IV. Engineering Guardrails (What NOT to do)

To protect the integrity, speed, and lifespan of the software, developers and designers must adhere to these strict technical constraints:

1. **NO UI Component Libraries:** Do not install external libraries for dropdowns, date pickers, accordions, or modals. You must use native HTML elements (`<select>`, `<input type="date">`, `<details>`, `<dialog>`). They are automatically mobile-optimized and screen-reader friendly.
2. **NO Decorative Animations:** The interface is a tool, not a cinematic experience. State changes must be instant. Do not add CSS transitions, fade-ins, slide-outs, or hover timing functions. The only acceptable hover states are native text underlines or the default cursor change.
3. **NO CSS Frameworks:** Utility-class frameworks and pre-built UI kits introduce unnecessary DOM bloat and force a specific visual opinion. Write plain, semantic CSS scoped to layout and spacing.
4. **NO Over-engineered Frontends:** Do not default to massive Single Page Application (SPA) frameworks for applications that are fundamentally text-and-form driven. Prefer Multi-Page Applications (MPAs) rendered by the server, or lightweight vanilla JavaScript for localized interactivity. 
5. **NO SVG Icon Packs:** Avoid heavy icon libraries. If a visual symbol is required to save space, use standard Unicode characters (e.g., `→`, `✓`, `✕`, `⚙`) or explicit text labels.

When building complex software (SaaS, internal dashboards, data-heavy applications), the instinct is to reach for external libraries to handle the cognitive load. Under the Native-First philosophy, we resist this. We solve complex problems by composing basic, native HTML elements and relying on browser mechanics.

Here is how to handle the most common complex UI patterns natively.

## I. Data Tables & Grids

Heavy data grids often cripple application performance. We reject JavaScript-based grid libraries (e.g., ag-Grid, DataTables) in favor of the native DOM.

* **Semantic Structure:** Use strictly compliant HTML tables (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`). This guarantees immediate accessibility for screen readers and allows the browser to calculate column widths natively.
* **Responsiveness:** Do not write JavaScript to hide or collapse columns on mobile. Wrap the `<table>` in a `<div>` with `overflow-x: auto;`. The browser will provide a native horizontal scrollbar, preserving the structural integrity of the data.
* **Sorting:** Use standard anchor links (`<a>`) in the `<th>` elements. Clicking "Date" should append a query parameter (`?sort=date_desc`) and trigger a server-side re-render. Do not sort massive datasets purely in the client's memory.
* **Pagination:** Reject infinite scroll. Infinite scroll breaks the native scrollbar, consumes infinite memory, and makes footers unreachable. Use standard, discrete pagination links (Previous, 1, 2, 3, Next) using server-side offsets.

## II. Multi-Step Forms (Wizards)

Modern applications often use heavy client-side state management to guide users through multi-step flows. We prefer the resilience of the classic web document flow.

* **Distinct URLs:** Each step of a process should be its own distinct page with its own URL (e.g., `/checkout/shipping`, `/checkout/billing`). This allows users to use the browser's native "Back" and "Forward" buttons without breaking the application state.
* **Native Validation:** Rely on the browser's built-in validation engine. Use `required`, `minlength`, `maxlength`, `pattern` (regex), and correct input types (`type="email"`, `type="url"`, `type="number"`). The browser will automatically halt submission and provide localized error tooltips.
* **Grouping:** Use the `<fieldset>` element to group related inputs, and the `<legend>` element to label the group. This provides massive accessibility benefits and clear visual grouping without custom CSS boxes.

## III. Settings Dashboards & Controls

Settings pages are frequently over-engineered with custom toggle switches, hidden panels, and sticky sidebars.

* **The Checkbox is King:** Do not build custom CSS/JS "toggle switches." Use the standard `<input type="checkbox">`. Every operating system renders a checkbox perfectly, and users instantly recognize how to interact with it.
* **Avoid Custom Tabs:** Do not build client-side tabbed interfaces that hide and reveal content using JavaScript. If settings are complex enough to require tabs, they are complex enough to require distinct URLs. Use a simple `<nav>` menu to link to separate pages (e.g., Profile, Security, Notifications).
* **Linear Layouts:** Stack settings vertically. A single, scrollable column of clearly labeled inputs is infinitely easier to navigate on both mobile and desktop than a complex grid of cards and panels.

## IV. Modals and Dialogs

Absolute-positioned `div` overlays are a notorious source of bugs, `z-index` conflicts, and accessibility failures (like trapping the keyboard focus).

* **The `<dialog>` Element:** If an interruption is absolutely necessary, use the native HTML5 `<dialog>` element.
* **Native Methods:** Trigger it using `dialog.showModal()`. The browser will automatically handle the dark backdrop, lock the scroll of the background page, and trap the keyboard focus inside the modal—requiring zero external libraries.
* **Forms in Dialogs:** Use `<form method="dialog">` inside the modal. When a button inside this form is clicked, the browser will automatically close the dialog and return focus to the underlying page natively.

## V. Data Visualization (Charts & Graphs)

Canvas-based charting libraries (like Chart.js or D3) send massive amounts of JavaScript to the client just to draw simple shapes.

* **HTML/CSS Bar Charts:** For basic proportional data, use the native `<progress>` or `<meter>` elements. Alternatively, use simple `<div>` elements with an inline `style="width: X%"` and a background color.
* **Server-Rendered SVG:** For line graphs or complex charts, generate pure `<svg>` code on the server and send it directly in the HTML payload. SVGs scale infinitely, look perfectly crisp, and require zero client-side execution to render.

## VI. Dynamic Content (Interactivity)

When client-side interactivity is unavoidable, we keep it localized and lightweight.

* **The `<details>` Element:** For accordions, collapsible FAQs, or hidden metadata, use the native `<details>` and `<summary>` tags. The browser handles the open/close state and the expanding animation automatically.
* **HTML over JSON (HTMX philosophy):** If a user clicks a button that updates a small portion of the screen, do not fetch JSON and write client-side logic to parse and render it. Have the server return the exact, pre-rendered HTML block, and use vanilla JavaScript to swap it into the DOM.