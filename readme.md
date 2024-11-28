Certainly! Here’s the entire README file content, ready to copy and paste in one go:

````markdown
oreacto

A collection of powerful, ready-to-use React hooks in TypeScript to streamline your development. Each hook is optimized for common use cases, from route-based titles to smart filtering and infinite scrolling, making your React apps more efficient and developer-friendly.

Installation

Install the package via npm:

```bash
npm install oreacto
```
````

## Hooks

### 1. `useRouteTitle`

Generate a formatted title based on the current URL path, perfect for setting page titles or breadcrumb labels.

**Usage:**

```typescript
import { useRouteTitle } from "oreacto";

const MyComponent = () => {
  const title = useRouteTitle();

  return <h1>{title}</h1>; // Renders formatted title based on URL
};
```

### 2. `useSmartOSearch`

Filter and sort a list based on search queries with lodash-powered flexibility. Customize search keys, sorting, and order for dynamic list rendering.

**Usage:**

```typescript
import { useSmartOSearch } from "oreacto";

const MyComponent = ({ items }) => {
  const { filteredItems, query, setQuery } = useSmartOSearch({
    items,
    filterKeys: ["name", "email"], // Filter based on name and email fields
    searchQuery: "",
    sortKey: "name",
    sortOrder: "asc",
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### 3. `useInfiniteScroll`

Easily implement infinite scrolling by detecting when a user reaches the end of a list and automatically fetching more data.

**Usage:**

```typescript
import { useInfiniteScroll } from "oreacto";

const MyComponent = ({ fetchData, hasMoreData }) => {
  const { loader, page, setPage } = useInfiniteScroll({
    fetchData,
    hasMoreData,
  });

  return (
    <div>
      {/* Render list content */}
      <div ref={loader} /> {/* Loader element for triggering infinite scroll */}
    </div>
  );
};
```

## API Reference

### `useRouteTitle`

- **Description**: Generates a formatted title based on the last segment of the URL.
- **Returns**: `string` - The formatted title.

### `useSmartOSearch`

- **Parameters**:

  - `items` (`Array`): List of items to search and sort.
  - `filterKeys` (`Array<string>`): Keys to apply the search filter.
  - `searchQuery` (`string`): Initial search query.
  - `sortKey` (`string`): Key to sort items by.
  - `sortOrder` (`'asc' | 'desc'`): Sort order.

- **Returns**: `{ filteredItems, query, setQuery }`
  - `filteredItems` (`Array`): Filtered and sorted items.
  - `query` (`string`): Current search query.
  - `setQuery` (`function`): Update function for the search query.

### `useInfiniteScroll`

- **Parameters**:

  - `fetchData` (`function`): Function to fetch data based on the current page.
  - `hasMoreData` (`boolean`): Indicates if more data is available.

- **Returns**: `{ loader, page, setPage }`

  - `loader` (`ref`): Ref for the element that triggers loading more items.
  - `page` (`number`): Current page number.
  - `setPage` (`function`): Manually update the page number.

  ### `useDynamicFields`

- **Parameters**:

  - `parentValue` (`number | undefined`): Number of fields to generate.
  - `hasMoreData` (`string`): Base name for the generated fields.
  - `fieldTemplate` (`object`): Template object for each field.

- **Returns**: `Array<object>`: - Array of field objects with `fieldName` and `label`.

## License

MIT © [Mohammad Ovesh](https://github.com/21Ovi)

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

With these hooks, you can supercharge your React app and focus on building rather than reinventing the wheel. Enjoy using `oreacto`!

```

```
