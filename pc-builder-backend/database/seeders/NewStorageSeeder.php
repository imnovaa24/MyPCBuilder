<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class NewStorageSeeder extends Seeder
{
    public function run(): void
    {
        $storages = [
            // SATA SSD Budget
            ['brand' => 'Kingston', 'name' => 'A400 240GB', 'min_price' => 550000, 'max_price' => 700000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 240, 'read_speed' => 500, 'write_speed' => 350]],
            ['brand' => 'WD', 'name' => 'Green 240GB', 'min_price' => 520000, 'max_price' => 670000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 240, 'read_speed' => 545, 'write_speed' => 430]],
            ['brand' => 'Crucial', 'name' => 'BX500 240GB', 'min_price' => 500000, 'max_price' => 650000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 240, 'read_speed' => 540, 'write_speed' => 500]],
            
            // SATA SSD Mid
            ['brand' => 'Samsung', 'name' => '870 EVO 500GB', 'min_price' => 1400000, 'max_price' => 1700000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 500, 'read_speed' => 560, 'write_speed' => 530]],
            ['brand' => 'Crucial', 'name' => 'MX500 500GB', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 500, 'read_speed' => 560, 'write_speed' => 510]],
            ['brand' => 'WD', 'name' => 'Blue 500GB', 'min_price' => 1150000, 'max_price' => 1400000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 500, 'read_speed' => 560, 'write_speed' => 530]],
            
            // SATA SSD High Capacity
            ['brand' => 'Samsung', 'name' => '870 EVO 1TB', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 1000, 'read_speed' => 560, 'write_speed' => 530]],
            ['brand' => 'Crucial', 'name' => 'MX500 1TB', 'min_price' => 2100000, 'max_price' => 2500000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 1000, 'read_speed' => 560, 'write_speed' => 510]],
            ['brand' => 'Samsung', 'name' => '870 QVO 2TB', 'min_price' => 4000000, 'max_price' => 4600000, 'specs' => ['type' => 'SSD', 'form_factor' => '2.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 2000, 'read_speed' => 560, 'write_speed' => 530]],
            
            // NVMe PCIe 3.0 Budget
            ['brand' => 'Kingston', 'name' => 'NV2 500GB', 'min_price' => 750000, 'max_price' => 950000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 500, 'read_speed' => 3500, 'write_speed' => 2100]],
            ['brand' => 'WD', 'name' => 'Blue SN570 500GB', 'min_price' => 850000, 'max_price' => 1050000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 500, 'read_speed' => 3500, 'write_speed' => 2300]],
            ['brand' => 'Crucial', 'name' => 'P3 500GB', 'min_price' => 800000, 'max_price' => 1000000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 500, 'read_speed' => 3500, 'write_speed' => 1900]],
            
            // NVMe PCIe 3.0 1TB
            ['brand' => 'Kingston', 'name' => 'NV2 1TB', 'min_price' => 1300000, 'max_price' => 1600000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 1000, 'read_speed' => 3500, 'write_speed' => 2100]],
            ['brand' => 'WD', 'name' => 'Blue SN570 1TB', 'min_price' => 1500000, 'max_price' => 1800000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 1000, 'read_speed' => 3500, 'write_speed' => 3000]],
            ['brand' => 'Samsung', 'name' => '970 EVO Plus 1TB', 'min_price' => 2500000, 'max_price' => 2900000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 3.0 x4', 'capacity_gb' => 1000, 'read_speed' => 3500, 'write_speed' => 3300]],
            
            // NVMe PCIe 4.0 Mid
            ['brand' => 'Samsung', 'name' => '980 PRO 500GB', 'min_price' => 2000000, 'max_price' => 2400000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 500, 'read_speed' => 6900, 'write_speed' => 5000]],
            ['brand' => 'WD', 'name' => 'Black SN850X 1TB', 'min_price' => 3000000, 'max_price' => 3500000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 1000, 'read_speed' => 7300, 'write_speed' => 6300]],
            ['brand' => 'Seagate', 'name' => 'FireCuda 530 1TB', 'min_price' => 3200000, 'max_price' => 3700000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 1000, 'read_speed' => 7300, 'write_speed' => 6000]],
            ['brand' => 'Corsair', 'name' => 'MP600 PRO XT 1TB', 'min_price' => 3100000, 'max_price' => 3600000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 1000, 'read_speed' => 7100, 'write_speed' => 5800]],
            ['brand' => 'Crucial', 'name' => 'P5 Plus 1TB', 'min_price' => 2400000, 'max_price' => 2800000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 1000, 'read_speed' => 6600, 'write_speed' => 5000]],
            
            // NVMe PCIe 4.0 High Capacity
            ['brand' => 'Samsung', 'name' => '980 PRO 2TB', 'min_price' => 5000000, 'max_price' => 5700000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 2000, 'read_speed' => 7000, 'write_speed' => 5100]],
            ['brand' => 'WD', 'name' => 'Black SN850X 2TB', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 2000, 'read_speed' => 7300, 'write_speed' => 6600]],
            ['brand' => 'Seagate', 'name' => 'FireCuda 530 2TB', 'min_price' => 5800000, 'max_price' => 6500000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 4.0 x4', 'capacity_gb' => 2000, 'read_speed' => 7300, 'write_speed' => 6900]],
            
            // NVMe PCIe 5.0
            ['brand' => 'Crucial', 'name' => 'T700 1TB', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 5.0 x4', 'capacity_gb' => 1000, 'read_speed' => 11700, 'write_speed' => 9500]],
            ['brand' => 'Corsair', 'name' => 'MP700 1TB', 'min_price' => 5200000, 'max_price' => 5900000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 5.0 x4', 'capacity_gb' => 1000, 'read_speed' => 10000, 'write_speed' => 9500]],
            ['brand' => 'Seagate', 'name' => 'FireCuda 540 1TB', 'min_price' => 5000000, 'max_price' => 5700000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 5.0 x4', 'capacity_gb' => 1000, 'read_speed' => 10000, 'write_speed' => 10000]],
            ['brand' => 'Crucial', 'name' => 'T700 2TB', 'min_price' => 9500000, 'max_price' => 10500000, 'specs' => ['type' => 'SSD', 'form_factor' => 'M.2', 'interface' => 'PCIe 5.0 x4', 'capacity_gb' => 2000, 'read_speed' => 12400, 'write_speed' => 11800]],
            
            // HDD Budget
            ['brand' => 'WD', 'name' => 'Blue 1TB', 'min_price' => 850000, 'max_price' => 1050000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 1000, 'read_speed' => 150, 'write_speed' => 150]],
            ['brand' => 'Seagate', 'name' => 'Barracuda 1TB', 'min_price' => 900000, 'max_price' => 1100000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 1000, 'read_speed' => 190, 'write_speed' => 190]],
            ['brand' => 'Toshiba', 'name' => 'DT01ACA100 1TB', 'min_price' => 800000, 'max_price' => 1000000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 1000, 'read_speed' => 156, 'write_speed' => 156]],
            
            // HDD Mid Capacity
            ['brand' => 'WD', 'name' => 'Blue 2TB', 'min_price' => 1200000, 'max_price' => 1450000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 2000, 'read_speed' => 175, 'write_speed' => 175]],
            ['brand' => 'Seagate', 'name' => 'Barracuda 4TB', 'min_price' => 2200000, 'max_price' => 2600000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 4000, 'read_speed' => 190, 'write_speed' => 190]],
            ['brand' => 'WD', 'name' => 'Black 4TB', 'min_price' => 4200000, 'max_price' => 4800000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 4000, 'read_speed' => 227, 'write_speed' => 227]],
            ['brand' => 'Toshiba', 'name' => 'X300 4TB', 'min_price' => 2800000, 'max_price' => 3300000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 4000, 'read_speed' => 220, 'write_speed' => 220]],
            
            // HDD High Capacity
            ['brand' => 'Seagate', 'name' => 'Barracuda 8TB', 'min_price' => 4500000, 'max_price' => 5200000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 8000, 'read_speed' => 190, 'write_speed' => 190]],
            ['brand' => 'WD', 'name' => 'Red Plus 8TB', 'min_price' => 5500000, 'max_price' => 6200000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 8000, 'read_speed' => 215, 'write_speed' => 215]],
            ['brand' => 'Seagate', 'name' => 'IronWolf 8TB', 'min_price' => 5800000, 'max_price' => 6500000, 'specs' => ['type' => 'HDD', 'form_factor' => '3.5 inch', 'interface' => 'SATA III', 'capacity_gb' => 8000, 'read_speed' => 210, 'write_speed' => 210]],
        ];

        $count = 0;
        foreach ($storages as $storage) {
            Component::create([
                'category_id' => 8,
                'brand' => $storage['brand'],
                'name' => $storage['name'],
                'min_price' => $storage['min_price'],
                'max_price' => $storage['max_price'],
                'specifications' => $storage['specs'],
            ]);
            $count++;
        }
        $this->command->info("Added {$count} Storage devices");
    }
}
