<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewRAMSeeder extends Seeder
{
    public function run(): void
    {
        $rams = [
            // DDR4 Low-end
            ['brand' => 'Kingston', 'name' => 'ValueRAM 8GB DDR4 2666MHz', 'min_price' => 450000, 'max_price' => 550000, 'specs' => ['type' => 'DDR4', 'capacity' => 8, 'bus_speed' => 2666, 'kit' => 1]],
            ['brand' => 'Crucial', 'name' => 'Basics 8GB DDR4 2666MHz', 'min_price' => 420000, 'max_price' => 520000, 'specs' => ['type' => 'DDR4', 'capacity' => 8, 'bus_speed' => 2666, 'kit' => 1]],
            ['brand' => 'ADATA', 'name' => 'Premier 8GB DDR4 2666MHz', 'min_price' => 480000, 'max_price' => 580000, 'specs' => ['type' => 'DDR4', 'capacity' => 8, 'bus_speed' => 2666, 'kit' => 1]],
            
            // DDR4 Mid-range
            ['brand' => 'Kingston', 'name' => 'FURY Beast 16GB DDR4 3200MHz', 'min_price' => 950000, 'max_price' => 1100000, 'specs' => ['type' => 'DDR4', 'capacity' => 16, 'bus_speed' => 3200, 'kit' => 1]],
            ['brand' => 'Corsair', 'name' => 'Vengeance LPX 16GB (2x8GB) DDR4 3200MHz', 'min_price' => 1100000, 'max_price' => 1300000, 'specs' => ['type' => 'DDR4', 'capacity' => 16, 'bus_speed' => 3200, 'kit' => 2]],
            ['brand' => 'G.Skill', 'name' => 'Ripjaws V 16GB (2x8GB) DDR4 3200MHz', 'min_price' => 1050000, 'max_price' => 1250000, 'specs' => ['type' => 'DDR4', 'capacity' => 16, 'bus_speed' => 3200, 'kit' => 2]],
            ['brand' => 'TeamGroup', 'name' => 'T-Force Vulcan Z 16GB (2x8GB) DDR4 3200MHz', 'min_price' => 980000, 'max_price' => 1150000, 'specs' => ['type' => 'DDR4', 'capacity' => 16, 'bus_speed' => 3200, 'kit' => 2]],
            ['brand' => 'Patriot', 'name' => 'Viper Steel 16GB (2x8GB) DDR4 3200MHz', 'min_price' => 1020000, 'max_price' => 1200000, 'specs' => ['type' => 'DDR4', 'capacity' => 16, 'bus_speed' => 3200, 'kit' => 2]],
            
            // DDR4 High-end
            ['brand' => 'Corsair', 'name' => 'Vengeance RGB Pro 32GB (2x16GB) DDR4 3600MHz', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['type' => 'DDR4', 'capacity' => 32, 'bus_speed' => 3600, 'kit' => 2]],
            ['brand' => 'G.Skill', 'name' => 'Trident Z RGB 32GB (2x16GB) DDR4 3600MHz', 'min_price' => 2400000, 'max_price' => 2800000, 'specs' => ['type' => 'DDR4', 'capacity' => 32, 'bus_speed' => 3600, 'kit' => 2]],
            ['brand' => 'Kingston', 'name' => 'FURY Beast RGB 32GB (2x16GB) DDR4 3600MHz', 'min_price' => 2100000, 'max_price' => 2500000, 'specs' => ['type' => 'DDR4', 'capacity' => 32, 'bus_speed' => 3600, 'kit' => 2]],
            ['brand' => 'TeamGroup', 'name' => 'T-Force Delta RGB 32GB (2x16GB) DDR4 3600MHz', 'min_price' => 2000000, 'max_price' => 2400000, 'specs' => ['type' => 'DDR4', 'capacity' => 32, 'bus_speed' => 3600, 'kit' => 2]],
            ['brand' => 'G.Skill', 'name' => 'Trident Z Neo 64GB (2x32GB) DDR4 3600MHz', 'min_price' => 4500000, 'max_price' => 5200000, 'specs' => ['type' => 'DDR4', 'capacity' => 64, 'bus_speed' => 3600, 'kit' => 2]],
            
            // DDR5 Entry
            ['brand' => 'Kingston', 'name' => 'FURY Beast 16GB DDR5 4800MHz', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['type' => 'DDR5', 'capacity' => 16, 'bus_speed' => 4800, 'kit' => 1]],
            ['brand' => 'Crucial', 'name' => 'DDR5 16GB 4800MHz', 'min_price' => 1100000, 'max_price' => 1350000, 'specs' => ['type' => 'DDR5', 'capacity' => 16, 'bus_speed' => 4800, 'kit' => 1]],
            ['brand' => 'ADATA', 'name' => 'XPG Lancer 16GB DDR5 5200MHz', 'min_price' => 1300000, 'max_price' => 1550000, 'specs' => ['type' => 'DDR5', 'capacity' => 16, 'bus_speed' => 5200, 'kit' => 1]],
            
            // DDR5 Mid-range
            ['brand' => 'Corsair', 'name' => 'Vengeance 32GB (2x16GB) DDR5 5600MHz', 'min_price' => 2400000, 'max_price' => 2800000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 5600, 'kit' => 2]],
            ['brand' => 'G.Skill', 'name' => 'Trident Z5 32GB (2x16GB) DDR5 5600MHz', 'min_price' => 2600000, 'max_price' => 3000000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 5600, 'kit' => 2]],
            ['brand' => 'Kingston', 'name' => 'FURY Beast RGB 32GB (2x16GB) DDR5 5600MHz', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 5600, 'kit' => 2]],
            ['brand' => 'TeamGroup', 'name' => 'T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz', 'min_price' => 2800000, 'max_price' => 3200000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 6000, 'kit' => 2]],
            ['brand' => 'ADATA', 'name' => 'XPG Lancer RGB 32GB (2x16GB) DDR5 6000MHz', 'min_price' => 2700000, 'max_price' => 3100000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 6000, 'kit' => 2]],
            
            // DDR5 High-end
            ['brand' => 'G.Skill', 'name' => 'Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 6400, 'kit' => 2]],
            ['brand' => 'Corsair', 'name' => 'Dominator Platinum RGB 32GB (2x16GB) DDR5 6400MHz', 'min_price' => 4000000, 'max_price' => 4600000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 6400, 'kit' => 2]],
            ['brand' => 'Kingston', 'name' => 'FURY Renegade RGB 32GB (2x16GB) DDR5 6400MHz', 'min_price' => 3800000, 'max_price' => 4300000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 6400, 'kit' => 2]],
            ['brand' => 'G.Skill', 'name' => 'Trident Z5 RGB 64GB (2x32GB) DDR5 6000MHz', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['type' => 'DDR5', 'capacity' => 64, 'bus_speed' => 6000, 'kit' => 2]],
            ['brand' => 'Corsair', 'name' => 'Dominator Platinum RGB 64GB (2x32GB) DDR5 6000MHz', 'min_price' => 6000000, 'max_price' => 6800000, 'specs' => ['type' => 'DDR5', 'capacity' => 64, 'bus_speed' => 6000, 'kit' => 2]],
            ['brand' => 'TeamGroup', 'name' => 'T-Force Xtreem ARGB 64GB (2x32GB) DDR5 6400MHz', 'min_price' => 6500000, 'max_price' => 7300000, 'specs' => ['type' => 'DDR5', 'capacity' => 64, 'bus_speed' => 6400, 'kit' => 2]],
            
            // DDR5 Extreme
            ['brand' => 'G.Skill', 'name' => 'Trident Z5 RGB 32GB (2x16GB) DDR5 7200MHz', 'min_price' => 5000000, 'max_price' => 5700000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 7200, 'kit' => 2]],
            ['brand' => 'Kingston', 'name' => 'FURY Renegade 32GB (2x16GB) DDR5 7200MHz', 'min_price' => 4800000, 'max_price' => 5500000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 7200, 'kit' => 2]],
            ['brand' => 'Corsair', 'name' => 'Dominator Titanium 64GB (2x32GB) DDR5 6400MHz', 'min_price' => 8000000, 'max_price' => 9000000, 'specs' => ['type' => 'DDR5', 'capacity' => 64, 'bus_speed' => 6400, 'kit' => 2]],
            ['brand' => 'G.Skill', 'name' => 'Trident Z5 Royal 64GB (2x32GB) DDR5 6800MHz', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['type' => 'DDR5', 'capacity' => 64, 'bus_speed' => 6800, 'kit' => 2]],
            
            // Workstation/Server DDR5
            ['brand' => 'Kingston', 'name' => 'Server Premier 32GB DDR5 4800MHz ECC', 'min_price' => 3500000, 'max_price' => 4000000, 'specs' => ['type' => 'DDR5', 'capacity' => 32, 'bus_speed' => 4800, 'kit' => 1]],
            ['brand' => 'Samsung', 'name' => 'DDR5 64GB 4800MHz RDIMM ECC', 'min_price' => 6500000, 'max_price' => 7500000, 'specs' => ['type' => 'DDR5', 'capacity' => 64, 'bus_speed' => 4800, 'kit' => 1]],
            ['brand' => 'Micron', 'name' => 'DDR5 128GB (2x64GB) 4800MHz RDIMM ECC', 'min_price' => 14000000, 'max_price' => 16000000, 'specs' => ['type' => 'DDR5', 'capacity' => 128, 'bus_speed' => 4800, 'kit' => 2]],
        ];

        $count = 0;
        foreach ($rams as $ram) {
            Component::create([
                'category_id' => 3,
                'brand' => $ram['brand'],
                'name' => $ram['name'],
                'min_price' => $ram['min_price'],
                'max_price' => $ram['max_price'],
                'specifications' => $ram['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} RAMs");
    }
}
