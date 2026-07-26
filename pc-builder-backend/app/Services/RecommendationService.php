<?php

namespace App\Services;

use App\Http\Controllers\Api\CompatibilityController;
use App\Models\Component;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class RecommendationService
{
    public function __construct(
        private ScoringService $scoringService,
        private LLMService $llmService,
        private CompatibilityController $compatibilityController,
    ) {}

    public function recommend(string $useCase, int $budget, ?array $constraints = null): array
    {
        $scoredByCategory = $this->scoringService->getScoredComponentsByCategory($useCase, $constraints);

        if ($this->llmService->isEnabled()) {
            try {
                $prompt = $this->buildPrompt($useCase, $budget, $scoredByCategory, $constraints);
                $llmResult = $this->llmService->recommend($prompt, [
                    'use_case' => $useCase,
                    'budget' => $budget,
                    'constraints' => $constraints ?? [],
                ]);

                return $this->finalizeRecommendation(
                    $this->extractComponentIds($llmResult),
                    $budget,
                    $useCase,
                    $llmResult['overall_reasoning'] ?? ($llmResult['reasoning'] ?? null),
                    $llmResult['highlights'] ?? [],
                    $this->llmService->getProvider()
                );
            } catch (\Throwable $e) {
                Log::warning('LLM recommendation failed, falling back to rule-based engine', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $ruleBasedIds = $this->buildRuleBasedRecommendation($scoredByCategory, $budget, $useCase);

        return $this->finalizeRecommendation(
            $ruleBasedIds,
            $budget,
            $useCase,
            'Cấu hình được chọn bằng thuật toán rule-based dựa trên điểm phù hợp và ràng buộc tương thích.',
            [],
            'rule_based'
        );
    }

    /**
     * @param array<string, Collection<int, array{component: Component, score: float}>> $scoredByCategory
     * @return array<string, int>
     */
    private function buildRuleBasedRecommendation(array $scoredByCategory, int $budget, string $useCase): array
    {
        $scoreOf = $this->buildScoreLookup($scoredByCategory);
        $weights = config("scoring.category_weights.{$useCase}", []);
        $maxBudget = $this->maxAllowedBudget($budget);

        $best = null;
        $bestScore = -1.0;

        foreach (collect($scoredByCategory['cpu'] ?? [])->pluck('component') as $cpu) {
            $candidate = $this->bestBuildForCpu($cpu, $scoredByCategory, $maxBudget, $scoreOf, $weights);
            if ($candidate !== null && $candidate['score'] > $bestScore) {
                $bestScore = $candidate['score'];
                $best = $candidate['ids'];
            }
        }

        if ($best === null) {
            throw new RuntimeException('Không tìm được cấu hình phù hợp với ngân sách và kho linh kiện hiện tại.');
        }

        return $best;
    }

    /**
     * Duyệt mọi tổ hợp mainboard × VGA tương thích cho 1 CPU, chọn build có tổng
     * điểm (theo trọng số use case) cao nhất mà vẫn nằm trong ngân sách.
     *
     * @param array<string, Collection<int, array{component: Component, score: float}>> $scoredByCategory
     * @param array<string, array<int, float>> $scoreOf
     * @param array<string, float> $weights
     * @return array{ids: array<string, int>, score: float}|null
     */
    private function bestBuildForCpu(Component $cpu, array $scoredByCategory, int $maxBudget, array $scoreOf, array $weights): ?array
    {
        $cpuSocket = data_get($cpu->specifications, 'socket');
        if (!$cpuSocket) {
            return null;
        }

        $mainboards = collect($scoredByCategory['mainboard'] ?? [])->pluck('component')
            ->filter(fn (Component $mb) => data_get($mb->specifications, 'socket') === $cpuSocket)
            ->values();

        $vgas = collect($scoredByCategory['vga'] ?? [])->pluck('component');
        $cases = collect($scoredByCategory['case'] ?? [])->pluck('component');
        $coolers = collect($scoredByCategory['cooler'] ?? [])->pluck('component');
        $psus = collect($scoredByCategory['psu'] ?? [])->pluck('component');
        $storages = collect($scoredByCategory['storage'] ?? [])->pluck('component');

        $best = null;
        $bestScore = -1.0;

        foreach ($mainboards as $mainboard) {
            $ramType = $this->resolveMainboardRamType($mainboard);
            $ramCandidates = collect($scoredByCategory['ram'] ?? [])->pluck('component')
                ->filter(fn (Component $item) => !$ramType
                    || strtoupper((string) data_get($item->specifications, 'type', data_get($item->specifications, 'ram_type', ''))) === $ramType)
                ->values();

            $ram = $this->cheapest($ramCandidates);
            $storage = $this->cheapest($storages);

            if (!$ram || !$storage) {
                continue;
            }

            foreach ($vgas as $vga) {
                $case = $this->compatibleCases($cases, $mainboard, $vga)->first();
                if (!$case) {
                    continue;
                }

                $cooler = $this->cheapestCompatibleCooler($coolers, $cpu, $case);
                $psu = $this->cheapestCompatiblePsu($psus, $cpu, $vga);

                if (!$cooler || !$psu) {
                    continue;
                }

                $picks = [
                    'cpu' => $cpu,
                    'mainboard' => $mainboard,
                    'ram' => $ram,
                    'vga' => $vga,
                    'storage' => $storage,
                    'psu' => $psu,
                    'case' => $case,
                    'cooler' => $cooler,
                ];

                if ($this->sumMinPrice($picks) > $maxBudget) {
                    continue;
                }

                $picks = $this->upgradeWithinBudget($picks, $scoredByCategory, $maxBudget, $ramType);
                $componentIds = array_map(fn (Component $c) => $c->id, $picks);

                if (!$this->runCompatibilityCheck($componentIds)['passed']) {
                    continue;
                }

                $score = $this->weightedScore($picks, $scoreOf, $weights);
                if ($score > $bestScore) {
                    $bestScore = $score;
                    $best = ['ids' => $componentIds, 'score' => $score];
                }
            }
        }

        return $best;
    }

    /**
     * @param array<string, Collection<int, array{component: Component, score: float}>> $scoredByCategory
     * @return array<string, array<int, float>>
     */
    private function buildScoreLookup(array $scoredByCategory): array
    {
        $lookup = [];
        foreach ($scoredByCategory as $code => $items) {
            foreach ($items as $item) {
                $lookup[$code][$item['component']->id] = $item['score'];
            }
        }

        return $lookup;
    }

    /**
     * @param array<string, Component> $picks
     * @param array<string, array<int, float>> $scoreOf
     * @param array<string, float> $weights
     */
    private function weightedScore(array $picks, array $scoreOf, array $weights): float
    {
        $total = 0.0;
        foreach ($picks as $code => $component) {
            $weight = $weights[$code] ?? 0.1;
            $score = $scoreOf[$code][$component->id] ?? 0.0;
            $total += $weight * $score;
        }

        return $total;
    }

    /**
     * Nâng cấp ram, storage, psu, cooler lên option điểm cao hơn nếu còn ngân sách
     * và vẫn tương thích. Giới hạn nâng cấp để không vượt quá 60% ngân sách còn lại.
     *
     * @param array<string, Component> $picks
     * @param array<string, Collection<int, array{component: Component, score: float}>> $scoredByCategory
     * @return array<string, Component>
     */
    private function upgradeWithinBudget(array $picks, array $scoredByCategory, int $maxBudget, ?string $ramType): array
    {
        // Build score lookup for fast access
        $scoreLookup = [];
        foreach ($scoredByCategory as $code => $items) {
            foreach ($items as $item) {
                $scoreLookup[$code][$item['component']->id] = $item['score'];
            }
        }
        
        $upgrade = function (string $slot, callable $candidates) use (&$picks, $maxBudget, $scoreLookup) {
            $current = $picks[$slot];
            $baseTotal = $this->sumMinPrice($picks) - $current->min_price;
            $currentScore = $scoreLookup[$slot][$current->id] ?? 0;
            
            // Giới hạn: chỉ nâng cấp nếu component mới có điểm cao hơn đáng kể
            $best = $current;
            $bestScore = $currentScore;
            
            foreach ($candidates($slot) as $candidate) {
                $candidateScore = $scoreLookup[$slot][$candidate->id] ?? 0;
                $fitsInBudget = $baseTotal + $candidate->min_price <= $maxBudget;
                
                // Nâng cấp nếu trong ngân sách VÀ điểm cao hơn
                if ($fitsInBudget && $candidateScore > $bestScore) {
                    $best = $candidate;
                    $bestScore = $candidateScore;
                }
            }
            $picks[$slot] = $best;
        };

        // RAM: cùng loại, điểm cao nhất trong ngân sách
        $upgrade('ram', fn ($slot) => collect($scoredByCategory[$slot] ?? [])->pluck('component')
            ->filter(fn (Component $item) => !$ramType
                || strtoupper((string) data_get($item->specifications, 'type', data_get($item->specifications, 'ram_type', ''))) === $ramType));

        $upgrade('storage', fn ($slot) => collect($scoredByCategory[$slot] ?? [])->pluck('component'));

        $cpu = $picks['cpu'];
        $vga = $picks['vga'];
        $required = (float) data_get($cpu->specifications, 'tdp', 0)
            + (float) data_get($vga->specifications, 'tdp', 0) + 100;
        $upgrade('psu', fn ($slot) => collect($scoredByCategory[$slot] ?? [])->pluck('component')
            ->filter(fn (Component $p) => (float) data_get($p->specifications, 'wattage', 0) >= $required));

        $case = $picks['case'];
        $maxHeight = (float) data_get($case->specifications, 'max_cooler_height_mm', PHP_INT_MAX);
        $cpuSocket = data_get($cpu->specifications, 'socket');
        $upgrade('cooler', fn ($slot) => collect($scoredByCategory[$slot] ?? [])->pluck('component')
            ->filter(function (Component $cooler) use ($cpuSocket, $maxHeight) {
                $supports = data_get($cooler->specifications, 'supported_sockets', data_get($cooler->specifications, 'socket_support', []));
                $height = (float) data_get($cooler->specifications, 'height_mm', 0);
                if ($cpuSocket && is_array($supports) && !in_array($cpuSocket, $supports, true)) {
                    return false;
                }
                return !($height > 0 && $height > $maxHeight);
            }));

        return $picks;
    }

    /**
     * @param array<string, Component> $picks
     */
    private function sumMinPrice(array $picks): int
    {
        return array_sum(array_map(fn (Component $c) => (int) $c->min_price, $picks));
    }

    private function maxAllowedBudget(int $budget): int
    {
        $flexPercent = config('llm.recommendation.budget_flex_percent', 5);

        return $budget + (int) floor($budget * ($flexPercent / 100));
    }

    private function cheapest(Collection $components): ?Component
    {
        return $components->sortBy('min_price')->first();
    }

    /**
     * Danh sách case tương thích (form factor + chiều dài VGA), sắp theo giá tăng dần.
     *
     * @return Collection<int, Component>
     */
    private function compatibleCases(Collection $cases, Component $mainboard, Component $vga): Collection
    {
        $mbForm = data_get($mainboard->specifications, 'form_factor');
        $vgaLength = (float) data_get($vga->specifications, 'length_mm', 0);

        return $cases->filter(function (Component $case) use ($mbForm, $vgaLength) {
            $supported = data_get($case->specifications, 'supported_form_factors', []);
            $maxGpu = (float) data_get($case->specifications, 'max_vga_length_mm', data_get($case->specifications, 'max_gpu_length_mm', PHP_INT_MAX));

            if ($mbForm && is_array($supported) && !in_array($mbForm, $supported, true)) {
                return false;
            }

            return !($vgaLength > 0 && $vgaLength > $maxGpu);
        })->sortBy('min_price')->values();
    }

    private function cheapestCompatibleCooler(Collection $coolers, Component $cpu, Component $case): ?Component
    {
        $cpuSocket = data_get($cpu->specifications, 'socket');
        $maxHeight = (float) data_get($case->specifications, 'max_cooler_height_mm', PHP_INT_MAX);

        return $coolers->filter(function (Component $cooler) use ($cpuSocket, $maxHeight) {
            $supports = data_get($cooler->specifications, 'supported_sockets', data_get($cooler->specifications, 'socket_support', []));
            $height = (float) data_get($cooler->specifications, 'height_mm', 0);

            if ($cpuSocket && is_array($supports) && !in_array($cpuSocket, $supports, true)) {
                return false;
            }

            return !($height > 0 && $height > $maxHeight);
        })->sortBy('min_price')->first();
    }

    private function cheapestCompatiblePsu(Collection $psus, Component $cpu, Component $vga): ?Component
    {
        $required = (float) data_get($cpu->specifications, 'tdp', 0)
            + (float) data_get($vga->specifications, 'tdp', 0)
            + 100;

        return $psus
            ->filter(fn (Component $psu) => (float) data_get($psu->specifications, 'wattage', 0) >= $required)
            ->sortBy('min_price')
            ->first();
    }

    private function resolveMainboardRamType(Component $mainboard): ?string
    {
        $direct = data_get($mainboard->specifications, 'ram_type');
        if ($direct) {
            return strtoupper((string) $direct);
        }

        $supported = data_get($mainboard->specifications, 'supported_ram_types', []);
        if (is_array($supported) && count($supported) > 0) {
            return strtoupper((string) $supported[0]);
        }

        return null;
    }

    /**
     * @param array<string, int> $componentIds
     */
    private function finalizeRecommendation(
        array $componentIds,
        int $budget,
        string $useCase,
        ?string $reasoning,
        array $highlights,
        string $source
    ): array {
        $requiredSlots = config('scoring.required_slots', []);
        $missing = array_diff($requiredSlots, array_keys($componentIds));

        if ($missing) {
            throw new RuntimeException('Thiếu linh kiện bắt buộc: ' . implode(', ', $missing));
        }

        foreach ($componentIds as $slot => $id) {
            $component = Component::find($id);
            if (!$component || $component->deleted_at !== null) {
                throw new RuntimeException("Linh kiện {$slot} (ID {$id}) không tồn tại.");
            }
        }

        if (!$this->isWithinBudget($componentIds, $budget)) {
            throw new RuntimeException('Cấu hình vượt quá ngân sách cho phép.');
        }

        $compatibility = $this->runCompatibilityCheck($componentIds);
        if (!$compatibility['passed']) {
            throw new RuntimeException('Cấu hình không vượt qua kiểm tra tương thích.');
        }

        $components = [];
        $totalMin = 0;
        $totalMax = 0;

        foreach ($componentIds as $slot => $id) {
            $component = Component::find($id);
            $score = $this->scoringService->scoreComponent($component, $useCase, $slot);

            $components[$slot] = [
                'id' => $component->id,
                'category_id' => $component->category_id,
                'brand' => $component->brand,
                'name' => $component->name,
                'min_price' => $component->min_price,
                'max_price' => $component->max_price,
                'specifications' => $component->specifications,
                'image_url' => $component->image_url,
                'score' => $score,
            ];

            $totalMin += $component->min_price;
            $totalMax += $component->max_price;
        }

        return [
            'use_case' => $useCase,
            'budget' => $budget,
            'source' => $source,
            'components' => $components,
            'total_min_price' => $totalMin,
            'total_max_price' => $totalMax,
            'reasoning' => $reasoning,
            'highlights' => $highlights,
            'compatibility_check' => $compatibility,
        ];
    }

    /**
     * @param array<string, Collection<int, array{component: Component, score: float}>> $scoredByCategory
     */
    private function buildPrompt(string $useCase, int $budget, array $scoredByCategory, ?array $constraints): string
    {
        $lines = [];
        $lines[] = 'Bạn là chuyên gia lắp ráp PC. Chỉ được chọn linh kiện bằng ID có trong danh sách bên dưới.';
        $lines[] = '';
        $lines[] = '## Yêu cầu';
        $lines[] = '- Use case: ' . $useCase;
        $lines[] = '- Budget tối đa: ' . number_format($budget) . ' VNĐ';
        $lines[] = '- Linh kiện bắt buộc: cpu, mainboard, ram, vga, storage, psu, case, cooler';

        if ($constraints) {
            $lines[] = '- Ràng buộc thêm: ' . json_encode($constraints, JSON_UNESCAPED_UNICODE);
        }

        $lines[] = '';
        $lines[] = '## Danh sách linh kiện (theo điểm phù hợp)';

        foreach ($scoredByCategory as $category => $items) {
            $lines[] = '';
            $lines[] = strtoupper($category) . ':';
            foreach ($items as $item) {
                /** @var Component $component */
                $component = $item['component'];
                $lines[] = sprintf(
                    '- [%d] %s %s | score=%s | price=%s-%s VNĐ',
                    $component->id,
                    $component->brand,
                    $component->name,
                    round($item['score']),
                    number_format($component->min_price),
                    number_format($component->max_price)
                );
            }
        }

        $lines[] = '';
        $lines[] = '## Quy tắc tương thích';
        $lines[] = '- CPU socket phải khớp mainboard';
        $lines[] = '- RAM type phải khớp mainboard';
        $lines[] = '- PSU wattage >= CPU TDP + VGA TDP + 100W';
        $lines[] = '- VGA length <= case max_vga_length_mm';
        $lines[] = '- Cooler height <= case max_cooler_height_mm';
        $lines[] = '- Mainboard form_factor nằm trong case supported_form_factors';
        $lines[] = '';
        $lines[] = '## Output';
        $lines[] = 'Trả về JSON hợp lệ ONLY, không markdown:';
        $lines[] = '{';
        $lines[] = '  "cpu": {"id": 1, "reasoning": "..."},';
        $lines[] = '  "mainboard": {"id": 2, "reasoning": "..."},';
        $lines[] = '  "ram": {"id": 3, "reasoning": "..."},';
        $lines[] = '  "vga": {"id": 4, "reasoning": "..."},';
        $lines[] = '  "storage": {"id": 5, "reasoning": "..."},';
        $lines[] = '  "psu": {"id": 6, "reasoning": "..."},';
        $lines[] = '  "case": {"id": 7, "reasoning": "..."},';
        $lines[] = '  "cooler": {"id": 8, "reasoning": "..."},';
        $lines[] = '  "overall_reasoning": "...",';
        $lines[] = '  "highlights": ["...", "..."]';
        $lines[] = '}';

        return implode("\n", $lines);
    }

    private function extractComponentIds(array $llmResult): array
    {
        $slots = config('scoring.required_slots', []);
        $ids = [];

        foreach ($slots as $slot) {
            $value = $llmResult[$slot] ?? null;
            $id = is_array($value) ? ($value['id'] ?? null) : $value;

            if (!$id) {
                throw new RuntimeException("LLM thiếu linh kiện bắt buộc: {$slot}");
            }

            $ids[$slot] = (int) $id;
        }

        return $ids;
    }

    /**
     * @param array<string, int> $componentIds
     */
    private function isWithinBudget(array $componentIds, int $budget): bool
    {
        $flexPercent = config('llm.recommendation.budget_flex_percent', 5);
        $maxAllowed = $budget + (int) floor($budget * ($flexPercent / 100));

        $total = Component::query()
            ->whereIn('id', array_values($componentIds))
            ->sum('min_price');

        return $total <= $maxAllowed;
    }

    /**
     * @param array<string, int> $componentIds
     */
    private function runCompatibilityCheck(array $componentIds): array
    {
        $request = Request::create('/api/compatibility/check', 'POST', [
            'components' => $componentIds,
        ]);

        $response = $this->compatibilityController->check($request);
        $payload = $response->getData(true);

        return [
            'passed' => (bool) ($payload['passed'] ?? false),
            'alerts' => $payload['alerts'] ?? [],
        ];
    }
}
