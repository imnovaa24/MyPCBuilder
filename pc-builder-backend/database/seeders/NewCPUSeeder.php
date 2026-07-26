<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewCPUSeeder extends Seeder
{
    public function run(): void
    {
        $cpus = [
            // Intel 10th Gen (LGA1200)
            ['brand' => 'Intel', 'name' => 'Core i3-10100', 'min_price' => 2200000, 'max_price' => 2500000, 'specs' => ['socket' => 'LGA1200', 'cores' => 4, 'threads' => 8, 'tdp' => 65, 'base_frequency' => 3.6, 'has_igpu' => true, 'performance_tier' => 1]],
            ['brand' => 'Intel', 'name' => 'Core i5-10400', 'min_price' => 3200000, 'max_price' => 3600000, 'specs' => ['socket' => 'LGA1200', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 2.9, 'has_igpu' => true, 'performance_tier' => 2]],
            ['brand' => 'Intel', 'name' => 'Core i5-10600K', 'min_price' => 4500000, 'max_price' => 5000000, 'specs' => ['socket' => 'LGA1200', 'cores' => 6, 'threads' => 12, 'tdp' => 125, 'base_frequency' => 4.1, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'Intel', 'name' => 'Core i7-10700', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['socket' => 'LGA1200', 'cores' => 8, 'threads' => 16, 'tdp' => 65, 'base_frequency' => 2.9, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'Intel', 'name' => 'Core i9-10900K', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['socket' => 'LGA1200', 'cores' => 10, 'threads' => 20, 'tdp' => 125, 'base_frequency' => 3.7, 'has_igpu' => true, 'performance_tier' => 4]],
            
            // Intel 12th Gen (LGA1700)
            ['brand' => 'Intel', 'name' => 'Core i3-12100', 'min_price' => 2800000, 'max_price' => 3200000, 'specs' => ['socket' => 'LGA1700', 'cores' => 4, 'threads' => 8, 'tdp' => 60, 'base_frequency' => 3.3, 'has_igpu' => true, 'performance_tier' => 2]],
            ['brand' => 'Intel', 'name' => 'Core i3-12100F', 'min_price' => 2400000, 'max_price' => 2800000, 'specs' => ['socket' => 'LGA1700', 'cores' => 4, 'threads' => 8, 'tdp' => 58, 'base_frequency' => 3.3, 'has_igpu' => false, 'performance_tier' => 2]],
            ['brand' => 'Intel', 'name' => 'Core i5-12400', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['socket' => 'LGA1700', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 2.5, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'Intel', 'name' => 'Core i5-12600K', 'min_price' => 6200000, 'max_price' => 7000000, 'specs' => ['socket' => 'LGA1700', 'cores' => 10, 'threads' => 16, 'tdp' => 125, 'base_frequency' => 3.7, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'Intel', 'name' => 'Core i7-12700K', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['socket' => 'LGA1700', 'cores' => 12, 'threads' => 20, 'tdp' => 125, 'base_frequency' => 3.6, 'has_igpu' => true, 'performance_tier' => 4]],
            ['brand' => 'Intel', 'name' => 'Core i9-12900K', 'min_price' => 12000000, 'max_price' => 13500000, 'specs' => ['socket' => 'LGA1700', 'cores' => 16, 'threads' => 24, 'tdp' => 125, 'base_frequency' => 3.2, 'has_igpu' => true, 'performance_tier' => 5]],
            
            // Intel 13th Gen (LGA1700)
            ['brand' => 'Intel', 'name' => 'Core i3-13100', 'min_price' => 3200000, 'max_price' => 3600000, 'specs' => ['socket' => 'LGA1700', 'cores' => 4, 'threads' => 8, 'tdp' => 60, 'base_frequency' => 3.4, 'has_igpu' => true, 'performance_tier' => 2]],
            ['brand' => 'Intel', 'name' => 'Core i5-13400', 'min_price' => 4800000, 'max_price' => 5400000, 'specs' => ['socket' => 'LGA1700', 'cores' => 10, 'threads' => 16, 'tdp' => 65, 'base_frequency' => 2.5, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'Intel', 'name' => 'Core i5-13600K', 'min_price' => 7200000, 'max_price' => 8000000, 'specs' => ['socket' => 'LGA1700', 'cores' => 14, 'threads' => 20, 'tdp' => 125, 'base_frequency' => 3.5, 'has_igpu' => true, 'performance_tier' => 4]],
            ['brand' => 'Intel', 'name' => 'Core i9-13900K', 'min_price' => 14000000, 'max_price' => 15500000, 'specs' => ['socket' => 'LGA1700', 'cores' => 24, 'threads' => 32, 'tdp' => 125, 'base_frequency' => 3.0, 'has_igpu' => true, 'performance_tier' => 5]],
            
            // Intel 14th Gen (LGA1700)
            ['brand' => 'Intel', 'name' => 'Core i5-14400', 'min_price' => 5200000, 'max_price' => 5800000, 'specs' => ['socket' => 'LGA1700', 'cores' => 10, 'threads' => 16, 'tdp' => 65, 'base_frequency' => 2.5, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'Intel', 'name' => 'Core i5-14600K', 'min_price' => 7500000, 'max_price' => 8500000, 'specs' => ['socket' => 'LGA1700', 'cores' => 14, 'threads' => 20, 'tdp' => 125, 'base_frequency' => 3.5, 'has_igpu' => true, 'performance_tier' => 4]],
            ['brand' => 'Intel', 'name' => 'Core i7-14700K', 'min_price' => 10500000, 'max_price' => 11500000, 'specs' => ['socket' => 'LGA1700', 'cores' => 20, 'threads' => 28, 'tdp' => 125, 'base_frequency' => 3.4, 'has_igpu' => true, 'performance_tier' => 4]],
            ['brand' => 'Intel', 'name' => 'Core i9-14900K', 'min_price' => 15000000, 'max_price' => 16500000, 'specs' => ['socket' => 'LGA1700', 'cores' => 24, 'threads' => 32, 'tdp' => 125, 'base_frequency' => 3.2, 'has_igpu' => true, 'performance_tier' => 5]],
            
            // AMD Ryzen 3000 (AM4)
            ['brand' => 'AMD', 'name' => 'Ryzen 3 3100', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['socket' => 'AM4', 'cores' => 4, 'threads' => 8, 'tdp' => 65, 'base_frequency' => 3.6, 'has_igpu' => false, 'performance_tier' => 1]],
            ['brand' => 'AMD', 'name' => 'Ryzen 5 3600', 'min_price' => 3200000, 'max_price' => 3800000, 'specs' => ['socket' => 'AM4', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 3.6, 'has_igpu' => false, 'performance_tier' => 2]],
            ['brand' => 'AMD', 'name' => 'Ryzen 7 3700X', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['socket' => 'AM4', 'cores' => 8, 'threads' => 16, 'tdp' => 65, 'base_frequency' => 3.6, 'has_igpu' => false, 'performance_tier' => 3]],
            ['brand' => 'AMD', 'name' => 'Ryzen 9 3900X', 'min_price' => 8500000, 'max_price' => 9500000, 'specs' => ['socket' => 'AM4', 'cores' => 12, 'threads' => 24, 'tdp' => 105, 'base_frequency' => 3.8, 'has_igpu' => false, 'performance_tier' => 4]],
            
            // AMD Ryzen 5000 (AM4)
            ['brand' => 'AMD', 'name' => 'Ryzen 5 5500', 'min_price' => 3000000, 'max_price' => 3500000, 'specs' => ['socket' => 'AM4', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 3.6, 'has_igpu' => false, 'performance_tier' => 2]],
            ['brand' => 'AMD', 'name' => 'Ryzen 5 5600', 'min_price' => 3800000, 'max_price' => 4300000, 'specs' => ['socket' => 'AM4', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 3.5, 'has_igpu' => false, 'performance_tier' => 3]],
            ['brand' => 'AMD', 'name' => 'Ryzen 7 5700X', 'min_price' => 5200000, 'max_price' => 5800000, 'specs' => ['socket' => 'AM4', 'cores' => 8, 'threads' => 16, 'tdp' => 65, 'base_frequency' => 3.4, 'has_igpu' => false, 'performance_tier' => 3]],
            ['brand' => 'AMD', 'name' => 'Ryzen 7 5800X', 'min_price' => 6500000, 'max_price' => 7200000, 'specs' => ['socket' => 'AM4', 'cores' => 8, 'threads' => 16, 'tdp' => 105, 'base_frequency' => 3.8, 'has_igpu' => false, 'performance_tier' => 4]],
            ['brand' => 'AMD', 'name' => 'Ryzen 9 5900X', 'min_price' => 9500000, 'max_price' => 10500000, 'specs' => ['socket' => 'AM4', 'cores' => 12, 'threads' => 24, 'tdp' => 105, 'base_frequency' => 3.7, 'has_igpu' => false, 'performance_tier' => 4]],
            ['brand' => 'AMD', 'name' => 'Ryzen 9 5950X', 'min_price' => 12500000, 'max_price' => 14000000, 'specs' => ['socket' => 'AM4', 'cores' => 16, 'threads' => 32, 'tdp' => 105, 'base_frequency' => 3.4, 'has_igpu' => false, 'performance_tier' => 5]],
            
            // AMD Ryzen 7000 (AM5)
            ['brand' => 'AMD', 'name' => 'Ryzen 5 7500F', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['socket' => 'AM5', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 3.7, 'has_igpu' => false, 'performance_tier' => 3]],
            ['brand' => 'AMD', 'name' => 'Ryzen 5 7600', 'min_price' => 5200000, 'max_price' => 5800000, 'specs' => ['socket' => 'AM5', 'cores' => 6, 'threads' => 12, 'tdp' => 65, 'base_frequency' => 3.8, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'AMD', 'name' => 'Ryzen 5 7600X', 'min_price' => 6000000, 'max_price' => 6600000, 'specs' => ['socket' => 'AM5', 'cores' => 6, 'threads' => 12, 'tdp' => 105, 'base_frequency' => 4.7, 'has_igpu' => true, 'performance_tier' => 3]],
            ['brand' => 'AMD', 'name' => 'Ryzen 7 7700', 'min_price' => 7500000, 'max_price' => 8200000, 'specs' => ['socket' => 'AM5', 'cores' => 8, 'threads' => 16, 'tdp' => 65, 'base_frequency' => 3.8, 'has_igpu' => true, 'performance_tier' => 4]],
            ['brand' => 'AMD', 'name' => 'Ryzen 7 7700X', 'min_price' => 8500000, 'max_price' => 9200000, 'specs' => ['socket' => 'AM5', 'cores' => 8, 'threads' => 16, 'tdp' => 105, 'base_frequency' => 4.5, 'has_igpu' => true, 'performance_tier' => 4]],
            ['brand' => 'AMD', 'name' => 'Ryzen 9 7900', 'min_price' => 10500000, 'max_price' => 11500000, 'specs' => ['socket' => 'AM5', 'cores' => 12, 'threads' => 24, 'tdp' => 65, 'base_frequency' => 3.7, 'has_igpu' => true, 'performance_tier' => 4]],
            ['brand' => 'AMD', 'name' => 'Ryzen 9 7950X', 'min_price' => 14500000, 'max_price' => 16000000, 'specs' => ['socket' => 'AM5', 'cores' => 16, 'threads' => 32, 'tdp' => 170, 'base_frequency' => 4.5, 'has_igpu' => true, 'performance_tier' => 5]],
        ];

        $count = 0;
        foreach ($cpus as $cpu) {
            Component::create([
                'category_id' => 1,
                'brand' => $cpu['brand'],
                'name' => $cpu['name'],
                'min_price' => $cpu['min_price'],
                'max_price' => $cpu['max_price'],
                'specifications' => $cpu['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} CPUs");
    }
}
