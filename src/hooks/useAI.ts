import { useState, useCallback } from "react";

export type AIProvider = "groq" | "huggingface" | "together" | "custom";

export type AIModel =
  | "llama-3.1-8b"
  | "llama-3.1-70b"
  | "mixtral-8x7b"
  | "gemma-7b"
  | string;

export type UseAIConfig = {
  provider?: AIProvider;
  model?: AIModel;
  apiKey?: string;
  apiUrl?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  onSuccess?: (response: string) => void;
  onError?: (error: Error) => void;
};

export type UseAIResult = {
  /** The AI response */
  response: string | null;
  /** Whether the request is in progress */
  loading: boolean;
  /** Error object if request failed */
  error: Error | null;
  /** Send a prompt to the AI */
  sendPrompt: (prompt: string, config?: Partial<UseAIConfig>) => Promise<void>;
  /** Clear the response */
  clear: () => void;
};

// Provider configurations
const PROVIDER_CONFIGS: Record<
  Exclude<AIProvider, "custom">,
  {
    url: string;
    models: Record<string, string>;
    formatRequest: (prompt: string, config: UseAIConfig) => any;
    parseResponse: (data: any) => string;
  }
> = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    models: {
      "llama-3.1-8b": "llama-3.1-8b-instant",
      "llama-3.1-70b": "llama-3.1-70b-versatile",
      "mixtral-8x7b": "mixtral-8x7b-32768",
      "gemma-7b": "gemma-7b-it",
    },
    formatRequest: (prompt: string, config: UseAIConfig) => ({
      model: PROVIDER_CONFIGS.groq.models[config.model || "llama-3.1-8b"],
      messages: [
        ...(config.systemPrompt
          ? [{ role: "system", content: config.systemPrompt }]
          : []),
        { role: "user", content: prompt },
      ],
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1024,
    }),
    parseResponse: (data: any) => data.choices?.[0]?.message?.content || "",
  },
  huggingface: {
    url: "https://api-inference.huggingface.co/models/",
    models: {
      "llama-3.1-8b": "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "mixtral-8x7b": "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "gemma-7b": "google/gemma-7b-it",
    },
    formatRequest: (prompt: string, config: UseAIConfig) => ({
      inputs: config.systemPrompt
        ? `${config.systemPrompt}\n\nUser: ${prompt}`
        : prompt,
      parameters: {
        temperature: config.temperature ?? 0.7,
        max_new_tokens: config.maxTokens ?? 1024,
      },
    }),
    parseResponse: (data: any) =>
      Array.isArray(data) ? data[0]?.generated_text || "" : data.generated_text || "",
  },
  together: {
    url: "https://api.together.xyz/v1/chat/completions",
    models: {
      "llama-3.1-8b": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      "llama-3.1-70b": "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      "mixtral-8x7b": "mistralai/Mixtral-8x7B-Instruct-v0.1",
    },
    formatRequest: (prompt: string, config: UseAIConfig) => ({
      model: PROVIDER_CONFIGS.together.models[config.model || "llama-3.1-8b"],
      messages: [
        ...(config.systemPrompt
          ? [{ role: "system", content: config.systemPrompt }]
          : []),
        { role: "user", content: prompt },
      ],
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1024,
    }),
    parseResponse: (data: any) => data.choices?.[0]?.message?.content || "",
  },
};

