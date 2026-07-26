<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class Additional11ComponentsSeeder extends Seeder
{
    public function run(): void
    {
        // Add 2 more CPUs
        Component::create([
            'category_id' => 1,
            'brand' => 'AMD',
            'name' => 'Ryzen 5 5600G',
            'min_price' => 3500000,
            'max_price' => 4000000,
            'specifications' => ['socket' => 'AM4', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 3.9, 'has_igpu' => true, 'performance_tier' => 3]
        ]);
        Component::create([
            'category_id' => 1,
            'brand' => 'Intel',
            'name' => 'Core i7-12700',
            'min_price' => 7500000,
            'max_price' => 8200000,
            'specifications' => ['socket' => 'LGA1700', 'cores' => 12, 'threads' => 20, 'tdp' => 65, 'base_frequency' => 2.1, 'has_igpu' => true, 'performance_tier' => 4]
        ]);

        // Add 1 more Mainboard
        Component::create([
            'category_id' => 2,
            'brand' => 'ASRock',
            'name' => 'B550M Steel Legend',
            'min_price' => 2800000,
            'max_price' => 3300000,
            'specifications' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]
        ]);

        // Add 1 more RAM
        Component::create([
            'category_id' => 3,
            'brand' => 'PNY',
            'name' => 'XLR8 Gaming 16GB (2x8GB) DDR4 3200MHz',
            'min_price' => 1050000,
            'max_price' => 1250000,
            'specifications' => ['type' => 'DDR4', 'capacity' => 16, 'bus_speed' => 3200, 'kit' => 2]
        ]);

        // Add 1 more VGA
        Component::create([
            'category_id' => 4,
            'brand' => 'Colorful',
            'name' => 'iGame GeForce RTX 4070 Ultra W OC 12GB',
            'min_price' => 14500000,
            'max_price' => 16000000,
            'specifications' => ['vram' => '12GB', 'length_mm' => 310, 'tdp' => 200, 'recommended_psu' => 650, 'performance_tier' => 4]
        ]);

        // Add 1 more Case
        Component::create([
            'category_id' => 6,
            'brand' => 'Montech',
            'name' => 'AIR 903 MAX',
            'min_price' => 2200000,
            'max_price' => 2600000,
            'specifications' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 420, 'max_cooler_height_mm' => 175]
        ]);

        // Add 2 more Coolers
        Component::create([
            'category_id' => 7,
            'brand' => 'ID-Cooling',
            'name' => 'FROSTFLOW X 240',
            'min_price' => 1500000,
            'max_price' => 1800000,
            'specifications' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 240, 'tdp_rating' => 250]
        ]);
        Component::create([
            'category_id' => 7,
            'brand' => 'Cooler Master',
            'name' => 'Hyper 212 EVO V2',
            'min_price' => 750000,
            'max_price' => 950000,
            'specifications' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 159, 'radiator_size_mm' => 0, 'tdp_rating' => 200]
        ]);

        // Add 3 more Storage
        Component::create([
            'category_id' => 8,
            'brand' => 'ADATA',
            'name' => 'XPG SX8200 Pro 1TB',
            'min_price' => 2200000,
            'max_price' => 2600000,
            'specifications' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 1000, 'read_speed' => 3500, 'write_speed' => 3000]
        ]);
        Component::create([
            'category_id' => 8,
            'brand' => 'Lexar',
            'name' => 'NM790 1TB',
            'min_price' => 2000000,
            'max_price' => 2400000,
            'specifications' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 1000, 'read_speed' => 7400, 'write_speed' => 6500]
        ]);
        Component::create([
            'category_id' => 8,
            'brand' => 'Seagate',
            'name' => 'Barracuda Compute 2TB',
            'min_price' => 1400000,
            'max_price' => 1700000,
            'specifications' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 2000, 'read_speed' => 220, 'write_speed' => 220]
        ]);

        $this->command->info('Added 11 additional components to reach 300 total new components!');
    }
}
