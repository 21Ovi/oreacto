# oreacto Documentation

Complete documentation for all oreacto hooks and features.

---

## 📚 Table of Contents

- [Hook Guides](#-hook-guides)
- [AI Integration](#-ai-integration)
- [Quick Start](#-quick-start)
- [Complete API Reference](#-complete-api-reference)

---

## 🎯 Hook Guides

Comprehensive guides for each hook with examples, best practices, and use cases.

### Core Utility Hooks

| Hook | Description | Guide |
|------|-------------|-------|
| **useRouteTitle** | Generate formatted titles from URL paths | [→ Read Guide](./hooks-guides/useRouteTitle.md) |
| **useSmartOSearch** | Powerful filtering and sorting for lists | [→ Read Guide](./hooks-guides/useSmartOSearch.md) |
| **useInfiniteScroll** | Effortless infinite scrolling | [→ Read Guide](./hooks-guides/useInfiniteScroll.md) |
| **useDynamicFields** | Generate dynamic form fields | [→ Read Guide](./hooks-guides/useDynamicFields.md) |

### AI Hooks 🤖

| Hook | Description | Guide |
|------|-------------|-------|
| **useAI** | Simple AI integration with FREE providers | [→ Read Guide](./hooks-guides/useAI.md) |
| **useAIChat** | Build ChatGPT-like interfaces | [→ Read Guide](./hooks-guides/useAIChat.md) |
| **useAIStream** | Real-time AI streaming (advanced) | [→ Read Guide](./hooks-guides/useAIStream.md) |

---

## 🤖 AI Integration

### Getting Started with AI

1. **[FREE API Keys Setup Guide](./FREE_AI_SETUP.md)** ⭐
   - Get FREE API keys in 2 minutes
   - Groq, Hugging Face, Together AI
   - Step-by-step setup instructions

2. **[Advanced Streaming Guide](./AI_STREAMING_GUIDE.md)**
   - Deep dive into streaming
   - OpenAI & Anthropic examples
   - Multi-step workflows
   - Performance optimization

### Supported FREE AI Providers

- **Groq** (⚡ Fastest) - [console.groq.com](https://console.groq.com)
- **Hugging Face** (🤗 Most models) - [huggingface.co](https://huggingface.co)
- **Together AI** (💪 $25 free credits) - [api.together.xyz](https://api.together.xyz)

---

## 🚀 Quick Start

### Installation

```bash
npm install oreacto
```

### Basic Examples

**Simple AI Integration:**
```typescript
import { useAI } from "oreacto";

const { response, loading, sendPrompt } = useAI({
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
});

await sendPrompt("Explain React hooks");
```

**Chat Interface:**
```typescript
import { useAIChat } from "oreacto";

const { messages, sendMessage } = useAIChat({
  provider: "groq",
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
});

await sendMessage("Hello!");
```

**Infinite Scrolling:**
```typescript
import { useInfiniteScroll } from "oreacto";

const { loader, page } = useInfiniteScroll({
  fetchData: (page) => loadMore(page),
  hasMoreData: true,
});
```

**Smart Search:**
```typescript
import { useSmartOSearch } from "oreacto";

const { filteredItems, query, setQuery } = useSmartOSearch({
  items: users,
  filterKeys: ["name", "email"],
});
```

---

## 📖 Complete API Reference

### useRouteTitle

```typescript
function useRouteTitle(): string
```

Generates formatted page titles from URL paths.

**[→ Full Documentation](./hooks-guides/useRouteTitle.md)**

---

### useSmartOSearch

```typescript
function useSmartOSearch<T>(props: UseSmartOSearchProps<T>): UseSmartOSearchResult<T>
```

Filter and sort lists with multi-field search.

**Props:**
- `items: T[]` - Items to filter
- `filterKeys: (keyof T)[]` - Keys to search
- `searchQuery?: string` - Initial query
- `sortKey?: keyof T` - Sort by key
- `sortOrder?: 'asc' | 'desc'` - Sort direction

**Returns:**
- `filteredItems: T[]` - Filtered results
- `query: string` - Current query
- `setQuery: (query: string) => void` - Update query

**[→ Full Documentation](./hooks-guides/useSmartOSearch.md)**

---

### useInfiniteScroll

```typescript
function useInfiniteScroll(props: UseInfiniteScrollProps): UseInfiniteScrollResult
```

Automatic infinite scrolling with IntersectionObserver.

**Props:**
- `fetchData: (page: number) => void` - Fetch function
- `hasMoreData: boolean` - More data available?

**Returns:**
- `loader: RefObject<HTMLDivElement>` - Ref for trigger element
- `page: number` - Current page
- `setPage: (page: number) => void` - Set page manually

**[→ Full Documentation](./hooks-guides/useInfiniteScroll.md)**

---

### useAsync

```typescript
function useAsync<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  config?: UseAsyncConfig<T>
): UseAsyncResult<T>
```

Complete async state management with retry logic and caching.

**Config:**
- `onSuccess?: (data: T) => void` - Success callback
- `onError?: (error: Error) => void` - Error callback
- `retryCount?: number` - Number of retries (default: 0)
- `retryDelay?: number` - Delay between retries (default: 1000ms)
- `staleTime?: number` - Cache staleness time (default: 0)
- `cacheKey?: string` - Cache key for stale-while-revalidate

**Returns:**
- `data: T | null` - Async result
- `loading: boolean` - Loading state
- `error: Error | null` - Error state
- `success: boolean` - Success state
- `execute: (...args) => Promise<T>` - Execute function
- `retry: () => Promise<T>` - Retry last execution
- `reset: () => void` - Reset state
- `cancel: () => void` - Cancel operation

**[→ Full Documentation](./hooks-guides/useAsync.md)**

---

### useAI

```typescript
function useAI(config: UseAIConfig): UseAIResult
```

Simple AI integration with FREE providers.

**Config:**
- `provider: 'groq' | 'huggingface' | 'together' | 'custom'`
- `apiKey: string` - API key
- `model?: string` - Model name
- `systemPrompt?: string` - System prompt
- `temperature?: number` - Creativity (0-1)
- `maxTokens?: number` - Max response length

**Returns:**
- `response: string | null` - AI response
- `loading: boolean` - Loading state
- `error: Error | null` - Error state
- `sendPrompt: (prompt: string) => Promise<void>` - Send prompt
- `clear: () => void` - Clear response

**[→ Full Documentation](./hooks-guides/useAI.md)**

---

### useAIChat

```typescript
function useAIChat(config: UseAIChatConfig): UseAIChatResult
```

ChatGPT-like interfaces with conversation history.

**Config:** All `useAI` config plus:
- `initialMessages?: ChatMessage[]` - Initial messages
- `maxHistory?: number` - Max messages to keep

**Returns:**
- `messages: ChatMessage[]` - All messages
- `loading: boolean` - Loading state
- `error: Error | null` - Error state
- `sendMessage: (message: string) => Promise<void>` - Send message
- `clearChat: () => void` - Clear chat
- `removeMessage: (index: number) => void` - Remove message
- `getChatHistory: () => ChatMessage[]` - Get history

**[→ Full Documentation](./hooks-guides/useAIChat.md)**

---

### useAIStream

```typescript
function useAIStream(config: AIStreamConfig): UseAIStreamResult
```

Real-time streaming AI responses with token-by-token delivery.

**Config:**
- `url: string` - API endpoint
- `method?: 'POST' | 'GET'` - HTTP method
- `headers?: object` - Custom headers
- `body?: object` - Request body
- `parseChunk?: (chunk: string) => string | null` - Chunk parser
- `onChunk?: (chunk: string) => void` - Chunk callback
- `onComplete?: (text: string) => void` - Complete callback
- `onError?: (error: Error) => void` - Error callback

**Returns:**
- `data: string` - Accumulated text
- `isStreaming: boolean` - Stream active
- `isComplete: boolean` - Stream completed
- `error: Error | null` - Error state
- `startStream: (config?) => Promise<void>` - Start stream
- `abort: () => void` - Abort stream
- `reset: () => void` - Reset state

**[→ Full Documentation](./hooks-guides/useAIStream.md)**

---

## 🎓 Learning Path

### Beginner

1. Start with **useRouteTitle** - Simplest hook
2. Try **useSmartOSearch** - Add search to a list
3. Explore **useAI** - Your first AI integration

### Intermediate

1. Build with **useInfiniteScroll** - Add pagination
2. Create forms with **useDynamicFields**
3. Chat app with **useAIChat**

### Advanced

1. Real-time streaming with **useAIStream**
2. Combine multiple hooks in one app
3. Custom AI backends and configurations

---

## 💡 Examples & Templates

### Complete Applications

Each hook guide includes:
- ✅ Basic usage examples
- ✅ Real-world applications
- ✅ Best practices
- ✅ Common pitfalls
- ✅ TypeScript examples
- ✅ Performance tips

### Code Examples

Find complete, copy-paste ready examples in each hook guide.

---

## 🤝 Contributing

Found an issue or want to contribute?

- [Open an issue](https://github.com/21Ovi/oreacto/issues)
- [Submit a PR](https://github.com/21Ovi/oreacto/pulls)
- [Star the repo](https://github.com/21Ovi/oreacto) ⭐

---

## 📄 License

MIT © [Mohammad Ovesh](https://github.com/21Ovi)

---

## 🔗 Quick Links

- [Main README](../readme.md)
- [npm Package](https://www.npmjs.com/package/oreacto)
- [GitHub Repository](https://github.com/21Ovi/oreacto)
- [Report Issues](https://github.com/21Ovi/oreacto/issues)

---

**Made with ❤️ by the oreacto team**

Need help? Check the individual hook guides above or open an issue!

