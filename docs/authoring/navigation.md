# Add or Edit Navigation

The main site navigation is managed manually in `_data/site.js`.

## 1. Edit the Navigation Array

Add, remove, or reorder entries in the `navigation` array:

```js
navigation: [
  { label: "Home", url: "/" },
  { label: "Blog", url: "/posts/" },
  { label: "More", url: "/more/" },
]
```

## 2. Follow These Conventions

- Use root-relative URLs such as `/about/`.
- Keep the trailing slash style that the site already uses.
- Keep labels short and readable.
- Order matters. The array order is the menu order.

## 3. Preview the Result

Run `pnpm dev` and check the menu on both the homepage and an inner page. The current page is highlighted automatically when the URL matches the navigation item.

## 4. Remember What Navigation Does Not Do

- Adding a page file does not add it to navigation automatically.
- Adding a navigation item does not create the page for you.
- Secondary pages can stay out of the main menu and be linked from another page instead.
