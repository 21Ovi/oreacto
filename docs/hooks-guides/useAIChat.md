# useAIChat

Build ChatGPT-like interfaces with automatic conversation history management.

---

## Overview

`useAIChat` extends `useAI` with conversation management, making it perfect for building chat interfaces, AI assistants, and multi-turn dialogues. It automatically tracks message history and context.

**Key Features:**
- 💬 Automatic conversation history
- 🔄 Multi-turn context awareness
- 📝 Message management (add, remove, clear)
- ⚙️ Configurable history limits
- 🆓 Works with FREE AI providers
- 🎯 System prompts for AI personality

---

## Installation

```bash
npm install oreacto
```

**Get your FREE API key:** [Setup Guide](../FREE_AI_SETUP.md)

---

## Basic Usage

```typescript
import { useAIChat } from "oreacto";
import { useState } from "react";

function ChatInterface() {
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
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
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend} disabled={loading}>
        Send
      </button>
    </div>
  );
}
```

---

## API Reference

```typescript
function useAIChat(config: UseAIChatConfig): UseAIChatResult
```

### Parameters

All parameters from [`useAI`](./useAI.md) plus:

| Parameter         | Type              | Default | Description                          |
| ----------------- | ----------------- | ------- | ------------------------------------ |
| `initialMessages` | `ChatMessage[]`   | `[]`    | Initial conversation history         |
| `maxHistory`      | `number`          | `50`    | Maximum messages to keep in history  |

### Returns

| Property         | Type                                | Description                          |
| ---------------- | ----------------------------------- | ------------------------------------ |
| `messages`       | `ChatMessage[]`                     | Array of all chat messages           |
| `loading`        | `boolean`                           | Whether request is in progress       |
| `error`          | `Error \| null`                     | Error object if request failed       |
| `sendMessage`    | `(message: string) => Promise<void>` | Send a message and get AI response   |
| `clearChat`      | `() => void`                        | Clear all messages (keep system)     |
| `removeMessage`  | `(index: number) => void`           | Remove specific message              |
| `getChatHistory` | `() => ChatMessage[]`               | Get user/assistant messages only     |

### ChatMessage Type

```typescript
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}
```

---

## Examples

### Complete Chat Application

```typescript
import { useAIChat } from "oreacto";
import { useState } from "react";

function ChatApp() {
  const [input, setInput] = useState("");

  const { messages, loading, error, sendMessage, clearChat } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    systemPrompt: "You are a helpful and friendly assistant.",
    maxHistory: 30,
  });

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-container">
      <header>
        <h1>AI Chat</h1>
        <button onClick={clearChat}>Clear Chat</button>
      </header>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="avatar">
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="content">
              <strong>{msg.role === "user" ? "You" : "AI"}</strong>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="typing-indicator">AI is typing...</div>
          </div>
        )}
      </div>

      {error && <div className="error">{error.message}</div>}

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
```

### Coding Assistant

```typescript
import { useAIChat } from "oreacto";
import { useState } from "react";

function CodingAssistant() {
  const [input, setInput] = useState("");

  const { messages, loading, sendMessage } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    model: "mixtral-8x7b", // Great for code
    systemPrompt:
      "You are an expert programming assistant. Provide code examples with explanations.",
    temperature: 0.3,
  });

  return (
    <div className="coding-assistant">
      <div className="chat-history">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-${msg.role}`}>
            {msg.role === "assistant" && msg.content.includes("```") ? (
              <CodeBlock content={msg.content} />
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about code..."
          rows={3}
        />
        <button onClick={() => sendMessage(input).then(() => setInput(""))}>
          Ask
        </button>
      </div>
    </div>
  );
}
```

### Customer Support Bot

```typescript
import { useAIChat } from "oreacto";
import { useState } from "react";

