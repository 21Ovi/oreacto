# oreacto

A collection of powerful, ready-to-use React hooks in TypeScript to streamline your development. Each hook is optimized for common use cases, from route-based titles to smart filtering and infinite scrolling, making your React apps more efficient and developer-friendly.

## Installation

Install the package via npm:

```bash
npm install oreacto
```

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

### 4. `useDynamicFields`

Generate dynamic field objects based on a parent value. Useful for rendering dynamic forms or repeating fields based on user input.

```typescript
import { useDynamicFields } from "oreacto";

const MyComponent = ({ parentValue }) => {
  const dynamicFields = useDynamicFields(parentValue, "items", {
    label: "Item",
    value: "",
  });

  return (
    <div>
      {dynamicFields.map((field) => (
        <div key={field.fieldName}>
          <label>{field.label}</label>
          <input name={field.fieldName} defaultValue={field.value} />
        </div>
      ))}
    </div>
  );
};
```

### 5. `useAIStream` 🤖

Stream AI responses from OpenAI, Anthropic, or any streaming API. Perfect for building ChatGPT-like interfaces with real-time token streaming, abort control, and flexible configuration.

> 📚 **[Read the complete AI Streaming Guide](./AI_STREAMING_GUIDE.md)** for detailed examples, integrations, and best practices.

**Basic Usage:**

```typescript
import { useAIStream } from "oreacto";

const ChatComponent = () => {
  const { data, isStreaming, startStream, abort } = useAIStream({
    url: "/api/ai/chat",
    body: {
      prompt: "Tell me a story",
    },
  });

  return (
    <div>
      <div>{data}</div>
      {isStreaming ? (
        <button onClick={abort}>Stop</button>
      ) : (
        <button onClick={() => startStream()}>Start</button>
      )}
    </div>
  );
};
```

**OpenAI Integration:**

```typescript
const { data, isStreaming, startStream, abort, error } = useAIStream({
  url: "https://api.openai.com/v1/chat/completions",
  headers: {
    Authorization: `Bearer ${YOUR_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: {
    model: "gpt-4",
    stream: true,
    messages: [{ role: "user", content: "Hello!" }],
  },
  parseChunk: (chunk) => {
    // Parse OpenAI's Server-Sent Events format
    if (chunk.startsWith("data: ")) {
      const data = chunk.slice(6);
      if (data === "[DONE]") return null;
      try {
        const json = JSON.parse(data);
        return json.choices?.[0]?.delta?.content || null;
      } catch {
        return null;
      }
    }
    return null;
  },
  onComplete: (fullText) => {
    console.log("Stream completed:", fullText);
  },
});

// Override config at runtime
const handleSubmit = (userMessage: string) => {
  startStream({
    body: {
      ...baseConfig,
      messages: [{ role: "user", content: userMessage }],
    },
  });
};
```

**Advanced Usage with Callbacks:**

```typescript
const { data, isStreaming, isComplete, reset } = useAIStream({
  url: "/api/stream",
  onChunk: (chunk) => {
    // Process each chunk (e.g., play sound, analytics)
    console.log("Received chunk:", chunk);
  },
  onComplete: (fullText) => {
    // Save to database, show notification, etc.
    saveToHistory(fullText);
  },
  onError: (error) => {
    // Handle errors gracefully
    showErrorNotification(error.message);
  },
});
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
  - `fieldName` (`string`): Base name for the generated fields.
  - `fieldTemplate` (`object`): Template object for each field.

- **Returns**: `Array<object>` - Array of field objects with `fieldName` and `label`.

### `useAIStream`

- **Parameters**:

  - `config` (`AIStreamConfig`): Configuration object for the stream
    - `url` (`string`): The API endpoint URL
    - `method` (`'POST' | 'GET'`): HTTP method (default: POST)
    - `headers` (`object`): Custom headers for the request
    - `body` (`object`): Request body (can be overridden at runtime)
    - `onChunk` (`function`): Callback fired for each chunk received
    - `onComplete` (`function`): Callback fired when stream completes
    - `onError` (`function`): Callback fired on error
    - `parseChunk` (`function`): Custom chunk parser (return null to skip chunk)

- **Returns**: `UseAIStreamResult`

  - `data` (`string`): The accumulated streamed text content
  - `isStreaming` (`boolean`): Whether the stream is currently active
  - `error` (`Error | null`): Error object if streaming failed
  - `startStream` (`function`): Start streaming with optional runtime config override
  - `abort` (`function`): Abort the current stream
  - `reset` (`function`): Reset the hook state
  - `isComplete` (`boolean`): Whether the stream has completed successfully

## License

MIT © [Mohammad Ovesh](https://github.com/21Ovi)

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

With these hooks, you can supercharge your React app and focus on building rather than reinventing the wheel. Enjoy using `oreacto`!
