import { useState, useCallback, useRef } from "react";

export type AIStreamConfig = {
  url: string;
  method?: "POST" | "GET";
  headers?: Record<string, string>;
  body?: Record<string, any>;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  parseChunk?: (chunk: string) => string | null;
};

export type UseAIStreamResult = {
  /** The accumulated streamed text content */
  data: string;
  /** Whether the stream is currently active */
  isStreaming: boolean;
  /** Error object if streaming failed */
  error: Error | null;
  /** Start streaming with optional runtime config override */
  startStream: (runtimeConfig?: Partial<AIStreamConfig>) => Promise<void>;
  /** Abort the current stream */
  abort: () => void;
  /** Reset the hook state */
  reset: () => void;
  /** Whether the stream has completed successfully */
  isComplete: boolean;
};

/**
 * A powerful hook for handling AI streaming responses from APIs like OpenAI, Anthropic, or custom endpoints.
 *
 * @param {AIStreamConfig} config - Configuration object for the stream
 * @param {string} config.url - The API endpoint URL
 * @param {string} [config.method='POST'] - HTTP method (default: POST)
 * @param {Record<string, string>} [config.headers] - Custom headers for the request
 * @param {Record<string, any>} [config.body] - Request body (can be overridden at runtime)
 * @param {function} [config.onChunk] - Callback fired for each chunk received
 * @param {function} [config.onComplete] - Callback fired when stream completes
 * @param {function} [config.onError] - Callback fired on error
 * @param {function} [config.parseChunk] - Custom chunk parser (return null to skip chunk)
 *
 * @returns {UseAIStreamResult} Stream state and control functions
 *
 * @example
 * // Basic OpenAI-style streaming
 * const { data, isStreaming, startStream, abort } = useAIStream({
 *   url: 'https://api.openai.com/v1/chat/completions',
 *   headers: {
 *     'Authorization': `Bearer ${API_KEY}`,
 *     'Content-Type': 'application/json',
 *   },
 *   body: {
 *     model: 'gpt-4',
 *     stream: true,
 *     messages: [{ role: 'user', content: 'Hello!' }],
 *   },
 *   parseChunk: (chunk) => {
 *     // Parse OpenAI SSE format
 *     if (chunk.startsWith('data: ')) {
 *       const data = chunk.slice(6);
 *       if (data === '[DONE]') return null;
 *       try {
 *         const json = JSON.parse(data);
 *         return json.choices?.[0]?.delta?.content || null;
 *       } catch {
 *         return null;
 *       }
 *     }
 *     return null;
 *   },
 * });
 *
 * @example
 * // Simple text streaming
 * const { data, isStreaming, startStream } = useAIStream({
 *   url: '/api/stream',
 *   body: { prompt: 'Tell me a story' },
 * });
 *
 * // Start streaming with runtime override
 * await startStream({ body: { prompt: 'Different prompt' } });
 *
 * @example
 * // With callbacks for side effects
 * const { data, isStreaming } = useAIStream({
 *   url: '/api/ai',
 *   onChunk: (chunk) => console.log('Received:', chunk),
 *   onComplete: (fullText) => saveToDatabase(fullText),
 *   onError: (error) => showNotification(error.message),
 * });
 */
const useAIStream = (config: AIStreamConfig): UseAIStreamResult => {
  const [data, setData] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const accumulatedTextRef = useRef<string>("");

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    abort();
    setData("");
    setError(null);
    setIsComplete(false);
    accumulatedTextRef.current = "";
  }, [abort]);

  const startStream = useCallback(
    async (runtimeConfig?: Partial<AIStreamConfig>) => {
      // Merge runtime config with base config
      const mergedConfig = {
        ...config,
        ...runtimeConfig,
        headers: { ...config.headers, ...runtimeConfig?.headers },
        body: { ...config.body, ...runtimeConfig?.body },
      };

      // Reset state
      setData("");
      setError(null);
      setIsStreaming(true);
      setIsComplete(false);
      accumulatedTextRef.current = "";

      // Create new AbortController
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(mergedConfig.url, {
          method: mergedConfig.method || "POST",
          headers: mergedConfig.headers,
          body: mergedConfig.body ? JSON.stringify(mergedConfig.body) : undefined,
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable");
        }

        const decoder = new TextDecoder();

        // Read stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setIsComplete(true);
            setIsStreaming(false);
            if (mergedConfig.onComplete) {
              mergedConfig.onComplete(accumulatedTextRef.current);
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });

          // Parse chunk if custom parser provided
          let processedChunk = chunk;
          if (mergedConfig.parseChunk) {
            const parsed = mergedConfig.parseChunk(chunk);
            if (parsed === null) continue; // Skip this chunk
            processedChunk = parsed;
          }

          // Update accumulated text
          accumulatedTextRef.current += processedChunk;
          setData(accumulatedTextRef.current);

          // Call chunk callback
          if (mergedConfig.onChunk) {
            mergedConfig.onChunk(processedChunk);
          }
        }
      } catch (err: any) {
        // Don't set error if it was an abort
        if (err.name !== "AbortError") {
          const errorObj = err instanceof Error ? err : new Error(String(err));
          setError(errorObj);
          setIsStreaming(false);
          if (mergedConfig.onError) {
            mergedConfig.onError(errorObj);
          }
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [config]
  );

  return {
    data,
    isStreaming,
    error,
    startStream,
    abort,
    reset,
    isComplete,
  };
};

export default useAIStream;

