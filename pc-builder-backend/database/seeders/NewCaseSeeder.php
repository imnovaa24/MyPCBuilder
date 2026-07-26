<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewCaseSeeder extends Seeder
{
    public function run(): void
    {
        $cases = [
            // Budget Micro-ATX
            ['brand' => 'Thermaltake', 'name' => 'Versa H18', 'min_price' => 700000, 'max_price' => 900000, 'specs' => ['supported_form_factors' => ['Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 350, 'max_cooler_height_mm' => 155]],
            ['brand' => 'Cooler Master', 'name' => 'MasterBox Q300L', 'min_price' => 850000, 'max_price' => 1050000, 'specs' => ['supported_form_factors' => ['Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 360, 'max_cooler_height_mm' => 157]],
            ['brand' => 'Deepcool', 'name' => 'MATREXX 40', 'min_price' => 750000, 'max_price' => 950000, 'specs' => ['supported_form_factors' => ['Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 320, 'max_cooler_height_mm' => 165]],
            ['brand' => 'Aerocool', 'name' => 'Cylon Mini', 'min_price' => 650000, 'max_price' => 850000, 'specs' => ['supported_form_factors' => ['Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 290, 'max_cooler_height_mm' => 148]],
            
            // Budget ATX
            ['brand' => 'Thermaltake', 'name' => 'Versa H17', 'min_price' => 650000, 'max_price' => 850000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 350, 'max_cooler_height_mm' => 155]],
            ['brand' => 'Deepcool', 'name' => 'CC560', 'min_price' => 900000, 'max_price' => 1100000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 370, 'max_cooler_height_mm' => 163]],
            ['brand' => 'Cougar', 'name' => 'MX330-G', 'min_price' => 850000, 'max_price' => 1050000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 350, 'max_cooler_height_mm' => 155]],
            ['brand' => 'Antec', 'name' => 'NX410', 'min_price' => 1100000, 'max_price' => 1350000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 360, 'max_cooler_height_mm' => 166]],
            
            // Mid-range ATX Airflow
            ['brand' => 'Corsair', 'name' => '275R Airflow', 'min_price' => 1500000, 'max_price' => 1800000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 370, 'max_cooler_height_mm' => 170]],
            ['brand' => 'Lian Li', 'name' => 'LANCOOL 215', 'min_price' => 1800000, 'max_price' => 2100000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 370, 'max_cooler_height_mm' => 166]],
            ['brand' => 'be quiet!', 'name' => 'Pure Base 500DX', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 369, 'max_cooler_height_mm' => 190]],
            ['brand' => 'Phanteks', 'name' => 'Eclipse P400A', 'min_price' => 1800000, 'max_price' => 2100000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 420, 'max_cooler_height_mm' => 160]],
            ['brand' => 'Cooler Master', 'name' => 'MasterBox TD500 Mesh', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 410, 'max_cooler_height_mm' => 165]],
            ['brand' => 'MSI', 'name' => 'MAG FORGE 100M', 'min_price' => 1400000, 'max_price' => 1700000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 330, 'max_cooler_height_mm' => 160]],
            
            // Premium ATX
            ['brand' => 'NZXT', 'name' => 'H5 Flow', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 365, 'max_cooler_height_mm' => 165]],
            ['brand' => 'Corsair', 'name' => '4000D Airflow', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 360, 'max_cooler_height_mm' => 170]],
            ['brand' => 'Lian Li', 'name' => 'LANCOOL II Mesh', 'min_price' => 2800000, 'max_price' => 3200000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 384, 'max_cooler_height_mm' => 176]],
            ['brand' => 'Fractal Design', 'name' => 'Meshify C', 'min_price' => 2400000, 'max_price' => 2800000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 315, 'max_cooler_height_mm' => 172]],
            ['brand' => 'Phanteks', 'name' => 'Eclipse G360A', 'min_price' => 2600000, 'max_price' => 3000000, 'specs' => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 400, 'max_cooler_height_mm' => 163]],
            ['brand' => 'be quiet!', 'name' => 'Silent Base 802', 'min_price' => 3800000, 'max_price' => 4300000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 432, 'max_cooler_height_mm' => 185]],
            
            // High-end ATX
            ['brand' => 'Corsair', 'name' => '5000D Airflow', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 400, 'max_cooler_height_mm' => 170]],
            ['brand' => 'Lian Li', 'name' => 'O11 Dynamic EVO', 'min_price' => 4000000, 'max_price' => 4600000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 420, 'max_cooler_height_mm' => 167]],
            ['brand' => 'NZXT', 'name' => 'H7 Elite', 'min_price' => 4500000, 'max_price' => 5100000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 400, 'max_cooler_height_mm' => 185]],
            ['brand' => 'Phanteks', 'name' => 'Enthoo Pro 2', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 503, 'max_cooler_height_mm' => 190]],
            ['brand' => 'Fractal Design', 'name' => 'Torrent', 'min_price' => 4800000, 'max_price' => 5400000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX'], 'max_vga_length_mm' => 461, 'max_cooler_height_mm' => 188]],
            
            // Flagship/Full Tower
            ['brand' => 'Corsair', 'name' => '7000D Airflow', 'min_price' => 6500000, 'max_price' => 7300000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 450, 'max_cooler_height_mm' => 190]],
            ['brand' => 'Lian Li', 'name' => 'O11 Dynamic XL', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 446, 'max_cooler_height_mm' => 167]],
            ['brand' => 'be quiet!', 'name' => 'Dark Base Pro 901', 'min_price' => 7500000, 'max_price' => 8500000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 495, 'max_cooler_height_mm' => 185]],
            ['brand' => 'Phanteks', 'name' => 'Enthoo Elite', 'min_price' => 12000000, 'max_price' => 14000000, 'specs' => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], 'max_vga_length_mm' => 503, 'max_cooler_height_mm' => 193]],
            
            // Mini-ITX/SFF
            ['brand' => 'NZXT', 'name' => 'H1 V2', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['supported_form_factors' => ['Mini-ITX'], 'max_vga_length_mm' => 324, 'max_cooler_height_mm' => 140]],
            ['brand' => 'Lian Li', 'name' => 'A4-H2O', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['supported_form_factors' => ['Mini-ITX'], 'max_vga_length_mm' => 320, 'max_cooler_height_mm' => 55]],
            ['brand' => 'Cooler Master', 'name' => 'NR200P', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['supported_form_factors' => ['Mini-ITX'], 'max_vga_length_mm' => 330, 'max_cooler_height_mm' => 153]],
            ['brand' => 'Fractal Design', 'name' => 'Terra', 'min_price' => 4500000, 'max_price' => 5100000, 'specs' => ['supported_form_factors' => ['Mini-ITX'], 'max_vga_length_mm' => 322, 'max_cooler_height_mm' => 77]],
            ['brand' => 'Ssupd', 'name' => 'Meshlicious', 'min_price' => 3200000, 'max_price' => 3700000, 'specs' => ['supported_form_factors' => ['Mini-ITX'], 'max_vga_length_mm' => 336, 'max_cooler_height_mm' => 70]],
            ['brand' => 'DAN Cases', 'name' => 'A4-SFX v4.1', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['supported_form_factors' => ['Mini-ITX'], 'max_vga_length_mm' => 295, 'max_cooler_height_mm' => 48]],
            ['brand' => 'FormD', 'name' => 'T1 v2', 'min_price' => 6500000, 'max_price' => 7300000, 'specs' => ['supported_form_factors' => ['Mini-ITX'], 'max_vga_length_mm' => 325, 'max_cooler_height_mm' => 68]],
        ];

        $count = 0;
        foreach ($cases as $case) {
            Component::create([
                'category_id' => 6,
                'brand' => $case['brand'],
                'name' => $case['name'],
                'min_price' => $case['min_price'],
                'max_price' => $case['max_price'],
                'specifications' => $case['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} Cases");
    }
}
