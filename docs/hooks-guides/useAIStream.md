# useAIStream

Stream AI responses in real-time with token-by-token delivery.

---

## Overview

`useAIStream` provides real-time streaming of AI responses, perfect for building ChatGPT-like experiences where text appears progressively. Works with OpenAI, Anthropic, and custom streaming endpoints.

**Key Features:**
- 🌊 Real-time token-by-token streaming
- ⏸️ Abort/pause mid-stream
- 🔄 Auto-accumulation of chunks
- 🎯 Custom chunk parsing
- 📡 Server-Sent Events (SSE) support
- 🔧 Runtime configuration override

---

## Installation

```bash
npm install oreacto
```

---

## Basic Usage

```typescript
import { useAIStream } from "oreacto";

function StreamingChat() {
  const { data, isStreaming, startStream, abort } = useAIStream({
    url: "/api/ai/stream",
    body: { prompt: "Tell me a story" },
  });

  return (
    <div>
      <button onClick={() => startStream()}>Start</button>
      <button onClick={abort} disabled={!isStreaming}>Stop</button>
      <div>{data}</div>
      {isStreaming && <span>Streaming...</span>}
    </div>
  );
}
```

---

## API Reference

```typescript
function useAIStream(config: AIStreamConfig): UseAIStreamResult
```

### Parameters

| Parameter    | Type                              | Description                                  |
| ------------ | --------------------------------- | -------------------------------------------- |
| `url`        | `string`                          | API endpoint URL                             |
| `method`     | `'POST' \| 'GET'`                 | HTTP method (default: POST)                  |
| `headers`    | `Record<string, string>`          | Custom headers                               |
| `body`       | `Record<string, any>`             | Request body (can override at runtime)       |
| `parseChunk` | `(chunk: string) => string \| null` | Custom chunk parser (return null to skip)    |
| `onChunk`    | `(chunk: string) => void`         | Callback for each chunk                      |
| `onComplete` | `(fullText: string) => void`      | Callback when streaming completes            |
| `onError`    | `(error: Error) => void`          | Callback on error                            |

### Returns

| Property      | Type                                                      | Description                              |
| ------------- | --------------------------------------------------------- | ---------------------------------------- |
| `data`        | `string`                                                  | Accumulated streamed text                |
| `isStreaming` | `boolean`                                                 | Whether stream is active                 |
| `isComplete`  | `boolean`                                                 | Whether stream completed successfully    |
| `error`       | `Error \| null`                                           | Error object if streaming failed         |
| `startStream` | `(config?: Partial<AIStreamConfig>) => Promise<void>`     | Start streaming with optional override   |
| `abort`       | `() => void`                                              | Abort the current stream                 |
| `reset`       | `() => void`                                              | Reset hook state                         |

---

## Examples

### OpenAI Integration

```typescript
import { useAIStream } from "oreacto";

function OpenAIChat() {
  const { data, isStreaming, startStream, abort } = useAIStream({
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: {
      model: "gpt-4",
      stream: true,
      messages: [{ role: "user", content: "Hello!" }],
    },
    parseChunk: (chunk) => {
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
  });

  return (
    <div>
      <div className="message">{data}</div>
      {isStreaming ? (
        <button onClick={abort}>Stop</button>
      ) : (
        <button onClick={() => startStream()}>Generate</button>
      )}
    </div>
  );
}
```

### Custom Backend Streaming

```typescript
import { useAIStream } from "oreacto";
import { useState } from "react";

function CustomStream() {
  const [prompt, setPrompt] = useState("");

  const { data, isStreaming, startStream } = useAIStream({
    url: "/api/stream",
    onComplete: (fullText) => {
      console.log("Completed:", fullText);
    },
  });

  const handleSubmit = () => {
    startStream({
      body: { prompt },
    });
  };

  return (
    <div>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleSubmit} disabled={isStreaming}>
        Send
      </button>
      <div className="response">{data}</div>
    </div>
  );
}
```

### Chat Interface with Streaming

```typescript
import { useAIStream } from "oreacto";
import { useState } from "react";

function StreamingChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { data, isStreaming, startStream, reset } = useAIStream({
    url: "/api/ai/chat",
    onComplete: (fullText) => {
      setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
      reset();
    },
  });

  const handleSend = async () => {
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    await startStream({ body: { prompt: input } });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isStreaming && (
          <div className="message assistant streaming">
            {data}
            <span className="cursor">▋</span>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={isStreaming}>
          {isStreaming ? "Streaming..." : "Send"}
        </button>
      </div>
    </div>
  );
}
```

### Code Generator with Streaming

