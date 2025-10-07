# useRouteTitle

Generate formatted page titles automatically from your current route path.

---

## Overview

`useRouteTitle` extracts the last segment from your URL path and converts it into a human-readable title. Perfect for dynamic page titles, breadcrumbs, and navigation labels.

**Example:** `/user-settings/account-details` → `"Account Details"`

---

## Installation

```bash
npm install oreacto
```

**Requirements:**
- React 18+
- react-router-dom 6+ (for `useLocation`)

---

## Basic Usage

```typescript
import { useRouteTitle } from "oreacto";

function PageHeader() {
  const title = useRouteTitle();

  return <h1>{title}</h1>;
}
```

**Result:** If URL is `/products/electronics`, displays: **"Electronics"**

---

## API Reference

```typescript
function useRouteTitle(): string
```

### Returns

- **`string`** - The formatted title derived from the current route path

### Behavior

1. Extracts the last segment of the URL path
2. Splits hyphenated words (e.g., `user-profile` → `user profile`)
3. Capitalizes each word
4. Returns empty string if no path segments exist

---

## Examples

### Dynamic Page Title

```typescript
import { useRouteTitle } from "oreacto";
import { useEffect } from "react";

function DynamicTitle() {
  const title = useRouteTitle();

  useEffect(() => {
    // Update browser tab title
    document.title = title || "My App";
  }, [title]);

  return <h1>{title}</h1>;
}
```

### Breadcrumb Navigation

```typescript
import { useRouteTitle } from "oreacto";
import { useLocation, Link } from "react-router-dom";

function Breadcrumbs() {
  const title = useRouteTitle();
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav>
      <Link to="/">Home</Link>
      {segments.map((segment, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = segment
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        return isLast ? (
          <span key={path}> / {label}</span>
        ) : (
          <span key={path}>
            {" / "}
            <Link to={path}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
}
```

### Dashboard Header

```typescript
import { useRouteTitle } from "oreacto";

function DashboardLayout() {
  const pageTitle = useRouteTitle();

  return (
    <div>
      <header>
        <h1>{pageTitle || "Dashboard"}</h1>
        <p>Welcome back!</p>
      </header>
      <main>{/* Your content */}</main>
    </div>
  );
}
```

### With Custom Formatting

```typescript
import { useRouteTitle } from "oreacto";

function CustomFormattedTitle() {
  const title = useRouteTitle();

  // Add custom prefix/suffix
  const formattedTitle = title ? `📄 ${title} | MyApp` : "MyApp";

  return <h1>{formattedTitle}</h1>;
}
```

---

## Common Use Cases

### 1. **Automatic Page Titles**

Eliminate manual title setting on every page:

```typescript
// Before: Manual on each page
function ProductsPage() {
  return <h1>Products</h1>;
}

function SettingsPage() {
  return <h1>Settings</h1>;
}

// After: Automatic with useRouteTitle
function PageLayout() {
  const title = useRouteTitle();
  return <h1>{title}</h1>;
}
```

### 2. **SEO Meta Tags**

```typescript
import { useRouteTitle } from "oreacto";
import { Helmet } from "react-helmet";

function SEOWrapper() {
  const title = useRouteTitle();

  return (
    <Helmet>
      <title>{title} | My Company</title>
      <meta property="og:title" content={title} />
    </Helmet>
  );
}
```

### 3. **Navigation Active State**

```typescript
import { useRouteTitle } from "oreacto";

function Navigation() {
  const currentPage = useRouteTitle();

  return (
    <nav>
      <a className={currentPage === "Dashboard" ? "active" : ""}>Dashboard</a>
      <a className={currentPage === "Products" ? "active" : ""}>Products</a>
      <a className={currentPage === "Settings" ? "active" : ""}>Settings</a>
    </nav>
  );
}
```

---

## Best Practices

### ✅ Do's

- Use for dynamic, route-based titles
- Combine with `useEffect` for document title updates
- Provide fallback values for the root route
- Use consistent URL naming conventions (kebab-case)

### ❌ Don'ts

- Don't use for static titles (just use plain strings)
- Don't rely on it for complex title logic (extend it instead)
- Avoid special characters in route segments

---

## Tips & Tricks

### Custom Title Mapping

```typescript
import { useRouteTitle } from "oreacto";

const TITLE_MAP: Record<string, string> = {
  "User Profile": "My Profile",
  "Account Settings": "Settings",
};

function useCustomTitle() {
  const routeTitle = useRouteTitle();
  return TITLE_MAP[routeTitle] || routeTitle;
}
```

### Multi-level Paths

For nested routes like `/admin/user-management/roles`:

```typescript
// Returns "Roles" (last segment only)
const title = useRouteTitle();
```

To get full path context, extend the hook:

```typescript
import { useLocation } from "react-router-dom";

function useFullPathTitle() {
  const { pathname } = useLocation();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) =>
      seg
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );

  return segments.join(" / ");
}

// Returns "Admin / User Management / Roles"
```

---

## Related Hooks

- **useLocation** (react-router-dom) - For full path access
- **useParams** (react-router-dom) - For dynamic route parameters

---

## TypeScript

Fully typed with TypeScript:

```typescript
import { useRouteTitle } from "oreacto";

const title: string = useRouteTitle(); // Type inferred
```

---

## Browser Support

Works in all modern browsers that support React 18+.

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

