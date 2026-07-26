<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewCoolerSeeder extends Seeder
{
    public function run(): void
    {
        $coolers = [
            // Budget Air Coolers
            ['brand' => 'DeepCool', 'name' => 'GAMMAXX 400 V2', 'min_price' => 450000, 'max_price' => 600000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 155, 'radiator_size_mm' => 0, 'tdp_rating' => 180]],
            ['brand' => 'Cooler Master', 'name' => 'Hyper 212 Black', 'min_price' => 650000, 'max_price' => 800000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 159, 'radiator_size_mm' => 0, 'tdp_rating' => 200]],
            ['brand' => 'ID-Cooling', 'name' => 'SE-214-XT', 'min_price' => 400000, 'max_price' => 550000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 150, 'radiator_size_mm' => 0, 'tdp_rating' => 180]],
            ['brand' => 'Thermalright', 'name' => 'Assassin X 120 R SE', 'min_price' => 380000, 'max_price' => 500000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 148, 'radiator_size_mm' => 0, 'tdp_rating' => 150]],
            ['brand' => 'Arctic', 'name' => 'Freezer 34 eSports DUO', 'min_price' => 850000, 'max_price' => 1050000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 157, 'radiator_size_mm' => 0, 'tdp_rating' => 210]],
            
            // Mid-range Air Coolers
            ['brand' => 'be quiet!', 'name' => 'Pure Rock 2', 'min_price' => 900000, 'max_price' => 1100000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 155, 'radiator_size_mm' => 0, 'tdp_rating' => 150]],
            ['brand' => 'Noctua', 'name' => 'NH-U12S Redux', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 158, 'radiator_size_mm' => 0, 'tdp_rating' => 165]],
            ['brand' => 'Scythe', 'name' => 'Fuma 2 Rev.B', 'min_price' => 1400000, 'max_price' => 1700000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 155, 'radiator_size_mm' => 0, 'tdp_rating' => 220]],
            ['brand' => 'Thermalright', 'name' => 'Peerless Assassin 120 SE', 'min_price' => 850000, 'max_price' => 1050000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 155, 'radiator_size_mm' => 0, 'tdp_rating' => 260]],
            ['brand' => 'DeepCool', 'name' => 'AK620', 'min_price' => 1350000, 'max_price' => 1600000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 160, 'radiator_size_mm' => 0, 'tdp_rating' => 260]],
            
            // High-end Air Coolers
            ['brand' => 'Noctua', 'name' => 'NH-D15', 'min_price' => 2400000, 'max_price' => 2800000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 165, 'radiator_size_mm' => 0, 'tdp_rating' => 300]],
            ['brand' => 'be quiet!', 'name' => 'Dark Rock Pro 4', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 163, 'radiator_size_mm' => 0, 'tdp_rating' => 250]],
            ['brand' => 'Thermalright', 'name' => 'Frost Commander 140', 'min_price' => 1200000, 'max_price' => 1500000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 158, 'radiator_size_mm' => 0, 'tdp_rating' => 280]],
            ['brand' => 'Noctua', 'name' => 'NH-D15S chromax.black', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 160, 'radiator_size_mm' => 0, 'tdp_rating' => 250]],
            
            // 120mm AIO
            ['brand' => 'Cooler Master', 'name' => 'MasterLiquid ML120L V2', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 120, 'tdp_rating' => 180]],
            ['brand' => 'Arctic', 'name' => 'Liquid Freezer II 120', 'min_price' => 1500000, 'max_price' => 1800000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 53, 'radiator_size_mm' => 120, 'tdp_rating' => 200]],
            ['brand' => 'NZXT', 'name' => 'Kraken 120', 'min_price' => 1800000, 'max_price' => 2100000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 120, 'tdp_rating' => 180]],
            
            // 240mm AIO
            ['brand' => 'Corsair', 'name' => 'iCUE H100i Elite Capellix', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 52, 'radiator_size_mm' => 240, 'tdp_rating' => 250]],
            ['brand' => 'NZXT', 'name' => 'Kraken X53', 'min_price' => 3200000, 'max_price' => 3700000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 240, 'tdp_rating' => 250]],
            ['brand' => 'Arctic', 'name' => 'Liquid Freezer II 240', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 53, 'radiator_size_mm' => 240, 'tdp_rating' => 280]],
            ['brand' => 'be quiet!', 'name' => 'Pure Loop 2 240', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 54, 'radiator_size_mm' => 240, 'tdp_rating' => 250]],
            ['brand' => 'Lian Li', 'name' => 'GALAHAD 240', 'min_price' => 3000000, 'max_price' => 3500000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 240, 'tdp_rating' => 280]],
            ['brand' => 'DeepCool', 'name' => 'LE520', 'min_price' => 1800000, 'max_price' => 2200000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 240, 'tdp_rating' => 260]],
            
            // 280mm AIO
            ['brand' => 'Arctic', 'name' => 'Liquid Freezer II 280', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 53, 'radiator_size_mm' => 280, 'tdp_rating' => 300]],
            ['brand' => 'NZXT', 'name' => 'Kraken X63', 'min_price' => 3800000, 'max_price' => 4300000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 280, 'tdp_rating' => 300]],
            
            // 360mm AIO
            ['brand' => 'Corsair', 'name' => 'iCUE H150i Elite LCD XT', 'min_price' => 6500000, 'max_price' => 7300000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 52, 'radiator_size_mm' => 360, 'tdp_rating' => 350]],
            ['brand' => 'NZXT', 'name' => 'Kraken Z73', 'min_price' => 7000000, 'max_price' => 7800000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 360, 'tdp_rating' => 350]],
            ['brand' => 'Arctic', 'name' => 'Liquid Freezer II 360', 'min_price' => 2800000, 'max_price' => 3300000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 53, 'radiator_size_mm' => 360, 'tdp_rating' => 350]],
            ['brand' => 'be quiet!', 'name' => 'Silent Loop 2 360', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 54, 'radiator_size_mm' => 360, 'tdp_rating' => 350]],
            ['brand' => 'Lian Li', 'name' => 'GALAHAD II Trinity 360', 'min_price' => 4500000, 'max_price' => 5100000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 360, 'tdp_rating' => 350]],
            ['brand' => 'ASUS', 'name' => 'ROG RYUJIN II 360', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 360, 'tdp_rating' => 350]],
            ['brand' => 'MSI', 'name' => 'MEG CORELIQUID S360', 'min_price' => 7500000, 'max_price' => 8500000, 'specs' => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 55, 'radiator_size_mm' => 360, 'tdp_rating' => 350]],
            
            // Low-profile/ITX Coolers
            ['brand' => 'Noctua', 'name' => 'NH-L9i chromax.black', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200'], 'height_mm' => 37, 'radiator_size_mm' => 0, 'tdp_rating' => 65]],
            ['brand' => 'Noctua', 'name' => 'NH-L12S', 'min_price' => 1500000, 'max_price' => 1800000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 70, 'radiator_size_mm' => 0, 'tdp_rating' => 95]],
            ['brand' => 'Thermalright', 'name' => 'AXP90-X47', 'min_price' => 650000, 'max_price' => 850000, 'specs' => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'], 'height_mm' => 47, 'radiator_size_mm' => 0, 'tdp_rating' => 90]],
        ];

        $count = 0;
        foreach ($coolers as $cooler) {
            Component::create([
                'category_id' => 7,
                'brand' => $cooler['brand'],
                'name' => $cooler['name'],
                'min_price' => $cooler['min_price'],
                'max_price' => $cooler['max_price'],
                'specifications' => $cooler['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} Coolers");
    }
}
