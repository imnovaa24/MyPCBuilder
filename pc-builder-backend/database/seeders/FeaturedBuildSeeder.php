<?php

namespace Database\Seeders;

use App\Models\FeaturedBuild;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeaturedBuildSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Build 1: Starter Gaming (AMD AM4)
        FeaturedBuild::updateOrCreate(
            ['name' => 'Starter Gaming Build'],
            [
                'tag' => 'Gaming',
                'tag_color' => 'bg-primary',
                'subtitle' => '1080p Ultra Settings',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmEdO-aI08D8ZblWFWxZ4PCpeTs4t9sAeFX1iRkqgh_PZV2wgc6IoooTBgEnuR8nxSFWCMKpii3x2Wc1Kpuox2rjAMt0I6QKawrlg1_DXOyaBFZTdyGl_gc3ew0qaS4ayAivZ24c94gLfrA0Tap0KpUlRMPUVFvPe5ODZ3apESKiUEtTGQuHdyOX7seC8U1UlY5KldEdiH8xgcICzZXSeuIX1DZlHhKl2s36DFVugGDEVbQAC0QT9WO310eJUNWJMJ_ivDXkPurJcB',
                'rating' => 4.8,
                'component_ids' => [1 => 2, 2 => 4, 3 => 6, 4 => 7, 5 => 9, 6 => 12],
                'is_active' => true,
            ]
        );

        // Build 2: 1440p Powerhouse (Intel LGA1700)
        FeaturedBuild::updateOrCreate(
            ['name' => '1440p Powerhouse'],
            [
                'tag' => 'Performance',
                'tag_color' => 'bg-purple-600',
                'subtitle' => 'High FPS Gaming & Streaming',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv128iGVgmIdlQcT-zU1wHxTWWsF--3I_YNa4VAheUtac4LB1WoHpgL32psznaI70sHx2M8HhcHOMEprYG9CNxtTGMPUlidbJasMfIEgtA0l15HDKXnTaPi-zR70FC4Zbd9vXYp7T0FN_enKvsCMcTQx_QN2hYyX9issenSwAk-dZnjTQKqqIUQvEE5bR1YRlrV9UIDqnwDykws1e7FCtnOCKU-5eOKk7zKf3BFuCSlPyVcHoD-feQk6lFSjKWKBPLLMBQ8QmbP-j_',
                'rating' => 4.9,
                'component_ids' => [1 => 1, 2 => 3, 3 => 6, 4 => 7, 5 => 10, 6 => 11],
                'is_active' => true,
            ]
        );

        // Build 3: Creator Pro (Intel high-end)
        FeaturedBuild::updateOrCreate(
            ['name' => 'Creator Pro'],
            [
                'tag' => 'Workstation',
                'tag_color' => 'bg-teal-600',
                'subtitle' => 'Video Editing & 3D Render',
                'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx8gjVfOzFPP1SIez46FXGhRv7VD1UIpfsWvdU5y-aikw4RgKjsMkDshJFlNKFweZMwKF6J-g5cv2kHbKxwR_f1s3PbOJxFllnwY4RcqGsTrn9ucglyWS0fXAC84hUao75cMNBMLYPmT_i2LlR567403DYs3ds-VLx_m06sIE7pCcts4D1ID-sfE8PM-oej_Pi6iiLeI8BydjdKG_Ea2eynzumuyhL_ZGpo5_Kgu3Cv7elS070foUlwD1B8Eyg4hao67njDyjqW5RQ',
                'rating' => 5.0,
                'component_ids' => [1 => 17, 2 => 3, 3 => 6, 4 => 8, 5 => 10, 6 => 12],
                'is_active' => true,
            ]
        );
    }
}
