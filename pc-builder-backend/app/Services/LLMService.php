<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class LLMService
{
    public function recommend(string $prompt, array $params): array
    {
        if (!$this->isEnabled()) {
            throw new RuntimeException('LLM provider is not configured.');
        }

        $cacheKey = $this->cacheKey($params);

        if (config('llm.cache.enabled') && Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $response = $this->callWithRetry($prompt, config('llm.recommendation.max_retries', 3));
        $parsed = $this->parseResponse($response);

        if (config('llm.cache.enabled')) {
            Cache::put($cacheKey, $parsed, config('llm.cache.ttl', 3600));
        }

        return $parsed;
    }

    public function isEnabled(): bool
    {
        $provider = $this->getProvider();

        return match ($provider) {
            'gemini' => !empty(config('llm.gemini.api_key')),
            'anthropic' => !empty(config('llm.anthropic.api_key')),
            default => false,
        };
    }

    public function getProvider(): string
    {
        return config('llm.provider', 'rule_based');
    }

    private function callWithRetry(string $prompt, int $maxRetries): array
    {
        $lastException = null;

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                return match ($this->getProvider()) {
                    'gemini' => $this->callGemini($prompt),
                    'anthropic' => $this->callAnthropic($prompt),
                    default => throw new RuntimeException('Unsupported LLM provider.'),
                };
            } catch (\Throwable $e) {
                $lastException = $e;
                Log::warning("LLM API attempt {$attempt} failed ({$this->getProvider()})", [
                    'error' => $e->getMessage(),
                ]);

                if ($attempt < $maxRetries) {
                    sleep(2 ** ($attempt - 1));
                }
            }
        }

        throw new RuntimeException(
            'LLM API failed after retries: ' . ($lastException?->getMessage() ?? 'unknown error')
        );
    }

    private function callGemini(string $prompt): array
    {
        $model = config('llm.gemini.model');
        $apiKey = config('llm.gemini.api_key');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        $response = Http::withQueryParameters(['key' => $apiKey])
            ->timeout(config('llm.gemini.timeout', 30))
            ->post($url, [
                'contents' => [[
                    'parts' => [[
                        'text' => $prompt,
                    ]],
                ]],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => config('llm.gemini.max_tokens', 2000),
                    'responseMimeType' => 'application/json',
                ],
            ]);

        if (!$response->successful()) {
            throw new RuntimeException(
                'Gemini API error: ' . $response->status() . ' ' . $response->body()
            );
        }

        return $response->json();
    }

    private function callAnthropic(string $prompt): array
    {
        $response = Http::withHeaders([
            'x-api-key' => config('llm.anthropic.api_key'),
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])
            ->timeout(config('llm.anthropic.timeout', 30))
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => config('llm.anthropic.model'),
                'max_tokens' => config('llm.anthropic.max_tokens', 2000),
                'temperature' => 0.4,
                'messages' => [[
                    'role' => 'user',
                    'content' => $prompt,
                ]],
            ]);

        if (!$response->successful()) {
            throw new RuntimeException(
                'Claude API error: ' . $response->status() . ' ' . $response->body()
            );
        }

        return $response->json();
    }

    private function parseResponse(array $response): array
    {
        $text = match ($this->getProvider()) {
            'gemini' => $response['candidates'][0]['content']['parts'][0]['text'] ?? null,
            'anthropic' => $response['content'][0]['text'] ?? null,
            default => null,
        };

        if (!$text) {
            throw new RuntimeException('Invalid LLM response format.');
        }

        $text = trim($text);

        // Gemini JSON mode may return raw JSON; Anthropic may wrap in markdown.
        if (str_starts_with($text, '{')) {
            $parsed = json_decode($text, true);
        } else {
            if (!preg_match('/\{[\s\S]*\}/', $text, $matches)) {
                throw new RuntimeException('No JSON found in LLM response.');
            }
            $parsed = json_decode($matches[0], true);
        }

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($parsed)) {
            throw new RuntimeException('Invalid JSON in LLM response: ' . json_last_error_msg());
        }

        return $this->normalizeKeys($parsed);
    }

    private function normalizeKeys(array $payload): array
    {
        if (isset($payload['gpu']) && !isset($payload['vga'])) {
            $payload['vga'] = $payload['gpu'];
            unset($payload['gpu']);
        }

        return $payload;
    }

    private function cacheKey(array $params): string
    {
        return 'llm_recommendation:' . $this->getProvider() . ':' . md5(json_encode([
            $params['use_case'] ?? '',
            $params['budget'] ?? 0,
            $params['constraints'] ?? [],
        ]));
    }
}
