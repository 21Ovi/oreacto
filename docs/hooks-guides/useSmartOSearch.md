# useSmartOSearch

Powerful filtering and sorting for lists with built-in search functionality.

---

## Overview

`useSmartOSearch` combines lodash's powerful utilities to provide instant client-side filtering and sorting for any list data. Perfect for tables, product lists, user directories, and search interfaces.

**Features:**
- 🔍 Multi-field search
- 📊 Customizable sorting
- ⚡ Optimized with `useMemo`
- 🎯 Case-insensitive filtering
- 🔧 Fully typed with TypeScript generics

---

## Installation

```bash
npm install oreacto
```

**Dependencies:**
- lodash (included in oreacto)

---

## Basic Usage

```typescript
import { useSmartOSearch } from "oreacto";

function UserList({ users }) {
  const { filteredItems, query, setQuery } = useSmartOSearch({
    items: users,
    filterKeys: ["name", "email"],
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {filteredItems.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## API Reference

```typescript
function useSmartOSearch<T>(config: UseSmartOSearchProps<T>): UseSmartOSearchResult<T>
```

### Parameters

| Parameter      | Type             | Default         | Description                              |
| -------------- | ---------------- | --------------- | ---------------------------------------- |
| `items`        | `T[]`            | **required**    | Array of items to filter and sort        |
| `filterKeys`   | `(keyof T)[]`    | `[]`            | Object keys to search within             |
| `searchQuery`  | `string`         | `""`            | Initial search query                     |
| `sortKey`      | `keyof T`        | `"name"`        | Key to sort items by                     |
| `sortOrder`    | `"asc" \| "desc"` | `"asc"`         | Sort direction                           |

### Returns

| Property        | Type                                    | Description                    |
| --------------- | --------------------------------------- | ------------------------------ |
| `filteredItems` | `T[]`                                   | Filtered and sorted items      |
| `query`         | `string`                                | Current search query           |
| `setQuery`      | `React.Dispatch<SetStateAction<string>>` | Function to update query       |

---

## Examples

### Simple Product Search

```typescript
import { useSmartOSearch } from "oreacto";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

function ProductCatalog({ products }: { products: Product[] }) {
  const { filteredItems, query, setQuery } = useSmartOSearch({
    items: products,
    filterKeys: ["name", "category"],
    sortKey: "price",
    sortOrder: "asc",
  });

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <p>Found {filteredItems.length} products</p>
      <div className="products">
        {filteredItems.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### User Directory with Advanced Filtering

```typescript
import { useSmartOSearch } from "oreacto";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  joinDate: string;
}

function UserDirectory({ users }: { users: User[] }) {
  const [sortBy, setSortBy] = useState<keyof User>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const { filteredItems, query, setQuery } = useSmartOSearch({
    items: users,
    filterKeys: ["name", "email", "department"],
    sortKey: sortBy,
    sortOrder: order,
  });

  return (
    <div>
      <div className="controls">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or department..."
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as keyof User)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="department">Department</option>
          <option value="joinDate">Join Date</option>
        </select>
        <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
          {order === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <p>{filteredItems.length} results</p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### E-commerce Filter

```typescript
import { useSmartOSearch } from "oreacto";

function ProductFilter({ products }) {
  const { filteredItems, query, setQuery } = useSmartOSearch({
    items: products,
    filterKeys: ["name", "description", "brand", "tags"],
    sortKey: "popularity",
    sortOrder: "desc",
  });

  return (
    <div className="shop">
      <aside>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
        <p className="results-count">
          {filteredItems.length} of {products.length} products
        </p>
      </aside>

      <main className="product-grid">
        {filteredItems.length === 0 ? (
          <p>No products found for "{query}"</p>
        ) : (
          filteredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </main>
    </div>
  );
}
```

### Real-time Search with Debouncing

```typescript
import { useSmartOSearch } from "oreacto";
import { useState, useEffect } from "react";

function DebouncedSearch({ items }) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const { filteredItems, setQuery } = useSmartOSearch({
    items,
    filterKeys: ["name", "description"],
    searchQuery: debouncedValue,
  });

  useEffect(() => {
    setQuery(debouncedValue);
  }, [debouncedValue, setQuery]);

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Results: {filteredItems.length}</p>
      {/* Render filteredItems */}
    </div>
  );
}
```

---

## Common Use Cases

### 1. **Data Tables**

Add instant search to any table:

```typescript
const { filteredItems, query, setQuery } = useSmartOSearch({
  items: tableData,
  filterKeys: ["column1", "column2", "column3"],
});
```

### 2. **Contact Lists**

Search across multiple contact fields:

```typescript
const { filteredItems, query, setQuery } = useSmartOSearch({
  items: contacts,
  filterKeys: ["firstName", "lastName", "phone", "email"],
  sortKey: "lastName",
});
```

### 3. **Product Catalogs**

Multi-field product search:

```typescript
const { filteredItems, query, setQuery } = useSmartOSearch({
  items: products,
  filterKeys: ["name", "description", "sku", "category"],
  sortKey: "price",
  sortOrder: "asc",
});
```

---

## Best Practices

### ✅ Do's

- Use for client-side filtering (< 1000 items performs best)
- Specify relevant `filterKeys` for better search results
- Provide clear feedback when no results are found
- Consider debouncing for large datasets
- Use appropriate `sortKey` for your use case

### ❌ Don'ts

- Don't use for server-side search (use API calls instead)
- Avoid filtering 10,000+ items client-side (consider pagination)
- Don't filter on sensitive/hidden fields
- Avoid excessive `filterKeys` (impacts performance)

---

## Performance Tips

### Optimize Large Lists

For lists with 1000+ items:

1. **Debounce input** (shown in examples above)
2. **Use pagination** or virtual scrolling
3. **Limit filterKeys** to essential fields
4. **Consider server-side filtering** for 10,000+ items

### Memoize Items

```typescript
const memoizedItems = useMemo(() => largeDataSet, [/* dependencies */]);

const { filteredItems } = useSmartOSearch({
  items: memoizedItems,
  filterKeys: ["name"],
});
```

---

## TypeScript

Fully typed with generics:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

const { filteredItems, query, setQuery } = useSmartOSearch<Product>({
  items: products,
  filterKeys: ["name"], // Type-safe! Only Product keys allowed
  sortKey: "price", // Type-safe!
});

// filteredItems is Product[] (type-safe)
```

---

## Related Hooks

- **useInfiniteScroll** - Combine with infinite scrolling
- **useDynamicFields** - For dynamic form filtering

---

## Browser Support

Works in all modern browsers that support React 18+.

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