/**
 * A simple hook for making AI requests with a prompt and getting a response.
 * Supports multiple FREE AI providers out of the box!
 *
 * @param {UseAIConfig} config - Configuration for the AI provider
 * @param {AIProvider} [config.provider='groq'] - AI provider to use (groq, huggingface, together, custom)
 * @param {AIModel} [config.model='llama-3.1-8b'] - Model to use
 * @param {string} [config.apiKey] - API key for the provider (required for most providers)
 * @param {string} [config.apiUrl] - Custom API URL (for custom provider)
 * @param {string} [config.systemPrompt] - System prompt to set AI behavior
 * @param {number} [config.temperature=0.7] - Creativity level (0-1)
 * @param {number} [config.maxTokens=1024] - Maximum response length
 * @param {function} [config.onSuccess] - Callback on successful response
 * @param {function} [config.onError] - Callback on error
 *
 * @returns {UseAIResult} AI state and control functions
 *
 * @example
 * // Using Groq (FREE - Get API key from https://console.groq.com)
 * const { response, loading, sendPrompt } = useAI({
 *   provider: 'groq',
 *   apiKey: 'gsk_...',
 * });
 *
 * await sendPrompt('Explain React hooks in simple terms');
 * console.log(response); // AI's response
 *
 * @example
 * // Using Hugging Face (FREE - Get token from https://huggingface.co/settings/tokens)
 * const { response, loading, sendPrompt } = useAI({
 *   provider: 'huggingface',
 *   apiKey: 'hf_...',
 *   model: 'mixtral-8x7b',
 * });
 *
 * @example
 * // With system prompt for specific behavior
 * const { response, sendPrompt } = useAI({
 *   provider: 'groq',
 *   apiKey: process.env.GROQ_API_KEY,
 *   systemPrompt: 'You are a helpful coding assistant. Always provide code examples.',
 *   temperature: 0.3, // More focused responses
 * });
 *
 * @example
 * // Custom provider/endpoint
 * const { response, sendPrompt } = useAI({
 *   provider: 'custom',
 *   apiUrl: '/api/my-ai',
 *   onSuccess: (response) => console.log('Got response:', response),
 *   onError: (error) => alert(error.message),
 * });
 */
const useAI = (config: UseAIConfig = {}): UseAIResult => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const clear = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  const sendPrompt = useCallback(
    async (prompt: string, runtimeConfig?: Partial<UseAIConfig>) => {
      const mergedConfig = { ...config, ...runtimeConfig };
      const provider = mergedConfig.provider || "groq";

      setLoading(true);
      setError(null);

      try {
        if (provider === "custom") {
          // Custom provider - simple fetch
          if (!mergedConfig.apiUrl) {
            throw new Error("apiUrl is required for custom provider");
          }

          const response = await fetch(mergedConfig.apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(mergedConfig.apiKey && {
                Authorization: `Bearer ${mergedConfig.apiKey}`,
              }),
            },
            body: JSON.stringify({
              prompt,
              systemPrompt: mergedConfig.systemPrompt,
              temperature: mergedConfig.temperature,
              maxTokens: mergedConfig.maxTokens,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const text = data.response || data.text || data.content || "";
          setResponse(text);
          if (mergedConfig.onSuccess) mergedConfig.onSuccess(text);
        } else {
          // Built-in provider
          const providerConfig = PROVIDER_CONFIGS[provider];
          if (!providerConfig) {
            throw new Error(`Unknown provider: ${provider}`);
          }

          if (!mergedConfig.apiKey) {
            throw new Error(`API key is required for ${provider} provider`);
          }

          // Build request
          const requestBody = providerConfig.formatRequest(prompt, mergedConfig);
          
          // Determine URL
          let url = providerConfig.url;
          if (provider === "huggingface") {
            const modelPath =
              providerConfig.models[mergedConfig.model || "llama-3.1-8b"];
            url = `${url}${modelPath}`;
          }

          // Make request
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${mergedConfig.apiKey}`,
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error?.message ||
                errorData.message ||
                `HTTP error! status: ${response.status}`
            );
          }

          const data = await response.json();
          const text = providerConfig.parseResponse(data);
          setResponse(text);
          if (mergedConfig.onSuccess) mergedConfig.onSuccess(text);
        }
      } catch (err: any) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        if (mergedConfig.onError) mergedConfig.onError(errorObj);
      } finally {
        setLoading(false);
      }
    },
    [config]
  );

  return {
    response,
    loading,
    error,
    sendPrompt,
    clear,
  };
};

export default useAI;

