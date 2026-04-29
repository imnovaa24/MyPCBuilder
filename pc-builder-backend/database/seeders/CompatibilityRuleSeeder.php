<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CompatibilityRule;

class CompatibilityRuleSeeder extends Seeder {
    public function run(): void {
        $rules = [
            [
                'rule_code' => 'RULE_SOCKET_MATCH',
                'description' => 'Kiểm tra socket CPU khớp Mainboard',
                'config' => json_encode(['type' => 'exact_match']),
                'error_message' => 'Socket CPU và Mainboard không khớp!',
                'is_active' => true,
            ],
            [
                'rule_code' => 'RULE_RAM_TYPE_MATCH',
                'description' => 'Kiểm tra chuẩn RAM tương thích',
                'config' => json_encode(['type' => 'array_contains']),
                'error_message' => 'Chuẩn RAM không tương thích!',
                'is_active' => true,
            ],
            [
                'rule_code' => 'RULE_PSU_WATTAGE',
                'description' => 'Kiểm tra công suất PSU đủ',
                'config' => json_encode(['buffer' => 100]),
                'error_message' => 'Công suất PSU không đủ!',
                'is_active' => true,
            ],
            [
                'rule_code' => 'RULE_VGA_CLEARANCE',
                'description' => 'Kiểm tra GPU vừa vào Case',
                'config' => json_encode(['type' => 'length_check']),
                'error_message' => 'GPU quá dài!',
                'is_active' => true,
            ],
            [
                'rule_code' => 'RULE_COOLER_CLEARANCE',
                'description' => 'Kiểm tra Cooler vừa vào Case',
                'config' => json_encode(['type' => 'height_check']),
                'error_message' => 'Cooler quá cao!',
                'is_active' => true,
            ],
            [
                'rule_code' => 'RULE_MB_FORM_FACTOR',
                'description' => 'Kiểm tra form factor tương thích',
                'config' => json_encode(['type' => 'array_contains']),
                'error_message' => 'Form factor không tương thích!',
                'is_active' => true,
            ],
            [
                'rule_code' => 'RULE_BOTTLENECK_WARNING',
                'description' => 'Cảnh báo bottleneck CPU/GPU',
                'config' => json_encode(['max_tier_difference' => 1]),
                'error_message' => 'Cảnh báo: CPU và GPU chênh lệch hiệu năng!',
                'is_active' => true,
            ],
        ];

        foreach ($rules as $rule) {
            CompatibilityRule::updateOrCreate(
                ['rule_code' => $rule['rule_code']],
                $rule
            );
        }
    }
}