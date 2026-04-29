<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            ['email' => 'buildermypc@gmail.com'],
            [
                'username' => 'admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
        $this->call([   
        // ... seeders khác
        CompatibilityRuleSeeder::class,  // Thêm dòng này
    ]);
    }
}
