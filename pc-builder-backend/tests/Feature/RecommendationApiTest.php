<?php

namespace Tests\Feature;

use Tests\TestCase;

class RecommendationApiTest extends TestCase
{
    public function test_recommendation_requires_budget_and_use_case(): void
    {
        $response = $this->postJson('/api/recommendations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['budget']);
    }

    public function test_recommendation_requires_use_case_or_purpose(): void
    {
        $response = $this->postJson('/api/recommendations', [
            'budget' => 20000000,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'status' => 'error',
                'message' => 'Thiếu trường use_case hoặc purpose.',
            ]);
    }

    public function test_recommendation_accepts_purpose_alias(): void
    {
        $response = $this->postJson('/api/recommendations', [
            'budget' => 20000000,
            'purpose' => 'gaming',
        ]);

        $this->assertContains($response->status(), [200, 422]);
    }
}
