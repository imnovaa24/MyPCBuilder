<?php

return [
    'use_cases' => [
        'learning',
        'office',
        'development',
        'gaming',
        'graphics',
    ],

    'required_slots' => [
        'cpu',
        'mainboard',
        'ram',
        'vga',
        'storage',
        'psu',
        'case',
        'cooler',
    ],

    /*
     * Trọng số ưu tiên theo loại linh kiện cho từng use case (0-1).
     * ScoringService dùng kết hợp với thông số trong specifications JSON.
     */
    'category_weights' => [
        'learning' => [
            'cpu' => 0.30,
            'mainboard' => 0.10,
            'ram' => 0.25,
            'vga' => 0.15,
            'storage' => 0.10,
            'psu' => 0.05,
            'case' => 0.03,
            'cooler' => 0.02,
        ],
        'office' => [
            'cpu' => 0.20,
            'mainboard' => 0.10,
            'ram' => 0.30,
            'vga' => 0.05,
            'storage' => 0.15,
            'psu' => 0.10,
            'case' => 0.05,
            'cooler' => 0.05,
        ],
        'development' => [
            'cpu' => 0.35,
            'mainboard' => 0.10,
            'ram' => 0.40,
            'vga' => 0.10,
            'storage' => 0.15,
            'psu' => 0.05,
            'case' => 0.03,
            'cooler' => 0.02,
        ],
        'gaming' => [
            'cpu' => 0.30,
            'mainboard' => 0.08,
            'ram' => 0.20,
            'vga' => 0.50,
            'storage' => 0.05,
            'psu' => 0.10,
            'case' => 0.05,
            'cooler' => 0.07,
        ],
        'graphics' => [
            'cpu' => 0.35,
            'mainboard' => 0.08,
            'ram' => 0.45,
            'vga' => 0.20,
            'storage' => 0.30,
            'psu' => 0.10,
            'case' => 0.05,
            'cooler' => 0.05,
        ],
    ],
];
