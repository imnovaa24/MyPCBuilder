<?php

namespace Database\Factories;

use App\Models\Component;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComponentFactory extends Factory
{
    protected $model = Component::class;

    public function definition(): array
    {
        return [
            'category_id' => 1,
            'brand' => $this->faker->word(),
            'name' => $this->faker->word(),
            'min_price' => $this->faker->numberBetween(1000, 5000),
            'max_price' => $this->faker->numberBetween(5000, 20000),
            'image_url' => $this->faker->imageUrl(),
            'specifications' => [],
        ];
    }

    /**
     * CPU component
     */
    public function cpu(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 1,
            'name' => 'Intel Core i9-13900K',
            'specifications' => [
                'socket' => 'LGA1700',
                'tdp' => 253,
                'performance_tier' => 3,
            ],
        ]);
    }

    /**
     * Mainboard component
     */
    public function mainboard(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 2,
            'name' => 'ASUS ROG STRIX Z790-E',
            'specifications' => [
                'socket' => 'LGA1700',
                'form_factor' => 'ATX',
                'supported_ram_types' => ['DDR5'],
            ],
        ]);
    }

    /**
     * RAM component
     */
    public function ram(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 3,
            'name' => 'Corsair Vengeance DDR5',
            'specifications' => [
                'type' => 'DDR5',
            ],
        ]);
    }

    /**
     * GPU component - High tier
     */
    public function gpu(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 4,
            'name' => 'NVIDIA RTX 4090',
            'specifications' => [
                'tdp' => 450,
                'length_mm' => 300,
                'performance_tier' => 3,
            ],
        ]);
    }

    /**
     * GPU component - Low tier (to cause bottleneck warning)
     */
    public function gpuLow(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 4,
            'name' => 'NVIDIA RTX 4060',
            'specifications' => [
                'tdp' => 70,
                'length_mm' => 150,
                'performance_tier' => 1,
            ],
        ]);
    }

    /**
     * PSU component - High wattage
     */
    public function psuHigh(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 5,
            'name' => 'Corsair RM1000x',
            'specifications' => [
                'wattage' => 1000,
            ],
        ]);
    }

    /**
     * PSU component - Low wattage (to fail test)
     */
    public function psuLow(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 5,
            'name' => 'Generic 450W PSU',
            'specifications' => [
                'wattage' => 450,
            ],
        ]);
    }

    /**
     * Case component
     */
    public function case(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 6,
            'name' => 'NZXT H7 Flow',
            'specifications' => [
                'max_gpu_length_mm' => 350,
                'max_cooler_height_mm' => 165,
                'supported_form_factors' => ['ATX', 'Micro-ATX'],
            ],
        ]);
    }

    /**
     * Cooler component
     */
    public function cooler(): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => 7,
            'name' => 'Noctua NH-D15',
            'specifications' => [
                'height_mm' => 160,
            ],
        ]);
    }
}
