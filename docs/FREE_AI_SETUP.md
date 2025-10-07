# 🆓 FREE AI API Keys Setup Guide

Get started with **FREE** AI in your React apps! This guide shows you how to get API keys from the best free AI providers.

---

## ⚡ Groq (RECOMMENDED - Fastest!)

**Why Groq?** Ultra-fast inference, generous free tier, easy to use.

### Getting Your Free API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google/GitHub (takes 30 seconds)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy your key (starts with `gsk_...`)

### Usage in oreacto

```typescript
import { useAI } from "oreacto";

const { response, loading, sendPrompt } = useAI({
  provider: "groq",
  apiKey: "gsk_your_api_key_here",
  model: "llama-3.1-8b", // or "llama-3.1-70b" for more powerful
});

await sendPrompt("Write a React component");
```

### Available Models

- `llama-3.1-8b` - Fast, great for most tasks
- `llama-3.1-70b` - More powerful, better reasoning
- `mixtral-8x7b` - Excellent for code generation
- `gemma-7b` - Good balance of speed and quality

### Free Tier Limits

- **Generous free tier** with no credit card required
- Rate limits are reasonable for development and small apps
- Perfect for prototyping and learning

---

## 🤗 Hugging Face (Most Models!)

**Why Hugging Face?** Access to 1000s of open-source models, completely free.

### Getting Your Free Token

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up (free account)
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Click **New token**
5. Name it (e.g., "oreacto-app")
6. Select **Read** role
7. Copy your token (starts with `hf_...`)

### Usage in oreacto

```typescript
import { useAI } from "oreacto";

const { response, loading, sendPrompt } = useAI({
  provider: "huggingface",
  apiKey: "hf_your_token_here",
  model: "mixtral-8x7b",
});

await sendPrompt("Explain quantum computing simply");
```

### Available Models

- `llama-3.1-8b` - Meta's Llama 3.1
- `mixtral-8x7b` - Mixtral by Mistral AI
- `gemma-7b` - Google's Gemma

### Free Tier Limits

- **Completely free** for inference API
- Rate limits may apply during high traffic
- Models may take a few seconds to "warm up" first time

---

## 💪 Together AI (Powerful!)

**Why Together?** High-quality models, fast inference, generous free credits.

### Getting Your Free API Key

1. Go to [api.together.xyz](https://api.together.xyz)
2. Sign up with email/GitHub
3. You get **$25 free credits** on signup!
4. Go to **Settings > API Keys**
5. Copy your API key

### Usage in oreacto

```typescript
import { useAI } from "oreacto";

const { response, loading, sendPrompt } = useAI({
  provider: "together",
  apiKey: "your_together_api_key",
  model: "llama-3.1-70b",
});

await sendPrompt("Generate a business plan for a SaaS");
```

### Available Models

- `llama-3.1-8b` - Fast and efficient
- `llama-3.1-70b` - Most powerful
- `mixtral-8x7b` - Great for coding

### Free Tier

- **$25 free credits** on signup
- No credit card required
- Credits last a long time for development

---

## 🚀 Quick Start Examples

### Simple Q&A App

```typescript
import { useState } from "react";
import { useAI } from "oreacto";

function QuickAI() {
  const [question, setQuestion] = useState("");
  const { response, loading, sendPrompt } = useAI({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
  });

  const handleAsk = async () => {
    await sendPrompt(question);
  };

  return (
    <div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything..."
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {response && (
        <div className="response">
          <strong>AI:</strong> {response}
        </div>
      )}
    </div>
  );
}
```

### Chat Interface

```typescript
import { useState } from "react";
import { useAIChat } from "oreacto";

function ChatApp() {
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    systemPrompt: "You are a helpful assistant.",
  });

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !loading) {
              sendMessage(input);
              setInput("");
            }
          }}
          placeholder="Type a message..."
        />
        <button
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
          disabled={loading}
        >
          Send
        </button>
      </div>
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
    systemPrompt:
      "You are an expert programmer. Always provide clean, well-commented code.",
    temperature: 0.3, // Lower for more consistent code
  });

  const generateCode = (description: string) => {
    sendPrompt(`Create a React component: ${description}`);
  };

  return (
    <div>
      <button onClick={() => generateCode("login form with validation")}>
        Generate Login Form
      </button>
      {loading && <p>Generating code...</p>}
      {response && (
        <pre>
          <code>{response}</code>
        </pre>
      )}
    </div>
  );
}
```

---

## 🔐 Security Best Practices

### ⚠️ NEVER expose API keys in frontend code!

❌ **BAD:**

```typescript
const { response } = useAI({
  provider: "groq",
  apiKey: "gsk_abc123...", // NEVER hardcode keys!
});
```

✅ **GOOD:**

```typescript
// Use environment variables
const { response } = useAI({
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
});
```

### Setting up Environment Variables

**Create `.env.local` file:**

```bash
REACT_APP_GROQ_API_KEY=gsk_your_key_here
REACT_APP_HF_TOKEN=hf_your_token_here
```

**Add to `.gitignore`:**

```
.env.local
.env
```

### Even Better: Use a Backend Proxy

For production apps, create a backend endpoint:

```typescript
// Backend (Node.js/Express)
app.post("/api/ai", async (req, res) => {
  const { prompt } = req.body;
  // Your API key stays on the server!
  const response = await fetch("https://api.groq.com/...", {
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    // ...
  });
  res.json(response);
});

// Frontend
const { response } = useAI({
  provider: "custom",
  apiUrl: "/api/ai", // Your backend
});
```

---

## 💡 Pro Tips

### 1. **Start with Groq**

Groq is the fastest and easiest to get started with. Perfect for prototyping!

### 2. **Use System Prompts**

Guide the AI's behavior with system prompts:

```typescript
useAI({
  systemPrompt: "You are a professional code reviewer. Be concise and helpful.",
});
```

### 3. **Adjust Temperature**

- **Low (0.1-0.3)**: Consistent, factual responses (good for code, math)
- **Medium (0.5-0.7)**: Balanced (default)
- **High (0.8-1.0)**: Creative, varied responses (good for stories, ideas)

### 4. **Choose the Right Model**

- **Quick tasks**: `llama-3.1-8b`
- **Complex reasoning**: `llama-3.1-70b`
- **Code generation**: `mixtral-8x7b`

### 5. **Handle Errors Gracefully**

```typescript
const { error, sendPrompt } = useAI({
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  onError: (err) => {
    console.error("AI Error:", err);
    toast.error("Something went wrong. Please try again.");
  },
});
```

---

## 🆚 Provider Comparison

| Provider       | Speed        | Free Tier   | Models         | Best For             |
| -------------- | ------------ | ----------- | -------------- | -------------------- |
| **Groq**       | ⚡⚡⚡ Fastest | Generous    | 4 great models | Production apps      |
| **Hugging**    | 🐢 Slower    | Unlimited   | 1000s models   | Experimentation      |
| **Together AI** | ⚡⚡ Fast     | $25 credits | Premium models | High-quality outputs |

---

## 📚 Next Steps

1. **Choose a provider** (recommend starting with Groq)
2. **Get your API key** (takes 2 minutes)
3. **Install oreacto**: `npm install oreacto`
4. **Build something cool!** 🚀

### Need Help?

- Check the [main README](./readme.md) for more examples
- Open an [issue](https://github.com/21Ovi/oreacto/issues) if you get stuck
- Star the repo ⭐ if you find it helpful!

---

**Made with ❤️ by the oreacto team**

Happy building! 🎉