```typescript
import { useAIStream } from "oreacto";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

function CodeGenerator() {
  const { data, isStreaming, error, startStream } = useAIStream({
    url: "/api/generate-code",
    body: {
      language: "typescript",
      description: "React component",
    },
    onChunk: (chunk) => {
      // Could add typing sound effect
      // playTypingSound();
    },
  });

  return (
    <div>
      <button onClick={() => startStream()}>Generate Code</button>
      {error && <div className="error">{error.message}</div>}
      <SyntaxHighlighter language="typescript">
        {data || "// Code will appear here..."}
      </SyntaxHighlighter>
      {isStreaming && <div className="loading">Generating...</div>}
    </div>
  );
}
```

### Anthropic (Claude) Integration

```typescript
import { useAIStream } from "oreacto";

function ClaudeChat() {
  const { data, isStreaming, startStream } = useAIStream({
    url: "https://api.anthropic.com/v1/messages",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: {
      model: "claude-3-opus-20240229",
      stream: true,
      max_tokens: 1024,
      messages: [{ role: "user", content: "Hello!" }],
    },
    parseChunk: (chunk) => {
      if (chunk.startsWith("data: ")) {
        const data = chunk.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta") {
            return parsed.delta?.text || null;
          }
        } catch {}
      }
      return null;
    },
  });

  return <div>{data}</div>;
}
```

---

## Common Use Cases

### 1. **ChatGPT-like Interfaces**

Real-time chat with progressive text display.

### 2. **Code Generation**

Stream generated code with syntax highlighting.

### 3. **Content Creation**

Blog posts, stories, articles appearing in real-time.

### 4. **Translation Services**

Live translation with streaming output.

### 5. **Documentation Generation**

Real-time API documentation generation.

---

## Best Practices

### ✅ Do's

- Use `abort()` when component unmounts
- Handle errors gracefully with `onError`
- Parse chunks correctly with `parseChunk`
- Provide loading/streaming indicators
- Reset state before starting new stream
- Memoize config objects

### ❌ Don'ts

- Don't create config objects on every render
- Don't forget to handle `[DONE]` message for SSE
- Don't ignore `isStreaming` state
- Don't stream sensitive data without security
- Don't expose API keys in frontend

---

## Advanced Features

### Runtime Configuration Override

```typescript
const { startStream } = useAIStream({
  url: "/api/ai",
  body: { model: "gpt-4" },
});

// Override at runtime
startStream({
  body: {
    model: "gpt-4-turbo",
    temperature: 0.8,
    messages: [{ role: "user", content: "Hello" }],
  },
});
```

### Error Handling & Retry

```typescript
const [retryCount, setRetryCount] = useState(0);

const { error, startStream } = useAIStream({
  url: "/api/stream",
  onError: (error) => {
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount((c) => c + 1);
        startStream();
      }, 1000 * retryCount);
    }
  },
  onComplete: () => setRetryCount(0),
});
```

### Progress Tracking

```typescript
const [progress, setProgress] = useState(0);

const { data } = useAIStream({
  url: "/api/stream",
  onChunk: (chunk) => {
    const expectedLength = 1000;
    setProgress((data.length / expectedLength) * 100);
  },
});
```

---

## Troubleshooting

### Issue: Chunks not appearing

**Solution:** Debug your `parseChunk` function:

```typescript
parseChunk: (chunk) => {
  console.log("Raw chunk:", chunk); // Debug
  // Your parsing logic
};
```

### Issue: Stream never completes

**Solution:** Ensure backend closes stream properly:

```javascript
// Backend
res.end(); // Must call this
```

### Issue: TypeScript errors

**Solution:** Import types explicitly:

```typescript
import { useAIStream, type AIStreamConfig } from "oreacto";
```

---

## Performance Tips

1. **Debounce input** before streaming
2. **Virtualize long responses** for better performance
3. **Limit concurrent streams**
4. **Use `onChunk` for side effects** instead of watching `data`
5. **Memoize configuration objects**

---

## Security

### ⚠️ Never expose API keys in frontend!

**Use a backend proxy:**

```typescript
// ✅ Good: Proxy through backend
const { data } = useAIStream({ url: "/api/ai/proxy" });

// ❌ Bad: API key in frontend
const { data } = useAIStream({
  headers: { Authorization: "Bearer sk-..." }, // NEVER DO THIS
});
```

---

## TypeScript

Fully typed:

```typescript
import { useAIStream, type AIStreamConfig, type UseAIStreamResult } from "oreacto";

const config: AIStreamConfig = {
  url: "/api/stream",
  body: { prompt: "Hello" },
};

const result: UseAIStreamResult = useAIStream(config);
```

---

## Related Hooks

- **useAI** - For simple non-streaming AI requests
- **useAIChat** - For chat interfaces with history

---

## Complete Guides

- **[Advanced Streaming Guide](../AI_STREAMING_GUIDE.md)** - Deep dive with more examples
- **[FREE AI Setup](../FREE_AI_SETUP.md)** - Get your free API keys

---

## Browser Support

Uses Fetch API and ReadableStream - supported in all modern browsers (95%+ coverage).

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

