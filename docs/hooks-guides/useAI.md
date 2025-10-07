# useAI

The simplest way to add AI to your React app. Just pass a prompt, get a response!

---

## Overview

`useAI` makes AI integration effortless with built-in support for **FREE** AI providers. No complex setup, no expensive APIs - just clean, simple AI interactions.

**Key Features:**
- 🆓 Works with FREE providers (Groq, Hugging Face, Together AI)
- ⚡ Simple API: prompt → response
- 🔧 Highly configurable (temperature, max tokens, system prompts)
- 🎯 Built-in error handling
- 🔄 Callbacks for side effects
- 🔐 Custom backend support

---

## Installation

```bash
npm install oreacto
```

**Get your FREE API key:** [Setup Guide](../FREE_AI_SETUP.md)

---

## Basic Usage

```typescript
import { useAI } from "oreacto";

function AIAssistant() {
  const { response, loading, sendPrompt } = useAI({
    provider: "groq", // FREE!
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
  });

  return (
    <div>
      <button onClick={() => sendPrompt("Explain React hooks")}>
        Ask AI
      </button>
      {loading && <p>Thinking...</p>}
      {response && <div>{response}</div>}
    </div>
  );
}
```

---

## API Reference

```typescript
function useAI(config: UseAIConfig): UseAIResult
```

### Parameters

| Parameter      | Type                             | Default      | Description                          |
| -------------- | -------------------------------- | ------------ | ------------------------------------ |
| `provider`     | `'groq' \| 'huggingface' \| 'together' \| 'custom'` | `'groq'`     | AI provider to use                   |
| `model`        | `string`                         | `'llama-3.1-8b'` | Model name                           |
| `apiKey`       | `string`                         | -            | API key (required for most providers)|
| `apiUrl`       | `string`                         | -            | Custom API URL (for custom provider) |
| `systemPrompt` | `string`                         | -            | System prompt to guide AI behavior   |
| `temperature`  | `number`                         | `0.7`        | Creativity level (0-1)               |
| `maxTokens`    | `number`                         | `1024`       | Maximum response length              |
| `onSuccess`    | `(response: string) => void`     | -            | Callback on successful response      |
| `onError`      | `(error: Error) => void`         | -            | Callback on error                    |

### Returns

| Property     | Type                                                    | Description                    |
| ------------ | ------------------------------------------------------- | ------------------------------ |
| `response`   | `string \| null`                                        | The AI response                |
| `loading`    | `boolean`                                               | Whether request is in progress |
| `error`      | `Error \| null`                                         | Error object if request failed |
| `sendPrompt` | `(prompt: string, config?: Partial<UseAIConfig>) => Promise<void>` | Send a prompt to AI            |
| `clear`      | `() => void`                                            | Clear the response             |

---

## Supported Providers

### 1. Groq (Recommended ⚡)

