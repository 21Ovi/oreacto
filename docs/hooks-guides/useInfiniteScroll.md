# useInfiniteScroll

Effortless infinite scrolling with IntersectionObserver API.

---

## Overview

`useInfiniteScroll` automatically loads more content when users scroll to the bottom of a list. Built on the modern IntersectionObserver API for optimal performance.

**Perfect for:**
- Social media feeds
- Product listings
- Search results
- News articles
- Image galleries

---

## Installation

```bash
npm install oreacto
```

---

## Basic Usage

```typescript
import { useInfiniteScroll } from "oreacto";
import { useState } from "react";

function FeedComponent() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page: number) => {
    const response = await fetch(`/api/items?page=${page}`);
    const newItems = await response.json();

    setItems((prev) => [...prev, ...newItems]);
    setHasMore(newItems.length > 0);
  };

  const { loader, page } = useInfiniteScroll({
    fetchData,
    hasMoreData: hasMore,
  });

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.content}</div>
      ))}
      {hasMore && <div ref={loader}>Loading...</div>}
    </div>
  );
}
```

---

## API Reference

```typescript
function useInfiniteScroll(props: UseInfiniteScrollProps): UseInfiniteScrollResult
```

### Parameters

| Parameter     | Type                        | Description                                  |
| ------------- | --------------------------- | -------------------------------------------- |
| `fetchData`   | `(page: number) => void`    | Function to fetch data for the given page    |
| `hasMoreData` | `boolean`                   | Whether more data is available to load       |

### Returns

| Property | Type                                     | Description                                |
| -------- | ---------------------------------------- | ------------------------------------------ |
| `loader` | `React.MutableRefObject<HTMLDivElement>` | Ref to attach to the trigger element       |
| `page`   | `number`                                 | Current page number                        |
| `setPage` | `React.Dispatch<SetStateAction<number>>` | Manually set page (useful for resets)      |

---

## Examples

### Social Media Feed

