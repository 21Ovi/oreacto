# oreacto 🚀

A collection of powerful, ready-to-use React hooks in TypeScript to streamline your development. From **AI integrations** with FREE providers to infinite scrolling and smart search - build modern React apps faster!

## ✨ What's New in v1.0.5

🤖 **AI Hooks** - Add AI to your app in minutes with FREE providers (Groq, Hugging Face, Together AI)!
- `useAI` - Simple prompt → response
- `useAIChat` - ChatGPT-like interfaces with conversation history
- `useAIStream` - Real-time streaming for advanced use cases

No complicated setup, no expensive APIs - just **free, fast AI** for your React apps!

## Installation

Install the package via npm:

```bash
npm install oreacto
```

## 📚 Documentation

**[→ Complete Documentation](./docs/README.md)** - Comprehensive guides for all hooks

**Individual Hook Guides:**
- [useRouteTitle](./docs/hooks-guides/useRouteTitle.md) - Format titles from URL paths
- [useSmartOSearch](./docs/hooks-guides/useSmartOSearch.md) - Filter and sort lists
- [useInfiniteScroll](./docs/hooks-guides/useInfiniteScroll.md) - Infinite scrolling
- [useDynamicFields](./docs/hooks-guides/useDynamicFields.md) - Dynamic form fields
- [useAsync](./docs/hooks-guides/useAsync.md) - Async state management
- [useAI](./docs/hooks-guides/useAI.md) - Simple AI integration
- [useAIChat](./docs/hooks-guides/useAIChat.md) - ChatGPT-like interfaces
- [useAIStream](./docs/hooks-guides/useAIStream.md) - Real-time AI streaming

**AI Setup:**
- [FREE API Keys Setup](./docs/FREE_AI_SETUP.md) ⭐ Get your free AI keys in 2 minutes!

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

### 5. `useAsync` ⚡ **[NEW!]**

Complete async state management with built-in loading states, error handling, retry logic, and caching. Perfect for API calls and data fetching.

```typescript
import { useAsync } from "oreacto";

const MyComponent = () => {
  const { data, loading, error, execute, retry } = useAsync(
    async (userId) => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
    {
      retryCount: 3,
      retryDelay: 1000,
      onSuccess: (user) => console.log("User loaded:", user),
      onError: (error) => console.error("Failed:", error),
    }
  );

  return (
    <div>
      <button onClick={() => execute("123")}>Load User</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Hello, {data.name}!</p>}
    </div>
  );
};
```

### 6. `useAI` 🤖 **[NEW!]**

The simplest way to add AI to your React app! Just pass a prompt and get a response. Works with **FREE** AI providers (Groq, Hugging Face, Together AI).

**Basic Usage:**

```typescript
import { useAI } from "oreacto";

const MyComponent = () => {
  const { response, loading, sendPrompt } = useAI({
    provider: "groq", // FREE! Get key from https://console.groq.com
    apiKey: "gsk_...",
  });

  return (
    <div>
      <button onClick={() => sendPrompt("Explain React hooks")}>
        Ask AI
      </button>
      {loading && <p>Thinking...</p>}
      {response && <p>{response}</p>}
    </div>
  );
};
```

**Supported FREE Providers:**

- **Groq** (⚡ Fastest) - Get free API key at [console.groq.com](https://console.groq.com)
- **Hugging Face** (🤗 Most models) - Get free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- **Together AI** (💪 Powerful) - Get free API key at [api.together.xyz](https://api.together.xyz)

> 🆓 **[Complete FREE API Keys Setup Guide](./docs/FREE_AI_SETUP.md)** - Get your free AI API keys in 2 minutes!

### 6. `useAIChat` 💬 **[NEW!]**

Build ChatGPT-like interfaces with conversation history management.

```typescript
import { useAIChat } from "oreacto";

const ChatApp = () => {
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage, clearChat } = useAIChat({
    provider: "groq",
    apiKey: process.env.GROQ_API_KEY,
    systemPrompt: "You are a helpful coding assistant.",
  });

  const handleSend = async () => {
    await sendMessage(input);
    setInput("");
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} disabled={loading}>
        Send
      </button>
      <button onClick={clearChat}>Clear</button>
    </div>
  );
};
```

### 7. `useAIStream` 🌊

Stream AI responses in real-time for OpenAI, Anthropic, or any streaming API. Perfect for advanced use cases with token-by-token streaming.

> 📚 **[Complete Hook Guide](./docs/hooks-guides/useAIStream.md)** | **[Advanced Examples](./docs/AI_STREAMING_GUIDE.md)**

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

### `useAsync`

- **Parameters**:

  - `asyncFn` (`function`): The async function to execute
  - `config` (`object`): Configuration options
    - `onSuccess` (`function`): Callback fired on successful execution
    - `onError` (`function`): Callback fired on error
    - `retryCount` (`number`): Number of retry attempts on failure (default: 0)
    - `retryDelay` (`number`): Delay between retries in milliseconds (default: 1000)
    - `staleTime` (`number`): Time in ms before data is considered stale (default: 0)
    - `cacheKey` (`string`): Cache key for stale-while-revalidate pattern

- **Returns**: `UseAsyncResult<T>`
  - `data` (`T | null`): The result of the async operation
  - `loading` (`boolean`): Whether the operation is in progress
  - `error` (`Error | null`): Error object if operation failed
  - `success` (`boolean`): Whether the operation succeeded
  - `execute` (`function`): Execute the async function
  - `retry` (`function`): Retry the last execution
  - `reset` (`function`): Reset all state
  - `cancel` (`function`): Cancel the current operation

### `useAI`

- **Parameters**:

  - `config` (`UseAIConfig`): Configuration object
    - `provider` (`'groq' | 'huggingface' | 'together' | 'custom'`): AI provider (default: groq)
    - `model` (`string`): Model name (e.g., 'llama-3.1-8b', 'mixtral-8x7b')
    - `apiKey` (`string`): API key for the provider
    - `systemPrompt` (`string`): System prompt to guide AI behavior
    - `temperature` (`number`): Creativity level 0-1 (default: 0.7)
    - `maxTokens` (`number`): Max response length (default: 1024)
    - `onSuccess` (`function`): Callback on successful response
    - `onError` (`function`): Callback on error

- **Returns**: `UseAIResult`
  - `response` (`string | null`): The AI response
  - `loading` (`boolean`): Whether request is in progress
  - `error` (`Error | null`): Error object if request failed
  - `sendPrompt` (`function`): Send a prompt to the AI
  - `clear` (`function`): Clear the response

### `useAIChat`

- **Parameters**:

  - `config` (`UseAIChatConfig`): Configuration object (extends UseAIConfig)
    - All parameters from `useAI` plus:
    - `initialMessages` (`ChatMessage[]`): Initial conversation history
    - `maxHistory` (`number`): Maximum messages to keep (default: 50)

- **Returns**: `UseAIChatResult`
  - `messages` (`ChatMessage[]`): Array of chat messages
  - `loading` (`boolean`): Whether request is in progress
  - `error` (`Error | null`): Error object if request failed
  - `sendMessage` (`function`): Send a message and get AI response
  - `clearChat` (`function`): Clear all messages
  - `removeMessage` (`function`): Remove specific message by index
  - `getChatHistory` (`function`): Get user/assistant messages only

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
