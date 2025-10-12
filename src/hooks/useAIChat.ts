import { useState, useCallback } from "react";
import useAI, { UseAIConfig } from "./useAI";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
};

export type UseAIChatConfig = UseAIConfig & {
  initialMessages?: ChatMessage[];
  maxHistory?: number;
};

export type UseAIChatResult = {
  /** Array of chat messages */
  messages: ChatMessage[];
  /** Whether a request is in progress */
  loading: boolean;
  /** Error object if request failed */
  error: Error | null;
  /** Send a message and get AI response */
  sendMessage: (message: string) => Promise<void>;
  /** Clear all messages */
  clearChat: () => void;
  /** Remove specific message by index */
  removeMessage: (index: number) => void;
  /** Get only user and assistant messages (excluding system) */
  getChatHistory: () => ChatMessage[];
};

/**
 * A powerful hook for building AI chat interfaces with conversation history.
 * Built on top of useAI with conversation management features.
 *
 * @param {UseAIChatConfig} config - Configuration for the AI chat
 * @param {AIProvider} [config.provider='groq'] - AI provider to use
 * @param {AIModel} [config.model='llama-3.1-8b'] - Model to use
 * @param {string} [config.apiKey] - API key for the provider
 * @param {string} [config.systemPrompt] - System prompt for AI behavior
 * @param {ChatMessage[]} [config.initialMessages=[]] - Initial conversation history
 * @param {number} [config.maxHistory=50] - Maximum messages to keep in history
 *
 * @returns {UseAIChatResult} Chat state and control functions
 *
 * @example
 * // Simple chat interface
 * const { messages, loading, sendMessage, clearChat } = useAIChat({
 *   provider: 'groq',
 *   apiKey: 'gsk_...',
 *   systemPrompt: 'You are a helpful assistant.',
 * });
 *
 * await sendMessage('Hello!');
 * // messages now contains user message + AI response
 *
 * @example
 * // Chat with history management
 * const { messages, sendMessage } = useAIChat({
 *   provider: 'groq',
 *   apiKey: process.env.GROQ_API_KEY,
 *   initialMessages: [
 *     { role: 'system', content: 'You are a coding tutor.' },
 *   ],
 *   maxHistory: 20, // Keep last 20 messages
 * });
 *
 * @example
 * // Building a ChatGPT-like interface
 * const ChatInterface = () => {
 *   const [input, setInput] = useState('');
 *   const { messages, loading, sendMessage } = useAIChat({
 *     provider: 'groq',
 *     apiKey: process.env.GROQ_API_KEY,
 *   });
 *
 *   const handleSend = async () => {
 *     if (!input.trim()) return;
 *     await sendMessage(input);
 *     setInput('');
 *   };
 *
 *   return (
 *     <div>
 *       <div className="messages">
 *         {messages.map((msg, i) => (
 *           <div key={i} className={msg.role}>
 *             {msg.content}
 *           </div>
 *         ))}
 *       </div>
 *       <input
 *         value={input}
 *         onChange={(e) => setInput(e.target.value)}
 *         onKeyPress={(e) => e.key === 'Enter' && handleSend()}
 *       />
 *       <button onClick={handleSend} disabled={loading}>
 *         Send
 *       </button>
 *     </div>
 *   );
 * };
 */
const useAIChat = (config: UseAIChatConfig = {}): UseAIChatResult => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    config.initialMessages || []
  );

  const { loading, error, sendPrompt, clear } = useAI({
    ...config,
    onSuccess: (aiResponse) => {
      // Add AI response to messages
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            role: "assistant" as const,
            content: aiResponse,
            timestamp: Date.now(),
          },
        ];

        // Respect maxHistory (keep system messages)
        const maxHistory = config.maxHistory || 50;
        if (newMessages.length > maxHistory) {
          const systemMessages = newMessages.filter((m) => m.role === "system");
          const nonSystemMessages = newMessages.filter((m) => m.role !== "system");
          return [
            ...systemMessages,
            ...nonSystemMessages.slice(-maxHistory),
          ];
        }

        return newMessages;
      });

      if (config.onSuccess) config.onSuccess(aiResponse);
    },
  });

  const sendMessage = useCallback(
    async (message: string) => {
      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Build conversation context
      const conversationHistory = messages
        .filter((m) => m.role !== "system")
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");

      const fullPrompt = conversationHistory
        ? `${conversationHistory}\n\nUser: ${message}`
        : message;

      // Send to AI
      await sendPrompt(fullPrompt);
    },
    [messages, sendPrompt]
  );

  const clearChat = useCallback(() => {
    // Keep only system messages
    setMessages((prev) => prev.filter((m) => m.role === "system"));
    clear();
  }, [clear]);

  const removeMessage = useCallback((index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getChatHistory = useCallback(() => {
    return messages.filter((m) => m.role !== "system");
  }, [messages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    removeMessage,
    getChatHistory,
  };
};

export default useAIChat;

