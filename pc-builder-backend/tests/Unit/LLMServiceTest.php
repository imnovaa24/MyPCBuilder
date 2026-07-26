<?php

namespace Tests\Unit;

use App\Services\LLMService;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class LLMServiceTest extends TestCase
{
    public function test_gemini_enabled_when_api_key_present(): void
    {
        Config::set('llm.provider', 'gemini');
        Config::set('llm.gemini.api_key', 'test-key');

        $service = new LLMService();

        $this->assertTrue($service->isEnabled());
        $this->assertSame('gemini', $service->getProvider());
    }

    public function test_disabled_when_no_api_key(): void
    {
        Config::set('llm.provider', 'gemini');
        Config::set('llm.gemini.api_key', null);

        $service = new LLMService();

        $this->assertFalse($service->isEnabled());
    }

    public function test_rule_based_provider_not_enabled(): void
    {
        Config::set('llm.provider', 'rule_based');

        $service = new LLMService();

        $this->assertFalse($service->isEnabled());
    }
}
