<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecommendationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RecommendationController extends Controller
{
    public function __construct(
        private RecommendationService $recommendationService,
    ) {}

    /**
     * POST /api/recommendations
     *
     * Body:
     * {
     *   "budget": 20000000,
     *   "use_case": "gaming",
     *   "constraints": {
     *     "preferred_cpu_brand": "Intel",
     *     "min_vram": 8,
     *     "preferred_ram_type": "DDR5",
     *     "preferred_platform": "intel",
     *     "notes": "..."
     *   }
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'budget' => 'required|integer|min:1000000',
            'use_case' => 'nullable|string|in:learning,office,development,gaming,graphics',
            'purpose' => 'nullable|string|in:learning,office,development,gaming,graphics',
            'constraints' => 'nullable|array',
            'constraints.preferred_cpu_brand' => 'nullable|string|max:100',
            'constraints.preferred_vga_brand' => 'nullable|string|max:100',
            'constraints.min_vram' => 'nullable|integer|min:0|max:128',
            'constraints.preferred_ram_type' => 'nullable|string|in:DDR4,DDR5,ddr4,ddr5',
            'constraints.preferred_platform' => 'nullable|string|in:intel,amd,Intel,AMD',
            'constraints.notes' => 'nullable|string|max:1000',
        ]);

        $useCase = $validated['use_case'] ?? $validated['purpose'] ?? null;

        if (!$useCase) {
            return response()->json([
                'status' => 'error',
                'message' => 'Thiếu trường use_case hoặc purpose.',
            ], 422);
        }

        $constraints = $validated['constraints'] ?? [];

        if (!empty($constraints['preferred_ram_type'])) {
            $constraints['preferred_ram_type'] = strtoupper($constraints['preferred_ram_type']);
        }

        if (!empty($constraints['preferred_platform'])) {
            $constraints['preferred_platform'] = strtolower($constraints['preferred_platform']);
        }

        try {
            $recommendation = $this->recommendationService->recommend(
                $useCase,
                $validated['budget'],
                $constraints
            );

            return response()->json([
                'status' => 'success',
                'data' => $recommendation,
            ]);
        } catch (\Throwable $e) {
            Log::error('Recommendation failed', [
                'error' => $e->getMessage(),
                'budget' => $validated['budget'],
                'use_case' => $useCase,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
