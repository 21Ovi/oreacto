# 🤖 AI Streaming Guide - `useAIStream`

A comprehensive guide for integrating AI streaming into your React apps with `useAIStream`.

---

## Quick Start

```bash
npm install oreacto
```

```typescript
import { useAIStream } from "oreacto";

const { data, isStreaming, startStream } = useAIStream({
  url: "/api/ai/chat",
  body: { prompt: "Hello AI!" },
});
```

---

## Common Integrations

### 1. OpenAI (ChatGPT)

```typescript
const { data, isStreaming, startStream, abort } = useAIStream({
  url: "https://api.openai.com/v1/chat/completions",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: {
    model: "gpt-4",
    stream: true,
    messages: [{ role: "user", content: "Tell me a joke" }],
  },
  parseChunk: (chunk) => {
    if (chunk.startsWith("data: ")) {
      const data = chunk.slice(6);
      if (data === "[DONE]") return null;
      try {
        const parsed = JSON.parse(data);
        return parsed.choices?.[0]?.delta?.content || null;
      } catch {
        return null;
      }
    }
    return null;
  },
});
```

### 2. Anthropic (Claude)

```typescript
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
```

### 3. Custom Backend (Node.js/Express)

**Backend (Express):**

```javascript
app.post("/api/ai/chat", async (req, res) => {
  const { prompt } = req.body;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  // Simulate streaming response
  const words = prompt.split(" ");
  for (const word of words) {
    res.write(word + " ");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  res.end();
});
```

**Frontend:**

```typescript
const { data, isStreaming, startStream } = useAIStream({
  url: "/api/ai/chat",
  body: { prompt: "Your prompt here" },
});
```

---

## Real-World Examples

### Chat Interface

```typescript
import { useState } from "react";
import { useAIStream } from "oreacto";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { data, isStreaming, startStream, reset } = useAIStream({
    url: "/api/ai/chat",
    onComplete: (fullText) => {
      setMessages((prev) => [...prev, { role: "assistant", text: fullText }]);
      reset();
    },
  });

  const handleSend = async () => {
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    await startStream({ body: { prompt: input } });
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {isStreaming && (
          <div className="message assistant streaming">{data}</div>
        )}
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={isStreaming}>
          Send
        </button>
      </div>
    </div>
  );
};
```

### Code Generation with Syntax Highlighting

```typescript
import { useAIStream } from "oreacto";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const CodeGenerator = () => {
  const { data, isStreaming, startStream, error } = useAIStream({
    url: "/api/ai/generate-code",
    body: {
      language: "typescript",
      description: "Create a React component",
    },
    onChunk: (chunk) => {
      // Could add typing sound effect here
      // playTypingSound();
    },
  });

  return (
    <div>
      {error && <div className="error">{error.message}</div>}
      <SyntaxHighlighter language="typescript">
        {data || "// Generated code will appear here..."}
      </SyntaxHighlighter>
      {isStreaming && <div className="loading-indicator">Generating...</div>}
    </div>
  );
};
```

### Multi-Step AI Workflow

```typescript
const MultiStepAI = () => {
  const [step, setStep] = useState(1);

  const step1 = useAIStream({ url: "/api/ai/analyze" });
  const step2 = useAIStream({ url: "/api/ai/summarize" });
  const step3 = useAIStream({ url: "/api/ai/recommendations" });

  useEffect(() => {
    if (step1.isComplete && step === 1) {
      step2.startStream({ body: { input: step1.data } });
      setStep(2);
    }
    if (step2.isComplete && step === 2) {
      step3.startStream({ body: { input: step2.data } });
      setStep(3);
    }
  }, [step1.isComplete, step2.isComplete]);

  return (
    <div>
      <div>Step 1: {step1.isStreaming ? "⏳" : "✅"}</div>
      <div>Step 2: {step2.isStreaming ? "⏳" : step >= 2 ? "✅" : "⏸️"}</div>
      <div>Step 3: {step3.isStreaming ? "⏳" : step >= 3 ? "✅" : "⏸️"}</div>
    </div>
  );
};
```

---

## Advanced Features

### Runtime Configuration Override

```typescript
const { startStream } = useAIStream({
  url: "/api/ai",
  body: { model: "gpt-4" },
});

// Override specific config at runtime
const handleCustomRequest = (userInput: string, temperature: number) => {
  startStream({
    body: {
      model: "gpt-4",
      temperature,
      messages: [{ role: "user", content: userInput }],
    },
  });
};
```

### Error Handling & Retry Logic

```typescript
const [retryCount, setRetryCount] = useState(0);

const { error, startStream, reset } = useAIStream({
  url: "/api/ai/chat",
  onError: (error) => {
    console.error("Stream failed:", error);
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

### Streaming with Progress Tracking

```typescript
const [progress, setProgress] = useState(0);
const expectedLength = 1000; // characters

const { data } = useAIStream({
  url: "/api/ai",
  onChunk: () => {
    setProgress((data.length / expectedLength) * 100);
  },
});

return <ProgressBar value={progress} />;
```

---

## Best Practices

### ✅ Do's

- Always provide error handling with `onError` or check the `error` state
- Use `abort()` when component unmounts to prevent memory leaks
- Memoize configuration objects to prevent unnecessary re-renders
- Use `reset()` before starting a new stream to clear previous data

### ❌ Don'ts

- Don't forget to handle the `[DONE]` message for SSE streams
- Don't create new config objects on every render
- Don't ignore the `isStreaming` state (can lead to race conditions)
- Don't stream sensitive data without proper security measures

---

## Troubleshooting

### Issue: Chunks not appearing

**Solution:** Ensure your `parseChunk` function is correctly extracting text:

```typescript
parseChunk: (chunk) => {
  console.log("Raw chunk:", chunk); // Debug
  // Your parsing logic
};
```

### Issue: Stream never completes

**Solution:** Check if your backend properly closes the stream:

```javascript
// Backend should call res.end()
res.end();
```

### Issue: TypeScript errors

**Solution:** Import types explicitly:

```typescript
import { useAIStream, type AIStreamConfig } from "oreacto";
```

---

## Performance Tips

1. **Debounce user input** before streaming:

```typescript
import { useDebounce } from "oreacto"; // Coming soon!
const debouncedInput = useDebounce(input, 500);
```

2. **Virtualize long responses** for better performance
3. **Limit concurrent streams** to avoid overwhelming the client
4. **Use `onChunk` for side effects** rather than watching `data`

---

## Security Considerations

⚠️ **Never expose API keys in frontend code!**

Use a backend proxy:

```typescript
// ✅ Good: Proxy through your backend
const { data } = useAIStream({ url: "/api/ai/proxy" });

// ❌ Bad: API key in frontend
const { data } = useAIStream({
  url: "https://api.openai.com/...",
  headers: { Authorization: "Bearer sk-..." }, // NEVER DO THIS
});
```

---

## Contributing

Have ideas for improving `useAIStream`? Open an issue or PR at:
https://github.com/21Ovi/oreacto

---

Made with ❤️ by the oreacto team