```typescript
import { useInfiniteScroll } from "oreacto";
import { useState } from "react";

interface Post {
  id: string;
  content: string;
  author: string;
}

function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=20`);
      const newPosts = await response.json();

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length === 20); // Assuming 20 per page
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const { loader } = useInfiniteScroll({
    fetchData: fetchPosts,
    hasMoreData: hasMore,
  });

  return (
    <div className="feed">
      {posts.map((post) => (
        <article key={post.id}>
          <h3>{post.author}</h3>
          <p>{post.content}</p>
        </article>
      ))}

      {hasMore && (
        <div ref={loader} className="loader">
          {loading ? "Loading more posts..." : "Scroll for more"}
        </div>
      )}

      {!hasMore && <p>You've reached the end! 🎉</p>}
    </div>
  );
}
```

### Product Catalog

```typescript
import { useInfiniteScroll } from "oreacto";
import { useState } from "react";

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = async (page: number) => {
    const res = await fetch(`/api/products?page=${page}`);
    const data = await res.json();

    setProducts((prev) => [...prev, ...data.products]);
    setHasMore(data.hasNextPage);
  };

  const { loader, page, setPage } = useInfiniteScroll({
    fetchData: loadProducts,
    hasMoreData: hasMore,
  });

  const resetCatalog = () => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div>
      <button onClick={resetCatalog}>Reset</button>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div ref={loader} className="loading-trigger">
          <span>Loading more products...</span>
        </div>
      )}
    </div>
  );
}
```

### Image Gallery with Error Handling

```typescript
import { useInfiniteScroll } from "oreacto";
import { useState } from "react";

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async (page: number) => {
    try {
      const response = await fetch(`/api/images?page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch");

      const newImages = await response.json();
      setImages((prev) => [...prev, ...newImages]);
      setHasMore(newImages.length > 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setHasMore(false);
    }
  };

  const { loader } = useInfiniteScroll({
    fetchData: fetchImages,
    hasMoreData: hasMore,
  });

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="gallery">
        {images.map((img) => (
          <img key={img.id} src={img.url} alt={img.title} />
        ))}
      </div>

      {hasMore && <div ref={loader}>📷 Loading more images...</div>}
    </div>
  );
}
```

### With Search Integration

```typescript
import { useInfiniteScroll } from "oreacto";
import { useState, useEffect } from "react";

function SearchableList() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async (page: number) => {
    const response = await fetch(
      `/api/search?q=${searchQuery}&page=${page}`
    );
    const data = await response.json();

    setItems((prev) => [...prev, ...data.results]);
    setHasMore(data.hasMore);
  };

  const { loader, setPage } = useInfiniteScroll({
    fetchData: fetchItems,
    hasMoreData: hasMore,
  });

  // Reset when search changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, setPage]);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />

      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}

      {hasMore && <div ref={loader}>Loading...</div>}
    </div>
  );
}
```

---

## Common Use Cases

### 1. **API Pagination**

```typescript
const fetchData = async (page: number) => {
  const res = await fetch(`/api/data?page=${page}&limit=20`);
  const json = await res.json();
  setItems((prev) => [...prev, ...json.items]);
  setHasMore(json.hasNextPage);
};
```

### 2. **GraphQL Queries**

```typescript
const fetchData = async (page: number) => {
  const { data } = await client.query({
    query: GET_ITEMS,
    variables: { offset: (page - 1) * 20, limit: 20 },
  });
  setItems((prev) => [...prev, ...data.items]);
  setHasMore(data.pageInfo.hasNextPage);
};
```

### 3. **Firebase/Firestore**

```typescript
const fetchData = async (page: number) => {
  const snapshot = await getDocs(
    query(collection(db, "posts"), limit(20), startAfter(lastDoc))
  );
  const newPosts = snapshot.docs.map((doc) => doc.data());
  setPosts((prev) => [...prev, ...newPosts]);
  setHasMore(!snapshot.empty);
};
```

---

## Best Practices

### ✅ Do's

- Set `hasMoreData` to `false` when no more items exist
- Show loading indicators for better UX
- Handle errors gracefully
- Debounce rapid scroll events (built-in via IntersectionObserver)
- Provide "End of list" feedback
- Reset page state when filters change

### ❌ Don'ts

- Don't forget to update `hasMoreData`
- Avoid fetching the same page multiple times
- Don't block the UI during data loading
- Avoid excessive `rootMargin` (default 50px is good)
- Don't forget to handle empty states

---

## Advanced Configuration

### Custom Root Margin

The hook uses a 50px root margin by default (triggers 50px before reaching the bottom). To customize, you'd need to extend the hook:

```typescript
// In your own custom hook
const observer = new IntersectionObserver(handler, {
  root: null,
  rootMargin: "200px", // Trigger earlier
  threshold: 1.0,
});
```

### Manual Page Control

```typescript
const { page, setPage } = useInfiniteScroll({
  fetchData,
  hasMoreData,
});

// Jump to specific page
const jumpToPage = (pageNum: number) => {
  setPage(pageNum);
};

// Reset to beginning
const resetToStart = () => {
  setItems([]);
  setPage(1);
};
```

---

## Performance Tips

1. **Virtualization** - For lists with 1000s of items, use with `react-window` or `react-virtualized`
2. **Memoization** - Memoize `fetchData` to prevent unnecessary re-renders
3. **Pagination Size** - Load 20-50 items per page for optimal UX
4. **Image Lazy Loading** - Use `loading="lazy"` on images

---

## Troubleshooting

### Issue: Infinite loop of requests

**Solution:** Ensure `hasMoreData` is set to `false` when no more data exists:

```typescript
if (newItems.length === 0) {
  setHasMore(false);
}
```

### Issue: Not triggering on scroll

**Solution:** Ensure the loader element is visible in the DOM:

```typescript
{hasMore && <div ref={loader}>Loading...</div>}
```

### Issue: Duplicate items

**Solution:** Use unique keys and check for duplicates:

```typescript
setItems((prev) => {
  const ids = new Set(prev.map((item) => item.id));
  const newUnique = newItems.filter((item) => !ids.has(item.id));
  return [...prev, ...newUnique];
});
```

---

## TypeScript

Fully typed:

```typescript
import { useInfiniteScroll } from "oreacto";

interface Item {
  id: string;
  title: string;
}

const { loader, page, setPage } = useInfiniteScroll({
  fetchData: (page: number) => {
    // Fetch logic
  },
  hasMoreData: true,
});

// All types are inferred
```

---

## Browser Support

Uses IntersectionObserver API - supported in all modern browsers (95%+ coverage).

For older browsers, include a [polyfill](https://github.com/w3c/IntersectionObserver/tree/main/polyfill).

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

