<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompatibilityRule;
use App\Models\Component;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompatibilityController extends Controller
{
    /**
     * Nhận danh sách component IDs từ build, load rules từ DB
     * và trả về kết quả kiểm tra tương thích.
     *
     * POST /api/compatibility/check
     * Body: { "components": { "cpu": 1, "mainboard": 3, "ram": 5, ... } }
     *       (key = category code, value = component id)
     */
    public function check(Request $request)
    {
        $request->validate([
            'components' => 'required|array',
        ]);

        $input = $request->input('components'); // { "cpu": 1, "mainboard": 3, ... }

        // Load category code map: id => code
        $categoryMap = DB::table('categories')->pluck('code', 'id')->toArray();
        // Reverse: code => id
        $codeToId = array_flip($categoryMap);

        // Load tất cả component được chọn, index theo category code
        $specs = [];
        foreach ($input as $categoryCode => $componentId) {
            if (!$componentId) continue;

            $component = Component::find($componentId);
            // ✅ FIX: Trả error nếu component không tồn tại
            if (!$component) {
                return response()->json([
                    'status' => 'success',
                    'alerts' => [[
                        'rule_code' => 'COMPONENT_NOT_FOUND',
                        'type' => 'error',
                        'message' => "Component '$categoryCode' (ID: $componentId) không tồn tại trong hệ thống",
                        'detail' => null,
                    ]],
                    'passed' => false,
                ]);
            }

            $specData = is_array($component->specifications)
                ? $component->specifications
                : json_decode($component->specifications, true);

            $specData = $specData ?? [];
            // Đính kèm tên và thương hiệu để dùng trong các rule theo tên
            $specData['_name']  = $component->name  ?? '';
            $specData['_brand'] = $component->brand ?? '';

            $specs[$categoryCode] = $specData;
        }

        // Load tất cả rules đang active
        $rules = CompatibilityRule::where('is_active', true)->get();

        $alerts = [];

        foreach ($rules as $rule) {
            $config = is_array($rule->config)
                ? $rule->config
                : json_decode($rule->config, true);

            if (!$config) continue;

            $result = $this->evaluateRule($rule->rule_code, $config, $specs);

            if ($result !== null) {
                $alerts[] = [
                    'rule_code' => $rule->rule_code,
                    'type' => $result['type'],
                    'message' => $rule->error_message,
                    'detail' => $result['detail'] ?? null,
                ];
            }
        }

        return response()->json([
            'status' => 'success',
            'alerts' => $alerts,
            'passed' => collect($alerts)->where('type', 'error')->isEmpty(),
        ]);
    }

    /**
     * Đánh giá từng rule dựa trên rule_code và config.
     * Trả về null nếu pass, hoặc mảng ['type' => 'error'|'warning', 'detail' => ...] nếu fail.
     */
    private function evaluateRule(string $ruleCode, array $config, array $specs): ?array
    {
        $operator = $config['operator'] ?? '==';

        switch ($ruleCode) {
            // ===== RULE 1: Socket CPU == Socket Mainboard =====
            case 'RULE_SOCKET_MATCH':
                return $this->evalSimpleMatch($specs, 'cpu', 'socket', 'mainboard', 'socket', $operator);

            // ===== RULE 2: RAM type == Mainboard RAM type =====
            case 'RULE_RAM_TYPE_MATCH':
                // RAM dùng field "type", mainboard dùng field "ram_type"
                if (!isset($specs['ram']) || !isset($specs['mainboard']['ram_type'])) {
                    return null;
                }
                $ramType = $specs['ram']['type'] ?? $specs['ram']['ram_type'] ?? null;
                if (!$ramType) return null;
                if (strtoupper($ramType) !== strtoupper($specs['mainboard']['ram_type'])) {
                    return [
                        'type'   => 'error',
                        'detail' => "RAM {$ramType} không tương thích với Mainboard hỗ trợ {$specs['mainboard']['ram_type']}.",
                    ];
                }
                return null;

            // ===== RULE 3: VGA length <= Case max VGA length =====
            case 'RULE_VGA_CLEARANCE':
                return $this->evalNumericCompare($specs, 'vga', 'length_mm', 'case', 'max_vga_length_mm', $operator, 'error');

            // ===== RULE 4: PSU wattage >= CPU TDP + VGA TDP + 100 =====
            case 'RULE_PSU_WATTAGE':
                return $this->evalPsuWattage($specs);

            // ===== RULE 5: Mainboard form_factor IN Case supported_mb =====
            case 'RULE_MB_FORM_FACTOR':
                return $this->evalFormFactor($specs);

            // ===== RULE 6: Cooler height <= Case max cooler height =====
            case 'RULE_COOLER_CLEARANCE':
                return $this->evalNumericCompare($specs, 'cooler', 'height_mm', 'case', 'max_cooler_height_mm', $operator, 'error');

            // ===== RULE 7: Bottleneck warning (tier difference) =====
            case 'RULE_BOTTLENECK_WARNING':
                return $this->evalBottleneck($specs);

            default:
                return null;
        }
    }

    /**
     * So sánh 2 giá trị string bằng nhau (== hoặc !=)
     */
    private function evalSimpleMatch(array $specs, string $cat1, string $field1, string $cat2, string $field2, string $operator): ?array
    {
        if (!isset($specs[$cat1][$field1]) || !isset($specs[$cat2][$field2])) {
            return null; // Chưa chọn đủ linh kiện để so sánh
        }

        $left = $specs[$cat1][$field1];
        $right = $specs[$cat2][$field2];

        $pass = ($operator === '==') ? ($left === $right) : ($left !== $right);

        if (!$pass) {
            return [
                'type' => 'error',
                'detail' => "{$cat1}.{$field1} ({$left}) vs {$cat2}.{$field2} ({$right})",
            ];
        }

        return null;
    }

    /**
     * So sánh 2 giá trị số (<=, >=, <, >)
     */
    private function evalNumericCompare(array $specs, string $cat1, string $field1, string $cat2, string $field2, string $operator, string $alertType = 'error'): ?array
    {
        if (!isset($specs[$cat1][$field1]) || !isset($specs[$cat2][$field2])) {
            return null;
        }

        $left = (float) $specs[$cat1][$field1];
        $right = (float) $specs[$cat2][$field2];

        $pass = match ($operator) {
            '<=' => $left <= $right,
            '>=' => $left >= $right,
            '<'  => $left < $right,
            '>'  => $left > $right,
            '==' => $left == $right,
            default => true,
        };

        if (!$pass) {
            return [
                'type' => $alertType,
                'detail' => "{$cat1}.{$field1} ({$left}) vs {$cat2}.{$field2} ({$right})",
            ];
        }

        return null;
    }

    /**
     * RULE_PSU_WATTAGE: psu.wattage >= cpu.tdp + vga.tdp + 100
     */
    private function evalPsuWattage(array $specs): ?array
    {
        if (!isset($specs['psu']['wattage'])) {
            return null;
        }

        $cpuTdp = (float) ($specs['cpu']['tdp'] ?? 0);
        $vgaTdp = (float) ($specs['vga']['tdp'] ?? 0);
        $totalRequired = $cpuTdp + $vgaTdp + 100;
        $psuWattage = (float) $specs['psu']['wattage'];

        if ($psuWattage < $totalRequired) {
            return [
                'type' => 'error',
                'detail' => "PSU {$psuWattage}W < tổng tải {$totalRequired}W (CPU {$cpuTdp}W + VGA {$vgaTdp}W + 100W hao phí)",
            ];
        }

        // Cảnh báo nếu headroom < 150W
        if ($psuWattage < $totalRequired + 150) {
            return [
                'type' => 'warning',
                'detail' => "PSU {$psuWattage}W khá sát tải so với mức an toàn đề xuất ({$totalRequired}W + 150W headroom)",
            ];
        }

        return null;
    }

    /**
     * RULE_MB_FORM_FACTOR: mainboard.form_factor IN case.supported_mb
     */
    private function evalFormFactor(array $specs): ?array
    {
        if (!isset($specs['mainboard']['form_factor']) || !isset($specs['case']['supported_form_factors'])) {
            return null;
        }

        $mbFormFactor = $specs['mainboard']['form_factor'];
        $supported = $specs['case']['supported_form_factors'];

        if (!is_array($supported)) {
            $supported = [$supported];
        }

        if (!in_array($mbFormFactor, $supported)) {
            return [
                'type' => 'error',
                'detail' => "Mainboard {$mbFormFactor} không nằm trong danh sách hỗ trợ của Case: " . implode(', ', $supported),
            ];
        }

        return null;
    }

    /**
     * RULE_BOTTLENECK_WARNING:
     * CPU tầm thấp (i3 / Ryzen 3) + VGA cao cấp (RTX 4080+ / RX 7800+)
     */
    private function evalBottleneck(array $specs): ?array
    {
        if (!isset($specs['cpu']) || !isset($specs['vga'])) {
            return null;
        }

        $cpuName  = strtolower(($specs['cpu']['_brand'] ?? '') . ' ' . ($specs['cpu']['_name'] ?? ''));
        $vgaName  = strtolower(($specs['vga']['_brand'] ?? '') . ' ' . ($specs['vga']['_name'] ?? ''));

        if (!$cpuName || !$vgaName) {
            return null;
        }

        // Phát hiện CPU tầm thấp: i3 hoặc Ryzen 3
        $isLowCpu = (bool) preg_match('/\bcore\s*i3\b|\bi3[-\s]|\bryzen\s*3\b/i', $cpuName);

        if (!$isLowCpu) {
            return null;
        }

        // Phát hiện VGA cao cấp:
        //   NVIDIA: RTX 4080, 4090, 5000-series trở lên
        //   AMD:    RX 7800, 7900, 9000-series trở lên
        $isHighEndGpu = (bool) preg_match(
            '/rtx\s*(40[89]\d|4090|50[0-9]{2})|rx\s*(7[89]\d{2}|79\d{2}|9\d{3})/i',
            $vgaName
        );

        if ($isHighEndGpu) {
            $cpuDisplay = trim(($specs['cpu']['_brand'] ?? '') . ' ' . ($specs['cpu']['_name'] ?? ''));
            $vgaDisplay = trim(($specs['vga']['_brand'] ?? '') . ' ' . ($specs['vga']['_name'] ?? ''));
            return [
                'type'   => 'warning',
                'detail' => "CPU {$cpuDisplay} có thể gây nghẽn cổ chai (bottleneck) với VGA {$vgaDisplay}.",
            ];
        }

        return null;
    }
}