function SupportBot() {
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");

  const { messages, loading, sendMessage, clearChat } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    systemPrompt: `You are a customer support agent for TechCo. 
    Be helpful, professional, and concise. 
    If you can't help, suggest contacting human support.`,
    initialMessages: [
      {
        role: "assistant",
        content: "Hello! How can I help you today?",
      },
    ],
  });

  const quickReplies = [
    "Track my order",
    "Return policy",
    "Technical issue",
    "Billing question",
  ];

  return (
    <>
      <button
        className="chat-toggle"
        onClick={() => setShowChat(!showChat)}
      >
        💬 Support
      </button>

      {showChat && (
        <div className="chat-widget">
          <header>
            <h3>Customer Support</h3>
            <button onClick={() => setShowChat(false)}>✕</button>
          </header>

          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>

          <div className="quick-replies">
            {quickReplies.map((reply) => (
              <button key={reply} onClick={() => sendMessage(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <div className="input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                sendMessage(input).then(() => setInput(""))
              }
              placeholder="Type your question..."
            />
            <button
              onClick={() => sendMessage(input).then(() => setInput(""))}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

### Educational Tutor

```typescript
import { useAIChat } from "oreacto";

function TutorApp() {
  const [subject, setSubject] = useState("Math");

  const { messages, sendMessage, clearChat } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    systemPrompt: `You are a patient tutor teaching ${subject}. 
    Explain concepts clearly with examples. 
    Encourage questions and provide step-by-step guidance.`,
  });

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    clearChat();
  };

  return (
    <div>
      <select
        value={subject}
        onChange={(e) => handleSubjectChange(e.target.value)}
      >
        <option>Math</option>
        <option>Science</option>
        <option>History</option>
        <option>Programming</option>
      </select>

      {/* Chat interface */}
    </div>
  );
}
```

### With Message Editing

```typescript
import { useAIChat } from "oreacto";
import { useState } from "react";

function EditableChat() {
  const { messages, sendMessage, removeMessage } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
  });

  const handleRegenerate = async (index: number) => {
    // Remove AI response and user message
    removeMessage(index); // AI message
    removeMessage(index - 1); // User message

    // Resend the user's message
    const userMessage = messages[index - 1];
    if (userMessage) {
      await sendMessage(userMessage.content);
    }
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          <p>{msg.content}</p>
          {msg.role === "assistant" && (
            <button onClick={() => handleRegenerate(i)}>🔄 Regenerate</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Conversation Export

```typescript
import { useAIChat } from "oreacto";

function ExportableChat() {
  const { messages, getChatHistory, sendMessage } = useAIChat({
    provider: "groq",
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
  });

  const exportChat = () => {
    const history = getChatHistory(); // Excludes system messages
    const text = history
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${Date.now()}.txt`;
    a.click();
  };

  const saveToDatabase = async () => {
    const history = getChatHistory();
    await fetch("/api/save-conversation", {
      method: "POST",
      body: JSON.stringify({ messages: history }),
    });
  };

  return (
    <div>
      {/* Chat interface */}
      <button onClick={exportChat}>📥 Export Chat</button>
      <button onClick={saveToDatabase}>💾 Save Conversation</button>
    </div>
  );
}
```

---

## Best Practices

### ✅ Do's

- Set appropriate `maxHistory` to control context length
- Use system prompts to define AI personality
- Provide visual feedback during loading
- Handle errors gracefully
- Clear chat when changing contexts/topics
- Save important conversations

### ❌ Don'ts

- Don't let history grow infinitely (use `maxHistory`)
- Avoid sending empty messages
- Don't ignore error states
- Avoid very long messages (split them)
- Don't forget to clear sensitive conversations

---

## Context Management

### Setting Max History

```typescript
const { messages } = useAIChat({
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  maxHistory: 20, // Keeps last 20 messages
});
```

System messages are preserved regardless of `maxHistory`.

### Initial Context

```typescript
const { messages } = useAIChat({
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  initialMessages: [
    {
      role: "system",
      content: "You are a helpful assistant",
    },
    {
      role: "assistant",
      content: "Hello! How can I help you?",
    },
  ],
});
```

---

## Styling Tips

### Message Alignment

```css
.message.user {
  align-self: flex-end;
  background: #007bff;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background: #f1f1f1;
  color: black;
}
```

### Auto-scroll to Bottom

```typescript
import { useEffect, useRef } from "react";

function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useAIChat({...});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map(/* ... */)}
      <div ref={messagesEndRef} />
    </div>
  );
}
```

---

## TypeScript

Fully typed:

```typescript
import { useAIChat, type ChatMessage, type UseAIChatConfig } from "oreacto";

const config: UseAIChatConfig = {
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  maxHistory: 30,
};

const {
  messages,
  sendMessage,
  clearChat,
}: UseAIChatResult = useAIChat(config);

// ChatMessage type available for custom components
const renderMessage = (msg: ChatMessage) => {
  return <div>{msg.content}</div>;
};
```

---

## Performance

### Optimize Re-renders

```typescript
import { memo } from "react";

const Message = memo(({ content, role }: ChatMessage) => (
  <div className={role}>{content}</div>
));

// In your component
{messages.map((msg, i) => <Message key={i} {...msg} />)}
```

### Lazy Load Old Messages

For very long chats, consider pagination or virtualization.

---

## Related Hooks

- **[useAI](./useAI.md)** - For simple prompt → response (no history)
- **[useAIStream](./useAIStream.md)** - For real-time streaming responses

---

## Complete Guides

- **[useAI Guide](./useAI.md)** - Simple AI integration
- **[FREE API Keys Setup](../FREE_AI_SETUP.md)** - Get your free keys
- **[Advanced Streaming Guide](../AI_STREAMING_GUIDE.md)** - Advanced streaming examples

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

