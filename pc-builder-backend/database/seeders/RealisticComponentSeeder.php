<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

/**
 * Điền lại thông số kỹ thuật thực tế cho toàn bộ linh kiện hiện có.
 * Cập nhật theo ID (giữ nguyên brand/name/giá), chỉ ghi đè specifications.
 */
class RealisticComponentSeeder extends Seeder
{
    public function run(): void
    {
        $specs = [
            // ===== CPU (category 1) =====
            1  => ['socket' => 'LGA1200', 'cores' => 4,  'threads' => 8,  'tdp' => 65,  'base_frequency' => 3.7, 'has_igpu' => false, 'performance_tier' => 1],
            10 => ['socket' => 'AM4',     'cores' => 6,  'threads' => 12, 'tdp' => 65,  'base_frequency' => 3.7, 'has_igpu' => false, 'performance_tier' => 3],
            19 => ['socket' => 'LGA1700', 'cores' => 16, 'threads' => 24, 'tdp' => 125, 'base_frequency' => 3.4, 'has_igpu' => true,  'performance_tier' => 4],
            28 => ['socket' => 'AM5',     'cores' => 12, 'threads' => 24, 'tdp' => 170, 'base_frequency' => 4.7, 'has_igpu' => true,  'performance_tier' => 5],
            37 => ['socket' => 'sTR5',    'cores' => 24, 'threads' => 48, 'tdp' => 350, 'base_frequency' => 4.2, 'has_igpu' => false, 'performance_tier' => 5],
            46 => ['socket' => 'LGA4189', 'cores' => 28, 'threads' => 56, 'tdp' => 205, 'base_frequency' => 2.0, 'has_igpu' => false, 'performance_tier' => 4],
            55 => ['socket' => 'LGA1700', 'cores' => 6,  'threads' => 12, 'tdp' => 65,  'base_frequency' => 2.5, 'has_igpu' => false, 'performance_tier' => 3],

            // ===== Mainboard (category 2) =====
            2  => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2],
            5  => ['socket' => 'AM5',     'form_factor' => 'ATX',       'ram_type' => 'DDR5', 'ram_slots' => 4],
            11 => ['socket' => 'AM4',     'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4],
            20 => ['socket' => 'LGA1700', 'form_factor' => 'ATX',       'ram_type' => 'DDR5', 'ram_slots' => 4],
            29 => ['socket' => 'AM5',     'form_factor' => 'ATX',       'ram_type' => 'DDR5', 'ram_slots' => 4],
            38 => ['socket' => 'sTR5',    'form_factor' => 'E-ATX',     'ram_type' => 'DDR5', 'ram_slots' => 4],
            47 => ['socket' => 'LGA4189', 'form_factor' => 'ATX',       'ram_type' => 'DDR4', 'ram_slots' => 8],

            // ===== RAM (category 3) =====
            3  => ['type' => 'DDR4', 'capacity' => 16,  'bus_speed' => 3200, 'kit' => 2],
            21 => ['type' => 'DDR5', 'capacity' => 32,  'bus_speed' => 6000, 'kit' => 2],
            30 => ['type' => 'DDR5', 'capacity' => 64,  'bus_speed' => 6000, 'kit' => 2],
            39 => ['type' => 'DDR5', 'capacity' => 128, 'bus_speed' => 5600, 'kit' => 4],
            48 => ['type' => 'DDR4', 'capacity' => 64,  'bus_speed' => 3200, 'kit' => 2],

            // ===== VGA (category 4) =====
            4  => ['vram' => '2GB',  'length_mm' => 150, 'tdp' => 30,  'recommended_psu' => 300,  'performance_tier' => 1],
            8  => ['vram' => '24GB', 'length_mm' => 304, 'tdp' => 450, 'recommended_psu' => 850,  'performance_tier' => 5],
            13 => ['vram' => '12GB', 'length_mm' => 242, 'tdp' => 170, 'recommended_psu' => 550,  'performance_tier' => 3],
            22 => ['vram' => '12GB', 'length_mm' => 308, 'tdp' => 285, 'recommended_psu' => 700,  'performance_tier' => 4],
            31 => ['vram' => '16GB', 'length_mm' => 342, 'tdp' => 320, 'recommended_psu' => 750,  'performance_tier' => 5],
            40 => ['vram' => '24GB', 'length_mm' => 358, 'tdp' => 450, 'recommended_psu' => 1000, 'performance_tier' => 5],
            49 => ['vram' => '16GB', 'length_mm' => 267, 'tdp' => 140, 'recommended_psu' => 500,  'performance_tier' => 4],
            73 => ['vram' => '8GB',  'length_mm' => 200, 'tdp' => 115, 'recommended_psu' => 550,  'performance_tier' => 3],

            // ===== PSU (category 5) =====
            12 => ['wattage' => 450,  'efficiency' => '80 Plus',          'form_factor' => 'ATX'],
            14 => ['wattage' => 650,  'efficiency' => '80 Plus Bronze',   'form_factor' => 'ATX'],
            23 => ['wattage' => 850,  'efficiency' => '80 Plus Gold',     'form_factor' => 'ATX'],
            32 => ['wattage' => 1000, 'efficiency' => '80 Plus Platinum', 'form_factor' => 'ATX'],
            41 => ['wattage' => 1600, 'efficiency' => '80 Plus Titanium', 'form_factor' => 'ATX'],
            50 => ['wattage' => 1000, 'efficiency' => '80 Plus Titanium', 'form_factor' => 'ATX'],

            // ===== Case (category 6) =====
            6  => ['supported_form_factors' => ['Micro-ATX', 'Mini-ITX'],                  'max_vga_length_mm' => 250, 'max_cooler_height_mm' => 150],
            7  => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'],           'max_vga_length_mm' => 360, 'max_cooler_height_mm' => 185],
            15 => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'],           'max_vga_length_mm' => 381, 'max_cooler_height_mm' => 165],
            24 => ['supported_form_factors' => ['ATX', 'Micro-ATX', 'Mini-ITX'],           'max_vga_length_mm' => 360, 'max_cooler_height_mm' => 170],
            33 => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'],  'max_vga_length_mm' => 491, 'max_cooler_height_mm' => 185],
            42 => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX'],              'max_vga_length_mm' => 490, 'max_cooler_height_mm' => 198],
            51 => ['supported_form_factors' => ['E-ATX', 'ATX', 'Micro-ATX'],              'max_vga_length_mm' => 280, 'max_cooler_height_mm' => 148],

            // ===== Cooler (category 7) =====
            9  => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200'],                'height_mm' => 70,  'radiator_size_mm' => 0,   'tdp_rating' => 65],
            18 => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'],  'height_mm' => 155, 'radiator_size_mm' => 0,   'tdp_rating' => 220],
            27 => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'LGA1200', 'AM4', 'AM5'],  'height_mm' => 55,  'radiator_size_mm' => 240, 'tdp_rating' => 250],
            36 => ['type' => 'AIO Liquid', 'supported_sockets' => ['LGA1700', 'AM4', 'AM5'],             'height_mm' => 55,  'radiator_size_mm' => 360, 'tdp_rating' => 300],
            45 => ['type' => 'Air Cooler', 'supported_sockets' => ['sTR5'],                              'height_mm' => 165, 'radiator_size_mm' => 0,   'tdp_rating' => 350],
            54 => ['type' => 'Air Cooler', 'supported_sockets' => ['LGA4189'],                           'height_mm' => 110, 'radiator_size_mm' => 0,   'tdp_rating' => 250],

