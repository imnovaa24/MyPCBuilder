<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class New300ComponentsSeeder extends Seeder
{
    /**
     * Seed 300 new realistic components across all categories.
     * Distribution:
     * - CPU: 38
     * - Mainboard: 38
     * - RAM: 35
     * - VGA: 37
     * - PSU: 38
     * - Case: 37
     * - Cooler: 37
     * - Storage: 40
     * Total: 300
     */
    public function run(): void
    {
        $this->command->info('Starting to seed 300 new components...');
        
        $this->call([
            NewCPUSeeder::class,
            NewMainboardSeeder::class,
            NewRAMSeeder::class,
            NewVGASeeder::class,
            NewPSUSeeder::class,
            NewCaseSeeder::class,
            NewCoolerSeeder::class,
            NewStorageSeeder::class,
        ]);
        
        $this->command->info('Completed seeding 300 new components!');
    }
}
