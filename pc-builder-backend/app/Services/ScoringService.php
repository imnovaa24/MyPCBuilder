<?php

namespace App\Services;

use App\Models\Component;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ScoringService
{
    private const CACHE_TTL = 3600;

    public function scoreComponent(Component $component, string $useCase, ?string $categoryCode = null): float
    {
        $cacheKey = "score:{$component->id}:{$useCase}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($component, $useCase, $categoryCode) {
            $code = $categoryCode ?? $this->resolveCategoryCode($component);
            $score = match ($code) {
                'cpu' => $this->scoreCpu($component, $useCase),
                'vga' => $this->scoreVga($component, $useCase),
                'ram' => $this->scoreRam($component, $useCase),
                'storage' => $this->scoreStorage($component, $useCase),
                'psu' => $this->scorePsu($component, $useCase),
                'case' => $this->scoreCase($component, $useCase),
                'cooler' => $this->scoreCooler($component, $useCase),
                'mainboard' => $this->scoreMainboard($component, $useCase),
                default => 50.0,
            };

            return max(0, min(100, round($score, 2)));
        });
    }

    /**
     * Trả về danh sách linh kiện theo category, bao gồm cả options cao cấp và giá rẻ.
     * 
     * @return array<string, Collection<int, array{component: Component, score: float}>>
     */
    public function getScoredComponentsByCategory(string $useCase, ?array $constraints = null): array
    {
        $topLimit = config('llm.recommendation.top_per_category', 20);
        $results = [];

        foreach (config('scoring.required_slots', []) as $code) {
            $components = $this->getComponentsByCategoryCode($code);
            $filtered = $this->applyConstraints($components, $code, $constraints);

            // Score tất cả components
            $allScored = $filtered->map(fn (Component $component) => [
                'component' => $component,
                'score' => $this->scoreComponent($component, $useCase, $code),
            ]);

            // Lấy top N/2 theo score (high-end options)
            $topByScore = $allScored->sortByDesc('score')->take((int) ceil($topLimit / 2));
            
            // Lấy top N/2 theo giá thấp nhất (budget options)
            $topByPrice = $allScored->sortBy(fn ($item) => $item['component']->min_price)->take((int) ceil($topLimit / 2));
            
            // Merge và loại bỏ trùng lặp, giữ theo score desc
            $merged = $topByScore->merge($topByPrice)
                ->unique(fn ($item) => $item['component']->id)
                ->sortByDesc('score')
                ->take($topLimit)
                ->values();

            $results[$code] = $merged;
        }

        return $results;
    }

    public function invalidateCache(Component $component): void
    {
        foreach (config('scoring.use_cases', []) as $useCase) {
            Cache::forget("score:{$component->id}:{$useCase}");
        }
    }

    private function getComponentsByCategoryCode(string $code): Collection
    {
        return Component::query()
            ->join('categories', 'components.category_id', '=', 'categories.id')
            ->where('categories.code', $code)
            ->whereNull('components.deleted_at')
            ->select('components.*')
            ->get();
    }

    private function resolveCategoryCode(Component $component): ?string
    {
        return DB::table('categories')
            ->where('id', $component->category_id)
            ->value('code');
    }

    private function spec(Component $component, string $key, mixed $default = null): mixed
    {
        return data_get($component->specifications, $key, $default);
    }

    private function scoreCpu(Component $component, string $useCase): float
    {
        $tier = (float) ($this->spec($component, 'performance_tier', 2) ?: 2);
        $cores = (float) ($this->spec($component, 'cores', 0) ?: 0);
        $freq = (float) ($this->spec($component, 'base_frequency', $this->spec($component, 'frequency', 0)) ?: 0);
        $tdp = (float) ($this->spec($component, 'tdp', 65) ?: 65);

        $tierScore = min($tier / 3, 1) * 55;
        $coreScore = min($cores / 24, 1) * 25;
        $freqScore = min($freq / 6.2, 1) * 20;

        $score = $tierScore + $coreScore + $freqScore;

        if (in_array($useCase, ['office', 'learning'], true)) {
            $score += $tdp <= 65 ? 10 : max(0, 10 - (($tdp - 65) * 0.1));
        }

        if (in_array($useCase, ['gaming', 'office'], true) && $freq > 0) {
            $score += min($freq / 6.2, 1) * 10;
        }

        return $score;
    }

    private function scoreVga(Component $component, string $useCase): float
    {
        $tier = (float) ($this->spec($component, 'performance_tier', 2) ?: 2);
        $vram = (float) ($this->spec($component, 'vram', $this->spec($component, 'vram_size', 0)) ?: 0);
        $tdp = (float) ($this->spec($component, 'tdp', 0) ?: 0);

        $tierScore = min($tier / 3, 1) * 60;
        $vramScore = min($vram / 24, 1) * 40;
        $score = $tierScore + $vramScore;

        if ($useCase === 'office') {
            $score += max(0, 20 - ($tdp * 0.05));
        }

        if ($useCase === 'gaming') {
            $score += min($tier / 3, 1) * 20;
        }

        return $score;
    }

    private function scoreRam(Component $component, string $useCase): float
    {
        $capacity = (float) ($this->spec($component, 'capacity', $this->spec($component, 'capacity_gb', 16)) ?: 16);
        $speed = (float) ($this->spec($component, 'bus_speed', $this->spec($component, 'frequency', 3200)) ?: 3200);
        $type = strtoupper((string) $this->spec($component, 'type', $this->spec($component, 'ram_type', '')));

        $capacityScore = min($capacity / 64, 1) * 60;
        $speedScore = min(max($speed - 3200, 0) / 3200, 0.3) * 30;
        $typeBonus = $type === 'DDR5' ? 10 : 0;

        $score = $capacityScore + $speedScore + $typeBonus;

        if (in_array($useCase, ['development', 'graphics'], true)) {
            $score += min($capacity / 64, 1) * 15;
        }

        return $score;
    }

    private function scoreStorage(Component $component, string $useCase): float
    {
        $type = strtoupper((string) $this->spec($component, 'type', 'SSD'));
        $capacity = (float) ($this->spec($component, 'capacity_gb', $this->spec($component, 'capacity', 512)) ?: 512);
        $readSpeed = (float) ($this->spec($component, 'read_speed', 3500) ?: 3500);

        $typeScore = match (true) {
            str_contains($type, 'NVME') || $type === 'SSD' => 85,
            $type === 'HDD' => 35,
            default => 60,
        };

        $capacityScore = min($capacity / 2000, 1) * 30;
        $speedScore = min($readSpeed / 7000, 1) * 20;

        $score = ($typeScore * 0.6) + $capacityScore + $speedScore;

        if (in_array($useCase, ['graphics', 'development'], true)) {
            $score += min($capacity / 2000, 1) * 10;
        }

        return $score;
    }

    private function scorePsu(Component $component, string $useCase): float
    {
        $wattage = (float) ($this->spec($component, 'wattage', 550) ?: 550);
        $efficiency = strtoupper((string) $this->spec($component, 'efficiency', ''));

        $wattScore = min($wattage / 1200, 1) * 70;
        $effScore = match (true) {
            str_contains($efficiency, 'PLATINUM') => 30,
            str_contains($efficiency, 'GOLD') => 24,
            str_contains($efficiency, 'BRONZE') => 16,
            default => 12,
        };

        return $wattScore + $effScore;
    }

    private function scoreCase(Component $component, string $useCase): float
    {
        $maxGpu = (float) ($this->spec($component, 'max_vga_length_mm', 300) ?: 300);
        $maxCooler = (float) ($this->spec($component, 'max_cooler_height_mm', 160) ?: 160);
        $supported = $this->spec($component, 'supported_form_factors', []);

        $clearanceScore = min(($maxGpu + $maxCooler) / 700, 1) * 60;
        $flexScore = is_array($supported) ? min(count($supported) / 3, 1) * 40 : 20;

        return $clearanceScore + $flexScore;
    }

    private function scoreCooler(Component $component, string $useCase): float
    {
        $tdpRating = (float) ($this->spec($component, 'tdp_rating', 150) ?: 150);
        $height = (float) ($this->spec($component, 'height_mm', 155) ?: 155);

        $perfScore = min($tdpRating / 250, 1) * 70;
        $sizeScore = max(0, (170 - $height) / 170) * 30;

        if (in_array($useCase, ['gaming', 'graphics'], true)) {
            $perfScore += 10;
        }

        return $perfScore + $sizeScore;
    }

    private function scoreMainboard(Component $component, string $useCase): float
    {
        $ramTypes = $this->spec($component, 'supported_ram_types', []);
        $formFactor = strtoupper((string) $this->spec($component, 'form_factor', 'ATX'));

        $score = 50.0;

        if (is_array($ramTypes) && in_array('DDR5', $ramTypes, true)) {
            $score += 15;
        }

        if ($formFactor === 'ATX') {
            $score += 10;
        }

        if (in_array($useCase, ['development', 'graphics', 'gaming'], true)) {
            $score += 10;
        }

        return $score;
    }

    private function applyConstraints(Collection $components, string $code, ?array $constraints): Collection
    {
        if (!$constraints) {
            return $components;
        }

        return $components->filter(function (Component $component) use ($code, $constraints) {
            if ($code === 'cpu' && !empty($constraints['preferred_cpu_brand'])) {
                if (!str_contains(strtolower($component->brand), strtolower($constraints['preferred_cpu_brand']))) {
                    return false;
                }
            }

            if ($code === 'vga' && !empty($constraints['preferred_vga_brand'])) {
                if (!str_contains(strtolower($component->brand), strtolower($constraints['preferred_vga_brand']))) {
                    return false;
                }
            }

            if ($code === 'vga' && !empty($constraints['min_vram'])) {
                $vram = (float) ($this->spec($component, 'vram', $this->spec($component, 'vram_size', 0)) ?: 0);
                if ($vram < (float) $constraints['min_vram']) {
                    return false;
                }
            }

            if ($code === 'ram' && !empty($constraints['preferred_ram_type'])) {
                $type = strtoupper((string) $this->spec($component, 'type', $this->spec($component, 'ram_type', '')));
                if ($type !== strtoupper($constraints['preferred_ram_type'])) {
                    return false;
                }
            }

            if ($code === 'cpu' && !empty($constraints['preferred_platform'])) {
                $platform = strtolower($constraints['preferred_platform']);
                $name = strtolower($component->brand . ' ' . $component->name);
                if ($platform === 'intel' && !str_contains($name, 'intel')) {
                    return false;
                }
                if ($platform === 'amd' && !str_contains($name, 'amd') && !str_contains($name, 'ryzen')) {
                    return false;
                }
            }

            return true;
        })->values();
    }
}