            // ===== Storage (category 8) =====
            16 => ['type' => 'SSD', 'form_factor' => 'M.2',      'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 500,   'read_speed' => 3100,  'write_speed' => 2600],
            17 => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III',    'capacity_gb' => 2000,  'read_speed' => 220,   'write_speed' => 210],
            25 => ['type' => 'SSD', 'form_factor' => 'M.2',      'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 1000,  'read_speed' => 7300,  'write_speed' => 6300],
            26 => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III',    'capacity_gb' => 4000,  'read_speed' => 227,   'write_speed' => 227],
            34 => ['type' => 'SSD', 'form_factor' => 'M.2',      'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 2000,  'read_speed' => 7450,  'write_speed' => 6900],
            35 => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III',    'capacity_gb' => 8000,  'read_speed' => 250,   'write_speed' => 250],
            43 => ['type' => 'SSD', 'form_factor' => 'M.2',      'interface' => 'PCIe 5.0 x4', 'capacity_gb' => 2000,  'read_speed' => 12400, 'write_speed' => 11800],
            44 => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III',    'capacity_gb' => 16000, 'read_speed' => 260,   'write_speed' => 260],
            52 => ['type' => 'SSD', 'form_factor' => 'M.2',      'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 960,   'read_speed' => 5000,  'write_speed' => 1400],
            53 => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III',    'capacity_gb' => 16000, 'read_speed' => 257,   'write_speed' => 257],
        ];

        $updated = 0;
        $missing = [];

        foreach ($specs as $id => $spec) {
            $component = Component::find($id);
            if (!$component) {
                $missing[] = $id;
                continue;
            }
            $component->specifications = $spec;
            $component->save();
            $updated++;
        }

        $this->command->info("Đã cập nhật thông số cho {$updated} linh kiện.");
        if ($missing) {
            $this->command->warn('Không tìm thấy ID: ' . implode(', ', $missing));
        }
    }
}
