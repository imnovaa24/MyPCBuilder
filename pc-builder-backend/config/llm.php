<?php

return [
    /*
     * gemini | anthropic | rule_based
     * Tự chọn gemini nếu có GEMINI_API_KEY, anthropic nếu có CLAUDE_API_KEY.
     */
    'provider' => env('LLM_PROVIDER') ?: (
        env('GEMINI_API_KEY') ? 'gemini' : (
            env('CLAUDE_API_KEY') ? 'anthropic' : 'rule_based'
        )
    ),

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-2.0-flash'),
        'max_tokens' => (int) env('GEMINI_MAX_TOKENS', 2000),
        'timeout' => (int) env('GEMINI_TIMEOUT', 30),
    ],

    'anthropic' => [
        'api_key' => env('CLAUDE_API_KEY'),
        'model' => env('CLAUDE_MODEL', 'claude-3-5-sonnet-20241022'),
        'max_tokens' => (int) env('CLAUDE_MAX_TOKENS', 2000),
        'timeout' => (int) env('CLAUDE_TIMEOUT', 30),
    ],

    'cache' => [
        'enabled' => env('ENABLE_LLM_RECOMMENDATION_CACHE', true),
        'ttl' => (int) env('LLM_RECOMMENDATION_CACHE_TTL', 3600),
    ],

    'recommendation' => [
        'top_per_category' => 20, // Cân bằng giữa đa dạng linh kiện và hiệu suất
        'budget_flex_percent' => 5,
        'max_retries' => 3,
    ],
];