**Fastest inference!** Get free API key at [console.groq.com](https://console.groq.com)

```typescript
const { response, sendPrompt } = useAI({
  provider: "groq",
  apiKey: "gsk_...",
  model: "llama-3.1-8b", // or "llama-3.1-70b", "mixtral-8x7b", "gemma-7b"
});
```

### 2. Hugging Face 🤗

**1000s of models!** Get free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

```typescript
const { response, sendPrompt } = useAI({
  provider: "huggingface",
  apiKey: "hf_...",
  model: "mixtral-8x7b",
});
```

### 3. Together AI 💪

**$25 free credits!** Get API key at [api.together.xyz](https://api.together.xyz)

```typescript
const { response, sendPrompt } = useAI({
  provider: "together",
  apiKey: "your_key",
  model: "llama-3.1-70b",
});
```

### 4. Custom Backend

```typescript
const { response, sendPrompt } = useAI({
  provider: "custom",
  apiUrl: "/api/my-ai-endpoint",
});
```

---

## Examples

### Simple Q&A

```typescript
import { useAI } from "oreacto";
import { useState } from "react";

function QuickAI() {
  const [question, setQuestion] = useState("");
  const { response, loading, error, sendPrompt } = useAI({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
  });

  const handleAsk = async () => {
    if (!question.trim()) return;
    await sendPrompt(question);
    setQuestion("");
  };

  return (
    <div className="ai-qa">
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAsk()}
        placeholder="Ask anything..."
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {error && <div className="error">{error.message}</div>}
      {response && (
        <div className="response">
          <strong>AI:</strong> {response}
        </div>
      )}
    </div>
  );
}
```

### Code Generator

```typescript
import { useAI } from "oreacto";

function CodeGenerator() {
  const { response, loading, sendPrompt } = useAI({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    model: "mixtral-8x7b", // Great for code!
    systemPrompt: "You are an expert programmer. Provide clean, commented code.",
    temperature: 0.3, // Lower for consistent code
  });

  const generateComponent = (description: string) => {
    sendPrompt(`Create a React component: ${description}`);
  };

  return (
    <div>
      <button onClick={() => generateComponent("login form")}>
        Generate Login Form
      </button>
      {loading && <p>Generating...</p>}
      {response && (
        <pre>
          <code>{response}</code>
        </pre>
      )}
    </div>
  );
}
```

### Text Summarizer

```typescript
import { useAI } from "oreacto";
import { useState } from "react";

function TextSummarizer() {
  const [text, setText] = useState("");
  const { response, loading, sendPrompt } = useAI({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    systemPrompt: "Summarize the following text concisely in 2-3 sentences.",
  });

  const summarize = () => {
    sendPrompt(text);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to summarize..."
        rows={10}
      />
      <button onClick={summarize} disabled={loading || !text}>
        Summarize
      </button>
      {response && (
        <div className="summary">
          <h3>Summary:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
```

### Language Translator

```typescript
import { useAI } from "oreacto";
import { useState } from "react";

function Translator() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("Spanish");

  const { response, loading, sendPrompt } = useAI({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
  });

  const translate = () => {
    sendPrompt(`Translate the following to ${language}: "${text}"`);
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option>Spanish</option>
        <option>French</option>
        <option>German</option>
        <option>Japanese</option>
      </select>
      <button onClick={translate} disabled={loading}>
        Translate
      </button>
      {response && <p>{response}</p>}
    </div>
  );
}
```

### With Callbacks

```typescript
import { useAI } from "oreacto";

function AIWithCallbacks() {
  const { sendPrompt } = useAI({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    onSuccess: (response) => {
      console.log("AI responded:", response);
      // Save to database
      saveToHistory(response);
      // Show notification
      toast.success("AI response received!");
    },
    onError: (error) => {
      console.error("AI error:", error);
      toast.error("Failed to get AI response");
    },
  });

  return <button onClick={() => sendPrompt("Hello")}>Send</button>;
}
```

### Runtime Configuration Override

```typescript
import { useAI } from "oreacto";

function DynamicAI() {
  const { sendPrompt } = useAI({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
  });

  const askWithCustomSettings = (prompt: string, temp: number) => {
    sendPrompt(prompt, {
      temperature: temp,
      maxTokens: 500,
      systemPrompt: "Be very concise.",
    });
  };

  return (
    <button onClick={() => askWithCustomSettings("Explain AI", 0.2)}>
      Ask (Low Temperature)
    </button>
  );
}
```

---

## Best Practices

### ✅ Do's

- Use environment variables for API keys
- Provide clear loading states
- Handle errors gracefully
- Set appropriate temperature for your use case
- Use system prompts to guide AI behavior
- Clear previous responses when needed

### ❌ Don'ts

- Never hardcode API keys in code
- Don't ignore error states
- Avoid very high temperatures for factual tasks
- Don't make requests on every keystroke (debounce)
- Don't expose API keys in frontend (use backend proxy in production)

---

## Security

### ⚠️ NEVER expose API keys in frontend!

**For Development:**
```typescript
// .env.local
REACT_APP_GROQ_API_KEY=gsk_your_key

// Component
const { response } = useAI({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
});
```

**For Production:**
Use a backend proxy:
```typescript
// Use custom provider pointing to your backend
const { response } = useAI({
  provider: "custom",
  apiUrl: "/api/ai", // Your secure backend
});
```

---

## Temperature Guide

| Temperature | Best For | Example Use Cases |
|------------|----------|-------------------|
| 0.1 - 0.3  | Factual, consistent | Code generation, math, translation |
| 0.4 - 0.7  | Balanced (default) | Q&A, summarization, general chat |
| 0.8 - 1.0  | Creative, varied | Story writing, brainstorming, poetry |

---

## Model Selection

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| llama-3.1-8b | ⚡⚡⚡ Fast | Good | Quick tasks, high volume |
| llama-3.1-70b | ⚡ Slower | Excellent | Complex reasoning, analysis |
| mixtral-8x7b | ⚡⚡ Fast | Great | Code generation, technical tasks |
| gemma-7b | ⚡⚡ Fast | Good | General purpose, balanced |

---

## TypeScript

Fully typed:

```typescript
import { useAI, type UseAIConfig, type UseAIResult } from "oreacto";

const config: UseAIConfig = {
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
};

const { response, loading, error }: UseAIResult = useAI(config);
```

---

## Related Hooks

- **[useAIChat](./useAIChat.md)** - For multi-turn conversations with history
- **[useAIStream](./useAIStream.md)** - For real-time streaming responses

---

## Complete Setup Guide

**📚 [FREE API Keys Setup Guide](../FREE_AI_SETUP.md)** - Get your free API keys in 2 minutes!

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

