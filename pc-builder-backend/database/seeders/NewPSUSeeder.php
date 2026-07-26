<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewPSUSeeder extends Seeder
{
    public function run(): void
    {
        $psus = [
            // Entry Level
            ['brand' => 'Cooler Master', 'name' => 'MWE White 400W', 'min_price' => 700000, 'max_price' => 850000, 'specs' => ['wattage' => 400, 'efficiency' => '80 Plus', 'form_factor' => 'ATX']],
            ['brand' => 'Thermaltake', 'name' => 'Litepower 450W', 'min_price' => 650000, 'max_price' => 800000, 'specs' => ['wattage' => 450, 'efficiency' => '80 Plus', 'form_factor' => 'ATX']],
            ['brand' => 'EVGA', 'name' => 'W1 500W', 'min_price' => 750000, 'max_price' => 900000, 'specs' => ['wattage' => 500, 'efficiency' => '80 Plus', 'form_factor' => 'ATX']],
            ['brand' => 'be quiet!', 'name' => 'System Power 10 450W', 'min_price' => 900000, 'max_price' => 1100000, 'specs' => ['wattage' => 450, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            
            // Budget Bronze
            ['brand' => 'Cooler Master', 'name' => 'MWE Bronze V2 550W', 'min_price' => 1100000, 'max_price' => 1350000, 'specs' => ['wattage' => 550, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            ['brand' => 'Thermaltake', 'name' => 'Smart BX1 550W', 'min_price' => 1050000, 'max_price' => 1300000, 'specs' => ['wattage' => 550, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            ['brand' => 'EVGA', 'name' => 'BR 600W', 'min_price' => 1150000, 'max_price' => 1400000, 'specs' => ['wattage' => 600, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            ['brand' => 'Corsair', 'name' => 'CX550', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['wattage' => 550, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            ['brand' => 'Seasonic', 'name' => 'S12III 550W', 'min_price' => 1250000, 'max_price' => 1500000, 'specs' => ['wattage' => 550, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            ['brand' => 'MSI', 'name' => 'MAG A550BN', 'min_price' => 1100000, 'max_price' => 1350000, 'specs' => ['wattage' => 550, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            
            // Mid-range Bronze/Gold
            ['brand' => 'Cooler Master', 'name' => 'MWE Gold 650W', 'min_price' => 1800000, 'max_price' => 2100000, 'specs' => ['wattage' => 650, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'Corsair', 'name' => 'CX650M', 'min_price' => 1700000, 'max_price' => 2000000, 'specs' => ['wattage' => 650, 'efficiency' => '80 Plus Bronze', 'form_factor' => 'ATX']],
            ['brand' => 'EVGA', 'name' => 'SuperNOVA 650 GA', 'min_price' => 1900000, 'max_price' => 2200000, 'specs' => ['wattage' => 650, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'Seasonic', 'name' => 'CORE GM-650', 'min_price' => 1850000, 'max_price' => 2150000, 'specs' => ['wattage' => 650, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'be quiet!', 'name' => 'Pure Power 11 FM 650W', 'min_price' => 2000000, 'max_price' => 2350000, 'specs' => ['wattage' => 650, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'MSI', 'name' => 'MAG A650GL', 'min_price' => 1750000, 'max_price' => 2050000, 'specs' => ['wattage' => 650, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            
            // High-end Gold
            ['brand' => 'Corsair', 'name' => 'RM750', 'min_price' => 2400000, 'max_price' => 2800000, 'specs' => ['wattage' => 750, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'Seasonic', 'name' => 'FOCUS GX-750', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['wattage' => 750, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'EVGA', 'name' => 'SuperNOVA 750 G6', 'min_price' => 2350000, 'max_price' => 2750000, 'specs' => ['wattage' => 750, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'be quiet!', 'name' => 'Straight Power 11 750W', 'min_price' => 2600000, 'max_price' => 3000000, 'specs' => ['wattage' => 750, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'Cooler Master', 'name' => 'V750 Gold V2', 'min_price' => 2450000, 'max_price' => 2850000, 'specs' => ['wattage' => 750, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            
            // Premium Gold 850W+
            ['brand' => 'Corsair', 'name' => 'RM850x', 'min_price' => 3200000, 'max_price' => 3700000, 'specs' => ['wattage' => 850, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'Seasonic', 'name' => 'FOCUS GX-850', 'min_price' => 3100000, 'max_price' => 3600000, 'specs' => ['wattage' => 850, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'ASUS', 'name' => 'ROG STRIX 850G', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['wattage' => 850, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'MSI', 'name' => 'MEG Ai850G PCIE5', 'min_price' => 3800000, 'max_price' => 4300000, 'specs' => ['wattage' => 850, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'be quiet!', 'name' => 'Dark Power 12 850W', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['wattage' => 850, 'efficiency' => '80 Plus Titanium', 'form_factor' => 'ATX']],
            
            // High Power 1000W+
            ['brand' => 'Corsair', 'name' => 'RM1000x', 'min_price' => 4500000, 'max_price' => 5100000, 'specs' => ['wattage' => 1000, 'efficiency' => '80 Plus Gold', 'form_factor' => 'ATX']],
            ['brand' => 'Seasonic', 'name' => 'PRIME TX-1000', 'min_price' => 6500000, 'max_price' => 7300000, 'specs' => ['wattage' => 1000, 'efficiency' => '80 Plus Titanium', 'form_factor' => 'ATX']],
            ['brand' => 'EVGA', 'name' => 'SuperNOVA 1000 P6', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['wattage' => 1000, 'efficiency' => '80 Plus Platinum', 'form_factor' => 'ATX']],
            ['brand' => 'be quiet!', 'name' => 'Dark Power Pro 12 1200W', 'min_price' => 7500000, 'max_price' => 8500000, 'specs' => ['wattage' => 1200, 'efficiency' => '80 Plus Titanium', 'form_factor' => 'ATX']],
            
            // Extreme
            ['brand' => 'Corsair', 'name' => 'HX1200', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['wattage' => 1200, 'efficiency' => '80 Plus Platinum', 'form_factor' => 'ATX']],
            ['brand' => 'Seasonic', 'name' => 'PRIME PX-1300', 'min_price' => 7000000, 'max_price' => 7800000, 'specs' => ['wattage' => 1300, 'efficiency' => '80 Plus Platinum', 'form_factor' => 'ATX']],
            ['brand' => 'ASUS', 'name' => 'ROG THOR 1200P2', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['wattage' => 1200, 'efficiency' => '80 Plus Platinum', 'form_factor' => 'ATX']],
            ['brand' => 'Corsair', 'name' => 'AX1500i', 'min_price' => 10500000, 'max_price' => 12000000, 'specs' => ['wattage' => 1500, 'efficiency' => '80 Plus Titanium', 'form_factor' => 'ATX']],
            ['brand' => 'EVGA', 'name' => 'SuperNOVA 1600 T2', 'min_price' => 9500000, 'max_price' => 11000000, 'specs' => ['wattage' => 1600, 'efficiency' => '80 Plus Titanium', 'form_factor' => 'ATX']],
            
            // SFX Form Factor
            ['brand' => 'Corsair', 'name' => 'SF600 Platinum', 'min_price' => 2800000, 'max_price' => 3300000, 'specs' => ['wattage' => 600, 'efficiency' => '80 Plus Platinum', 'form_factor' => 'SFX']],
            ['brand' => 'Cooler Master', 'name' => 'V650 SFX Gold', 'min_price' => 2500000, 'max_price' => 3000000, 'specs' => ['wattage' => 650, 'efficiency' => '80 Plus Gold', 'form_factor' => 'SFX']],
            ['brand' => 'Silverstone', 'name' => 'SX750 Platinum', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['wattage' => 750, 'efficiency' => '80 Plus Platinum', 'form_factor' => 'SFX']],
        ];

        $count = 0;
        foreach ($psus as $psu) {
            Component::create([
                'category_id' => 5,
                'brand' => $psu['brand'],
                'name' => $psu['name'],
                'min_price' => $psu['min_price'],
                'max_price' => $psu['max_price'],
                'specifications' => $psu['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} PSUs");
    }
}
