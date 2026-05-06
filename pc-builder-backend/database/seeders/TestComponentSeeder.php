<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Component;

class TestComponentSeeder extends Seeder
{
    public function run(): void
    {
        // CPU 1 - LGA1700
        Component::updateOrCreate(
            ['id' => 1],
            [
                'category_id' => 1,
                'brand' => 'Intel',
                'name' => 'Intel Core i9-13900K',
                'min_price' => 500000,
                'max_price' => 700000,
                'specifications' => [
                    'socket' => 'LGA1700',
                    'tdp' => 253,
                    'performance_tier' => 3,
                ]
            ]
        );

        // Mainboard 5 - AM5 (khác socket → conflict)
        Component::updateOrCreate(
            ['id' => 5],
            [
                'category_id' => 2,
                'brand' => 'ASUS',
                'name' => 'ASUS ROG STRIX X870-E',
                'min_price' => 3000000,
                'max_price' => 4000000,
                'specifications' => [
                    'socket' => 'AM5',
                    'form_factor' => 'ATX',
                    'supported_ram_types' => ['DDR5'],
                ]
            ]
        );

        // RAM 3 - DDR4
        Component::updateOrCreate(
            ['id' => 3],
            [
                'category_id' => 3,
                'brand' => 'Corsair',
                'name' => 'Corsair Vengeance DDR4',
                'min_price' => 500000,
                'max_price' => 1000000,
                'specifications' => [
                    'type' => 'DDR4',
                ]
            ]
        );

        // GPU 8 - High performance
        Component::updateOrCreate(
            ['id' => 8],
            [
                'category_id' => 4,
                'brand' => 'NVIDIA',
                'name' => 'NVIDIA RTX 4090',
                'min_price' => 30000000,
                'max_price' => 40000000,
                'specifications' => [
                    'tdp' => 450,
                    'length_mm' => 300,
                    'performance_tier' => 3,
                ]
            ]
        );

        // PSU 12 - Low wattage
        Component::updateOrCreate(
            ['id' => 12],
            [
                'category_id' => 5,
                'brand' => 'Generic',
                'name' => 'Generic 450W PSU',
                'min_price' => 500000,
                'max_price' => 1000000,
                'specifications' => [
                    'wattage' => 450,  // CPU 253W + GPU 450W + 100W buffer = 803W required
                ]
            ]
        );

        // Case 7
        Component::updateOrCreate(
            ['id' => 7],
            [
                'category_id' => 6,
                'brand' => 'NZXT',
                'name' => 'NZXT H7 Flow',
                'min_price' => 2000000,
                'max_price' => 3000000,
                'specifications' => [
                    'max_gpu_length_mm' => 350,
                    'max_cooler_height_mm' => 165,
                    'supported_form_factors' => ['ATX', 'Micro-ATX'],
                ]
            ]
        );
    }
}
