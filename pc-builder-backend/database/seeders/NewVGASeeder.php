<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewVGASeeder extends Seeder
{
    public function run(): void
    {
        $vgas = [
            // Entry Level
            ['brand' => 'ASUS', 'name' => 'GeForce GT 710 2GB', 'min_price' => 900000, 'max_price' => 1100000, 'specs' => ['vram' => '2GB', 'length_mm' => 150, 'tdp' => 25, 'recommended_psu' => 300, 'performance_tier' => 1]],
            ['brand' => 'MSI', 'name' => 'GeForce GT 730 4GB', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['vram' => '4GB', 'length_mm' => 150, 'tdp' => 38, 'recommended_psu' => 300, 'performance_tier' => 1]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce GT 1030 OC 2GB', 'min_price' => 1800000, 'max_price' => 2100000, 'specs' => ['vram' => '2GB', 'length_mm' => 150, 'tdp' => 30, 'recommended_psu' => 300, 'performance_tier' => 1]],
            
            // Budget Gaming
            ['brand' => 'ASUS', 'name' => 'Phoenix GeForce GTX 1650 OC 4GB', 'min_price' => 3800000, 'max_price' => 4300000, 'specs' => ['vram' => '4GB', 'length_mm' => 200, 'tdp' => 75, 'recommended_psu' => 350, 'performance_tier' => 2]],
            ['brand' => 'MSI', 'name' => 'GeForce GTX 1650 VENTUS XS 4GB', 'min_price' => 3700000, 'max_price' => 4200000, 'specs' => ['vram' => '4GB', 'length_mm' => 178, 'tdp' => 75, 'recommended_psu' => 350, 'performance_tier' => 2]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce GTX 1650 D6 EAGLE OC 4GB', 'min_price' => 3900000, 'max_price' => 4400000, 'specs' => ['vram' => '4GB', 'length_mm' => 200, 'tdp' => 75, 'recommended_psu' => 350, 'performance_tier' => 2]],
            ['brand' => 'ASUS', 'name' => 'Dual GeForce GTX 1650 SUPER OC 4GB', 'min_price' => 4200000, 'max_price' => 4700000, 'specs' => ['vram' => '4GB', 'length_mm' => 204, 'tdp' => 100, 'recommended_psu' => 400, 'performance_tier' => 2]],
            
            // Mid-range
            ['brand' => 'MSI', 'name' => 'GeForce GTX 1660 SUPER VENTUS XS OC 6GB', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['vram' => '6GB', 'length_mm' => 204, 'tdp' => 125, 'recommended_psu' => 450, 'performance_tier' => 2]],
            ['brand' => 'ASUS', 'name' => 'TUF Gaming GeForce RTX 3050 OC 8GB', 'min_price' => 5800000, 'max_price' => 6500000, 'specs' => ['vram' => '8GB', 'length_mm' => 220, 'tdp' => 130, 'recommended_psu' => 550, 'performance_tier' => 2]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce RTX 3050 EAGLE OC 8GB', 'min_price' => 5600000, 'max_price' => 6300000, 'specs' => ['vram' => '8GB', 'length_mm' => 201, 'tdp' => 130, 'recommended_psu' => 550, 'performance_tier' => 2]],
            ['brand' => 'MSI', 'name' => 'GeForce RTX 3060 VENTUS 2X 12GB', 'min_price' => 7200000, 'max_price' => 8000000, 'specs' => ['vram' => '12GB', 'length_mm' => 235, 'tdp' => 170, 'recommended_psu' => 550, 'performance_tier' => 3]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce RTX 3060 GAMING OC 12GB', 'min_price' => 7500000, 'max_price' => 8300000, 'specs' => ['vram' => '12GB', 'length_mm' => 282, 'tdp' => 170, 'recommended_psu' => 550, 'performance_tier' => 3]],
            
            // RTX 40 Series Entry
            ['brand' => 'MSI', 'name' => 'GeForce RTX 4060 VENTUS 2X BLACK OC 8GB', 'min_price' => 7800000, 'max_price' => 8600000, 'specs' => ['vram' => '8GB', 'length_mm' => 199, 'tdp' => 115, 'recommended_psu' => 550, 'performance_tier' => 3]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce RTX 4060 EAGLE OC 8GB', 'min_price' => 7600000, 'max_price' => 8400000, 'specs' => ['vram' => '8GB', 'length_mm' => 240, 'tdp' => 115, 'recommended_psu' => 550, 'performance_tier' => 3]],
            ['brand' => 'ASUS', 'name' => 'Dual GeForce RTX 4060 OC 8GB', 'min_price' => 7900000, 'max_price' => 8700000, 'specs' => ['vram' => '8GB', 'length_mm' => 227, 'tdp' => 115, 'recommended_psu' => 550, 'performance_tier' => 3]],
            ['brand' => 'Zotac', 'name' => 'Gaming GeForce RTX 4060 Twin Edge OC 8GB', 'min_price' => 7400000, 'max_price' => 8200000, 'specs' => ['vram' => '8GB', 'length_mm' => 222, 'tdp' => 115, 'recommended_psu' => 550, 'performance_tier' => 3]],
            
            // RTX 40 Series Mid
            ['brand' => 'MSI', 'name' => 'GeForce RTX 4060 Ti GAMING X 8GB', 'min_price' => 10500000, 'max_price' => 11500000, 'specs' => ['vram' => '8GB', 'length_mm' => 247, 'tdp' => 160, 'recommended_psu' => 550, 'performance_tier' => 3]],
            ['brand' => 'ASUS', 'name' => 'TUF Gaming GeForce RTX 4060 Ti OC 8GB', 'min_price' => 10800000, 'max_price' => 11800000, 'specs' => ['vram' => '8GB', 'length_mm' => 302, 'tdp' => 160, 'recommended_psu' => 550, 'performance_tier' => 3]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce RTX 4060 Ti GAMING OC 8GB', 'min_price' => 10600000, 'max_price' => 11600000, 'specs' => ['vram' => '8GB', 'length_mm' => 282, 'tdp' => 160, 'recommended_psu' => 550, 'performance_tier' => 3]],
            
            // RTX 40 Series High
            ['brand' => 'MSI', 'name' => 'GeForce RTX 4070 VENTUS 3X 12GB', 'min_price' => 14000000, 'max_price' => 15500000, 'specs' => ['vram' => '12GB', 'length_mm' => 308, 'tdp' => 200, 'recommended_psu' => 650, 'performance_tier' => 4]],
            ['brand' => 'ASUS', 'name' => 'TUF Gaming GeForce RTX 4070 OC 12GB', 'min_price' => 14500000, 'max_price' => 16000000, 'specs' => ['vram' => '12GB', 'length_mm' => 305, 'tdp' => 200, 'recommended_psu' => 650, 'performance_tier' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce RTX 4070 GAMING OC 12GB', 'min_price' => 14200000, 'max_price' => 15700000, 'specs' => ['vram' => '12GB', 'length_mm' => 302, 'tdp' => 200, 'recommended_psu' => 650, 'performance_tier' => 4]],
            ['brand' => 'MSI', 'name' => 'GeForce RTX 4070 SUPER GAMING X SLIM 12GB', 'min_price' => 16500000, 'max_price' => 18000000, 'specs' => ['vram' => '12GB', 'length_mm' => 307, 'tdp' => 220, 'recommended_psu' => 700, 'performance_tier' => 4]],
            ['brand' => 'ASUS', 'name' => 'ROG STRIX GeForce RTX 4070 SUPER 12GB', 'min_price' => 17500000, 'max_price' => 19000000, 'specs' => ['vram' => '12GB', 'length_mm' => 320, 'tdp' => 220, 'recommended_psu' => 700, 'performance_tier' => 4]],
            
            // RTX 40 Series Enthusiast
            ['brand' => 'MSI', 'name' => 'GeForce RTX 4070 Ti SUPER GAMING X SLIM 16GB', 'min_price' => 22000000, 'max_price' => 24000000, 'specs' => ['vram' => '16GB', 'length_mm' => 307, 'tdp' => 285, 'recommended_psu' => 700, 'performance_tier' => 4]],
            ['brand' => 'ASUS', 'name' => 'TUF Gaming GeForce RTX 4070 Ti SUPER OC 16GB', 'min_price' => 22500000, 'max_price' => 24500000, 'specs' => ['vram' => '16GB', 'length_mm' => 305, 'tdp' => 285, 'recommended_psu' => 700, 'performance_tier' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'GeForce RTX 4080 SUPER GAMING OC 16GB', 'min_price' => 28000000, 'max_price' => 30000000, 'specs' => ['vram' => '16GB', 'length_mm' => 340, 'tdp' => 320, 'recommended_psu' => 750, 'performance_tier' => 5]],
            ['brand' => 'MSI', 'name' => 'GeForce RTX 4080 SUPER GAMING X TRIO 16GB', 'min_price' => 29000000, 'max_price' => 31000000, 'specs' => ['vram' => '16GB', 'length_mm' => 337, 'tdp' => 320, 'recommended_psu' => 750, 'performance_tier' => 5]],
            ['brand' => 'ASUS', 'name' => 'ROG STRIX GeForce RTX 4080 SUPER OC 16GB', 'min_price' => 30000000, 'max_price' => 32000000, 'specs' => ['vram' => '16GB', 'length_mm' => 352, 'tdp' => 320, 'recommended_psu' => 750, 'performance_tier' => 5]],
            
            // Flagship
            ['brand' => 'GIGABYTE', 'name' => 'GeForce RTX 4090 GAMING OC 24GB', 'min_price' => 48000000, 'max_price' => 52000000, 'specs' => ['vram' => '24GB', 'length_mm' => 340, 'tdp' => 450, 'recommended_psu' => 850, 'performance_tier' => 5]],
            ['brand' => 'MSI', 'name' => 'GeForce RTX 4090 SUPRIM X 24GB', 'min_price' => 52000000, 'max_price' => 56000000, 'specs' => ['vram' => '24GB', 'length_mm' => 336, 'tdp' => 450, 'recommended_psu' => 850, 'performance_tier' => 5]],
            
            // AMD Radeon
            ['brand' => 'Sapphire', 'name' => 'PULSE Radeon RX 6500 XT 4GB', 'min_price' => 3800000, 'max_price' => 4300000, 'specs' => ['vram' => '4GB', 'length_mm' => 193, 'tdp' => 107, 'recommended_psu' => 400, 'performance_tier' => 2]],
            ['brand' => 'PowerColor', 'name' => 'Fighter Radeon RX 6600 8GB', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['vram' => '8GB', 'length_mm' => 194, 'tdp' => 132, 'recommended_psu' => 450, 'performance_tier' => 2]],
            ['brand' => 'Sapphire', 'name' => 'NITRO+ Radeon RX 6700 XT 12GB', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['vram' => '12GB', 'length_mm' => 310, 'tdp' => 230, 'recommended_psu' => 650, 'performance_tier' => 3]],
            ['brand' => 'XFX', 'name' => 'Speedster MERC 319 Radeon RX 7900 XT 20GB', 'min_price' => 22000000, 'max_price' => 24000000, 'specs' => ['vram' => '20GB', 'length_mm' => 344, 'tdp' => 300, 'recommended_psu' => 750, 'performance_tier' => 5]],
            ['brand' => 'Sapphire', 'name' => 'NITRO+ Radeon RX 7900 XTX 24GB', 'min_price' => 28000000, 'max_price' => 30000000, 'specs' => ['vram' => '24GB', 'length_mm' => 320, 'tdp' => 355, 'recommended_psu' => 800, 'performance_tier' => 5]],
        ];

        $count = 0;
        foreach ($vgas as $vga) {
            Component::create([
                'category_id' => 4,
                'brand' => $vga['brand'],
                'name' => $vga['name'],
                'min_price' => $vga['min_price'],
                'max_price' => $vga['max_price'],
                'specifications' => $vga['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} VGAs");
    }
}
