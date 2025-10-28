# useAsync

Powerful async state management with built-in loading states, error handling, retry logic, and caching.

---

## Overview

`useAsync` provides a complete solution for managing async operations in React. It handles loading states, errors, retries, cancellation, and caching automatically, making it perfect for API calls, data fetching, and any asynchronous operations.

**Key Features:**
- 🔄 Automatic loading/error/success states
- 🔁 Built-in retry logic with configurable delays
- 💾 Stale-while-revalidate caching
- ❌ Request cancellation support
- 🎯 TypeScript-first with full type safety
- ⚡ Optimized re-renders
- 🔧 Flexible configuration

---

## Installation

```bash
npm install oreacto
```

---

## Basic Usage

```typescript
import { useAsync } from "oreacto";
import { useEffect } from "react";

function UserProfile({ userId }) {
  const { data, loading, error, execute } = useAsync(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  });

  useEffect(() => {
    execute();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No user found</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

---

## API Reference

```typescript
function useAsync<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  config?: UseAsyncConfig<T>
): UseAsyncResult<T>
```

### Parameters

| Parameter      | Type                              | Default | Description                          |
| -------------- | --------------------------------- | ------- | ------------------------------------ |
| `asyncFn`     | `(...args: any[]) => Promise<T>` | -       | The async function to execute        |
| `config`       | `UseAsyncConfig<T>`               | `{}`    | Configuration options                |

### Config Options

| Option         | Type                    | Default | Description                          |
| -------------- | ----------------------- | ------- | ------------------------------------ |
| `onSuccess`    | `(data: T) => void`     | -       | Callback fired on successful execution |
| `onError`      | `(error: Error) => void` | -       | Callback fired on error              |
| `retryCount`   | `number`                | `0`     | Number of retry attempts on failure  |
| `retryDelay`   | `number`                | `1000`  | Delay between retries (ms)           |
| `staleTime`    | `number`                | `0`     | Time before data is stale (ms)       |
| `cacheKey`     | `string`                | -       | Cache key for stale-while-revalidate |

### Returns

| Property  | Type                                    | Description                    |
| --------- | --------------------------------------- | ------------------------------ |
| `data`    | `T \| null`                             | The result of the async operation |
| `loading` | `boolean`                               | Whether the operation is in progress |
| `error`   | `Error \| null`                         | Error object if operation failed |
| `success` | `boolean`                               | Whether the operation succeeded |
| `execute` | `(...args: any[]) => Promise<T \| undefined>` | Execute the async function |
| `retry`   | `() => Promise<T \| undefined>`         | Retry the last execution |
| `reset`   | `() => void`                            | Reset all state |
| `cancel`  | `() => void`                            | Cancel the current operation |

---

## Examples

### Data Fetching with Error Handling

```typescript
import { useAsync } from "oreacto";
import { useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

function PostList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: posts, loading, error, execute } = useAsync<Post[]>(
    async (term) => {
      const response = await fetch(`/api/posts?search=${term}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
    {
      onSuccess: (data) => console.log(`Loaded ${data.length} posts`),
      onError: (error) => console.error("Post fetch failed:", error),
    }
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    execute(term);
  };

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search posts..."
      />

      {loading && <div>Loading posts...</div>}
      {error && <div>Error: {error.message}</div>}
      {posts && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Retry Logic

```typescript
import { useAsync } from "oreacto";

function ReliableDataFetcher() {
  const { data, loading, error, retry } = useAsync(
    async () => {
      const response = await fetch("/api/unreliable-endpoint");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    {
      retryCount: 3,
      retryDelay: 2000,
      onError: (error) => {
        console.log(`Attempt failed: ${error.message}`);
      },
    }
  );

  return (
    <div>
      {loading && <div>Loading... (retrying if needed)</div>}
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {data && <div>Success: {JSON.stringify(data)}</div>}
    </div>
  );
}
```

### Caching with Stale-While-Revalidate

```typescript
import { useAsync } from "oreacto";
import { useEffect } from "react";

function CachedUserSettings() {
  const { data: settings, loading, execute } = useAsync(
    async () => {
      const response = await fetch("/api/user/settings");
      return response.json();
    },
    {
      cacheKey: "user-settings",
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => console.log("Settings loaded:", data),
    }
  );

  useEffect(() => {
    execute();
  }, []);

  const refreshSettings = () => {
    execute(); // Will use cache if fresh, otherwise fetch
  };

  return (
    <div>
      <button onClick={refreshSettings}>Refresh Settings</button>
      {loading && <div>Loading settings...</div>}
      {settings && (
        <div>
          <h3>Settings</h3>
          <pre>{JSON.stringify(settings, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### Form Submission with Loading States

```typescript
import { useAsync } from "oreacto";
import { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const { loading, error, success, execute, reset } = useAsync(
    async (data) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    {
      onSuccess: () => {
        setFormData({ name: "", email: "", message: "" });
        alert("Message sent successfully!");
      },
      onError: (error) => {
        alert(`Failed to send message: ${error.message}`);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute(formData);
  };

  if (success) {
    return <div>Thank you! Your message has been sent.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### File Upload with Progress

```typescript
import { useAsync } from "oreacto";
import { useState } from "react";

function FileUploader() {
  const [file, setFile] = useState<File | null>(null);

  const { loading, error, success, execute } = useAsync(
    async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    {
      onSuccess: (result) => {
        console.log("File uploaded:", result.url);
        setFile(null);
      },
    }
  );

  const handleUpload = () => {
    if (file) execute(file);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={loading}
      />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <div>Upload failed: {error.message}</div>}
      {success && <div>File uploaded successfully!</div>}
    </div>
  );
}
```

### Multiple Async Operations

```typescript
import { useAsync } from "oreacto";

function Dashboard() {
  const userQuery = useAsync(async () => {
    const response = await fetch("/api/user");
    return response.json();
  });

  const postsQuery = useAsync(async () => {
    const response = await fetch("/api/posts");
    return response.json();
  });

  const statsQuery = useAsync(async () => {
    const response = await fetch("/api/stats");
    return response.json();
  });

  const isLoading = userQuery.loading || postsQuery.loading || statsQuery.loading;
  const hasError = userQuery.error || postsQuery.error || statsQuery.error;

  if (isLoading) return <div>Loading dashboard...</div>;
  if (hasError) return <div>Error loading dashboard</div>;

  return (
    <div>
      <h1>Welcome, {userQuery.data?.name}</h1>
      <div>Posts: {postsQuery.data?.length}</div>
      <div>Stats: {JSON.stringify(statsQuery.data)}</div>
    </div>
  );
}
```

---

## Common Use Cases

### 1. **API Data Fetching**

Replace `useEffect` + `useState` patterns:

```typescript
// Before: Manual state management
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchData()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);

// After: useAsync
const { data, loading, error, execute } = useAsync(fetchData);
useEffect(() => execute(), []);
```

### 2. **Form Submissions**

```typescript
const { loading, error, execute } = useAsync(submitForm, {
  onSuccess: () => resetForm(),
  onError: (err) => showToast(err.message),
});
```

### 3. **Search with Debouncing**

```typescript
const { data, loading, execute } = useAsync(searchAPI);

const debouncedSearch = useMemo(
  () => debounce((term) => execute(term), 300),
  [execute]
);
```

### 4. **Optimistic Updates**

```typescript
const { execute, retry } = useAsync(updateUser, {
  onError: () => {
    // Rollback optimistic update
    setUser(previousUser);
  },
});
```

---

## Best Practices

### ✅ Do's

- Use `execute` for manual triggers, `useEffect` for automatic execution
- Provide meaningful error messages in your async functions
- Use `retryCount` for network operations that might fail temporarily
- Leverage `cacheKey` and `staleTime` for frequently accessed data
- Handle loading states in your UI
- Use `cancel()` to prevent memory leaks on unmount

### ❌ Don'ts

- Don't forget to handle error states in your UI
- Avoid creating new async functions on every render
- Don't use `useAsync` for simple state updates (use `useState`)
- Avoid excessive retries (3-5 max)
- Don't ignore the `success` state for important operations

---

## Advanced Patterns

### Custom Retry Strategy

```typescript
const { execute, retry } = useAsync(
  async (id) => {
    const response = await fetch(`/api/data/${id}`);
    if (response.status === 429) {
      // Rate limited - retry with longer delay
      throw new Error("RATE_LIMITED");
    }
    return response.json();
  },
  {
    retryCount: 5,
    retryDelay: (attempt) => attempt * 1000, // Exponential backoff
    onError: (error) => {
      if (error.message === "RATE_LIMITED") {
        // Custom retry logic
        setTimeout(() => retry(), 5000);
      }
    },
  }
);
```

### Conditional Execution

```typescript
const { data, loading, execute } = useAsync(async (userId) => {
  if (!userId) return null;
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Only execute when userId is available
useEffect(() => {
  if (userId) execute(userId);
}, [userId]);
```

### Parallel Operations

```typescript
function useParallelAsync<T>(asyncFns: Array<() => Promise<T>>) {
  const results = asyncFns.map((fn) => useAsync(fn));
  
  return {
    data: results.map(r => r.data),
    loading: results.some(r => r.loading),
    error: results.find(r => r.error)?.error || null,
    executeAll: () => Promise.all(results.map(r => r.execute())),
  };
}
```

---

## Performance Tips

### Memoize Async Functions

```typescript
const fetchUser = useCallback(async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}, []);

const { data, loading, execute } = useAsync(fetchUser);
```

### Use Cache for Expensive Operations

```typescript
const { data } = useAsync(expensiveCalculation, {
  cacheKey: `calc-${input}`,
  staleTime: 10 * 60 * 1000, // 10 minutes
});
```

### Cancel Unnecessary Requests

```typescript
useEffect(() => {
  return () => {
    // Cancel request on unmount
    cancel();
  };
}, []);
```

---

## TypeScript

Fully typed with generics:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const { data, loading, error }: UseAsyncResult<User> = useAsync<User>(
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json() as Promise<User>;
  }
);

// data is User | null
// error is Error | null
// loading is boolean
```

---

## Related Hooks

- **useAI** - For AI-powered async operations
- **useInfiniteScroll** - For paginated data loading
- **useSmartOSearch** - For search with debouncing

---

## Browser Support

Works in all modern browsers that support React 18+ and Promise.

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

