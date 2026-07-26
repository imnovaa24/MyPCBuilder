<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewMainboardSeeder extends Seeder
{
    public function run(): void
    {
        $mainboards = [
            // LGA1200 Boards
            ['brand' => 'GIGABYTE', 'name' => 'H410M H V3', 'min_price' => 1500000, 'max_price' => 1800000, 'specs' => ['socket' => 'LGA1200', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'MSI', 'name' => 'H410M-A PRO', 'min_price' => 1600000, 'max_price' => 1900000, 'specs' => ['socket' => 'LGA1200', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'ASUS', 'name' => 'PRIME B460M-A', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['socket' => 'LGA1200', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'B460M DS3H V2', 'min_price' => 2000000, 'max_price' => 2400000, 'specs' => ['socket' => 'LGA1200', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'MSI', 'name' => 'MAG Z490 TOMAHAWK', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['socket' => 'LGA1200', 'form_factor' => 'ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            
            // LGA1700 DDR4 Boards
            ['brand' => 'GIGABYTE', 'name' => 'H610M H DDR4', 'min_price' => 1800000, 'max_price' => 2200000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'MSI', 'name' => 'PRO H610M-B DDR4', 'min_price' => 1900000, 'max_price' => 2300000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'ASUS', 'name' => 'PRIME B660M-A D4', 'min_price' => 3200000, 'max_price' => 3800000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'B660M DS3H DDR4', 'min_price' => 2800000, 'max_price' => 3300000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'MSI', 'name' => 'PRO B660M-A DDR4', 'min_price' => 3000000, 'max_price' => 3500000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            
            // LGA1700 DDR5 Boards
            ['brand' => 'GIGABYTE', 'name' => 'B660M DS3H AX DDR5', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 2]],
            ['brand' => 'ASUS', 'name' => 'PRIME B660M-A WIFI D5', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'MSI', 'name' => 'MAG B660 TOMAHAWK WIFI DDR5', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'ASUS', 'name' => 'ROG STRIX B660-F GAMING WIFI', 'min_price' => 6500000, 'max_price' => 7200000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'Z690 AORUS ELITE AX DDR5', 'min_price' => 7500000, 'max_price' => 8500000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'MSI', 'name' => 'MEG Z690 UNIFY', 'min_price' => 12000000, 'max_price' => 13500000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'ASUS', 'name' => 'ROG MAXIMUS Z690 HERO', 'min_price' => 15000000, 'max_price' => 17000000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'Z790 AORUS MASTER', 'min_price' => 12500000, 'max_price' => 14000000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'MSI', 'name' => 'MEG Z790 ACE', 'min_price' => 16000000, 'max_price' => 18000000, 'specs' => ['socket' => 'LGA1700', 'form_factor' => 'E-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            
            // AM4 Boards
            ['brand' => 'GIGABYTE', 'name' => 'A520M DS3H', 'min_price' => 1600000, 'max_price' => 1900000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'MSI', 'name' => 'A520M-A PRO', 'min_price' => 1700000, 'max_price' => 2000000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'ASUS', 'name' => 'PRIME A520M-K', 'min_price' => 1800000, 'max_price' => 2100000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 2]],
            ['brand' => 'GIGABYTE', 'name' => 'B450M DS3H V2', 'min_price' => 1800000, 'max_price' => 2200000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            ['brand' => 'MSI', 'name' => 'B450M MORTAR MAX', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            ['brand' => 'ASUS', 'name' => 'TUF GAMING B550M-PLUS', 'min_price' => 3200000, 'max_price' => 3700000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'B550 AORUS PRO AC', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            ['brand' => 'MSI', 'name' => 'MAG X570S TOMAHAWK MAX WIFI', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            ['brand' => 'ASUS', 'name' => 'ROG CROSSHAIR VIII HERO', 'min_price' => 9500000, 'max_price' => 10500000, 'specs' => ['socket' => 'AM4', 'form_factor' => 'ATX', 'ram_type' => 'DDR4', 'ram_slots' => 4]],
            
            // AM5 Boards
            ['brand' => 'GIGABYTE', 'name' => 'A620M GAMING X', 'min_price' => 2800000, 'max_price' => 3200000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 2]],
            ['brand' => 'MSI', 'name' => 'PRO A620M-E', 'min_price' => 2600000, 'max_price' => 3000000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 2]],
            ['brand' => 'ASUS', 'name' => 'PRIME A620M-K', 'min_price' => 2700000, 'max_price' => 3100000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 2]],
            ['brand' => 'GIGABYTE', 'name' => 'B650M DS3H', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'Micro-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'MSI', 'name' => 'MAG B650 TOMAHAWK WIFI', 'min_price' => 5800000, 'max_price' => 6500000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'ASUS', 'name' => 'TUF GAMING B650-PLUS WIFI', 'min_price' => 5200000, 'max_price' => 5800000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'GIGABYTE', 'name' => 'X670E AORUS MASTER', 'min_price' => 12000000, 'max_price' => 13500000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'MSI', 'name' => 'MEG X670E ACE', 'min_price' => 16000000, 'max_price' => 18000000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'E-ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
            ['brand' => 'ASUS', 'name' => 'ROG CROSSHAIR X670E HERO', 'min_price' => 17000000, 'max_price' => 19000000, 'specs' => ['socket' => 'AM5', 'form_factor' => 'ATX', 'ram_type' => 'DDR5', 'ram_slots' => 4]],
        ];

        $count = 0;
        foreach ($mainboards as $mb) {
            Component::create([
                'category_id' => 2,
                'brand' => $mb['brand'],
                'name' => $mb['name'],
                'min_price' => $mb['min_price'],
                'max_price' => $mb['max_price'],
                'specifications' => $mb['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} Mainboards");
    }
}
