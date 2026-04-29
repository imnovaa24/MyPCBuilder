<?php
namespace App\Services;

use App\Models\Component;
use App\Models\CompatibilityRule;
use Illuminate\Support\Facades\Log;

class CompatibilityService {
    
    /**
     * Kiểm tra tương thích linh kiện
     * @param array $components Mảng ID: {"cpu": 1, "mainboard": 5, "ram": 3, ...}
     * @return array {"passed": bool, "alerts": []}
     */
    public function checkCompatibility(array $components): array {
        try {
            // 1. Load components từ DB
            $loadedComponents = $this->loadComponents($components);
            
            // 2. Kiểm tra xem component request có tồn tại trong DB không
            foreach ($components as $key => $id) {
                if ($id !== null && !isset($loadedComponents[$key])) {
                    return [
                        'passed' => false,
                        'alerts' => [[
                            'rule_code' => 'COMPONENT_NOT_FOUND',
                            'type' => 'error',
                            'message' => "Component '$key' (ID: $id) không tồn tại trong hệ thống",
                        ]],
                        'total_rules_checked' => 0,
                    ];
                }
            }
            
            // 3. Load tất cả active rules
            $rules = CompatibilityRule::where('is_active', true)->get();
            
            // 4. Kiểm tra từng rule
            $alerts = [];
            foreach ($rules as $rule) {
                $result = $this->checkRule($rule, $loadedComponents);
                if ($result !== null) {
                    $alerts[] = $result;
                }
            }
            
            // 5. Kiểm tra có lỗi (error type) không
            $hasErrors = collect($alerts)
                ->where('type', 'error')
                ->count() > 0;
            
            return [
                'passed' => !$hasErrors,
                'alerts' => $alerts,
                'total_rules_checked' => count($rules),
            ];
            
        } catch (\Exception $e) {
            Log::error('Compatibility check error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
    
    /**
     * Load components từ DB theo ID
     */
    private function loadComponents(array $componentIds): array {
        $result = [];
        foreach ($componentIds as $key => $id) {
            $component = Component::find($id);
            if ($component && $component->deleted_at === null) {
                $result[$key] = $component;
            }
        }
        return $result;
    }
    
    /**
     * Kiểm tra một rule cụ thể
     */
    private function checkRule(CompatibilityRule $rule, array $components): ?array {
        switch ($rule->rule_code) {
            case 'RULE_SOCKET_MATCH':
                return $this->checkSocketMatch($components, $rule);
            
            case 'RULE_RAM_TYPE_MATCH':
                return $this->checkRamTypeMatch($components, $rule);
            
            case 'RULE_PSU_WATTAGE':
                return $this->checkPsuWattage($components, $rule);
            
            case 'RULE_VGA_CLEARANCE':
                return $this->checkVgaClearance($components, $rule);
            
            case 'RULE_COOLER_CLEARANCE':
                return $this->checkCoolerClearance($components, $rule);
            
            case 'RULE_MB_FORM_FACTOR':
                return $this->checkMbFormFactor($components, $rule);
            
            case 'RULE_BOTTLENECK_WARNING':
                return $this->checkBottleneck($components, $rule);
            
            default:
                return null;
        }
    }
    
    /**
     * [KIỂM TRA 1] Socket CPU ↔ Mainboard
     */
    private function checkSocketMatch(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['cpu']) || !isset($components['mainboard'])) {
            return null;
        }
        
        $cpu = $components['cpu'];
        $mainboard = $components['mainboard'];
        
        $cpuSocket = $cpu->specifications['socket'] ?? null;
        $mbSocket = $mainboard->specifications['socket'] ?? null;
        
        if (!$cpuSocket || !$mbSocket) {
            return null;
        }
        
        if ($cpuSocket !== $mbSocket) {
            return [
                'rule_code' => 'RULE_SOCKET_MATCH',
                'type' => 'error',
                'message' => $rule->error_message ?? 'Socket CPU và Mainboard không khớp!',
                'detail' => "CPU: {$cpuSocket} vs Mainboard: {$mbSocket}"
            ];
        }
        
        return null;  // PASS
    }
    
    /**
     * [KIỂM TRA 2] Chuẩn RAM ↔ Mainboard hỗ trợ
     */
    private function checkRamTypeMatch(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['ram']) || !isset($components['mainboard'])) {
            return null;
        }
        
        $ram = $components['ram'];
        $mainboard = $components['mainboard'];
        
        $ramType = $ram->specifications['type'] ?? null;  // DDR4, DDR5
        $mbSupportedRams = $mainboard->specifications['supported_ram_types'] ?? [];
        
        if (!$ramType) {
            return null;
        }
        
        if (!in_array($ramType, $mbSupportedRams)) {
            return [
                'rule_code' => 'RULE_RAM_TYPE_MATCH',
                'type' => 'error',
                'message' => $rule->error_message ?? 'Chuẩn RAM không tương thích!',
                'detail' => "RAM: {$ramType} nhưng Mainboard hỗ trợ: " . implode(', ', $mbSupportedRams)
            ];
        }
        
        return null;  // PASS
    }
    
    private function checkPsuWattage(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['psu']) || (!isset($components['cpu']) && !isset($components['gpu']))) {
            return null;
        }
        
        $psu = $components['psu'];
        $cpuTdp = isset($components['cpu']) ? ($components['cpu']->specifications['tdp'] ?? 0) : 0;
        $gpuTdp = isset($components['gpu']) ? ($components['gpu']->specifications['tdp'] ?? 0) : 0;
        $psuWattage = $psu->specifications['wattage'] ?? 0;
        
        $requiredWattage = $cpuTdp + $gpuTdp + 100;  // +100W buffer
        
        if ($psuWattage < $requiredWattage) {
            return [
                'rule_code' => 'RULE_PSU_WATTAGE',
                'type' => 'error',
                'message' => $rule->error_message ?? 'Công suất PSU không đủ!',
                'detail' => "PSU: {$psuWattage}W nhưng cần: {$requiredWattage}W (CPU: {$cpuTdp}W + GPU: {$gpuTdp}W + buffer: 100W)"
            ];
        }
        
        return null;  // PASS
    }
    
    /**
     * [KIỂM TRA 4] Kích thước GPU ↔ Case
     */
    private function checkVgaClearance(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['gpu']) || !isset($components['case'])) {
            return null;
        }
        
        $gpu = $components['gpu'];
        $case = $components['case'];
        
        $gpuLength = $gpu->specifications['length_mm'] ?? 0;
        $caseMaxLength = $case->specifications['max_gpu_length_mm'] ?? 0;
        
        if ($gpuLength > $caseMaxLength) {
            return [
                'rule_code' => 'RULE_VGA_CLEARANCE',
                'type' => 'error',
                'message' => $rule->error_message ?? 'GPU quá dài!',
                'detail' => "GPU: {$gpuLength}mm nhưng Case tối đa: {$caseMaxLength}mm"
            ];
        }
        
        return null;  // PASS
    }
    
    /**
     * Chiều cao CPU Cooler ↔ Case
     */
    private function checkCoolerClearance(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['cooler']) || !isset($components['case'])) {
            return null;
        }
        
        $cooler = $components['cooler'];
        $case = $components['case'];
        
        $coolerHeight = $cooler->specifications['height_mm'] ?? 0;
        $caseMaxHeight = $case->specifications['max_cooler_height_mm'] ?? 0;
        
        if ($coolerHeight > $caseMaxHeight) {
            return [
                'rule_code' => 'RULE_COOLER_CLEARANCE',
                'type' => 'error',
                'message' => $rule->error_message ?? 'Cooler quá cao!',
                'detail' => "Cooler: {$coolerHeight}mm nhưng Case tối đa: {$caseMaxHeight}mm"
            ];
        }
        
        return null;
    }
    
    /**
     * Form Factor Mainboard ↔ Case hỗ trợ
     */
    private function checkMbFormFactor(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['mainboard']) || !isset($components['case'])) {
            return null;
        }
        
        $mainboard = $components['mainboard'];
        $case = $components['case'];
        
        $mbFormFactor = $mainboard->specifications['form_factor'] ?? null;
        $caseSupported = $case->specifications['supported_form_factors'] ?? [];
        
        if (!in_array($mbFormFactor, $caseSupported)) {
            return [
                'rule_code' => 'RULE_MB_FORM_FACTOR',
                'type' => 'error',
                'message' => $rule->error_message ?? 'Form factor không tương thích!',
                'detail' => "Mainboard: {$mbFormFactor} nhưng Case hỗ trợ: " . implode(', ', $caseSupported)
            ];
        }
        
        return null;
    }
    
    /**
     * Cảnh báo Bottleneck
     */
    private function checkBottleneck(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['cpu']) || !isset($components['gpu'])) {
            return null;
        }
        
        $cpu = $components['cpu'];
        $gpu = $components['gpu'];
        
        $cpuTier = $cpu->specifications['performance_tier'] ?? 0;
        $gpuTier = $gpu->specifications['performance_tier'] ?? 0;
        
        if (abs($cpuTier - $gpuTier) > 1) {
            return [
                'rule_code' => 'RULE_BOTTLENECK_WARNING',
                'type' => 'warning',
                'message' => $rule->error_message ?? 'Cảnh báo: CPU và GPU chênh lệch hiệu năng!',
                'detail' => "CPU Tier: {$cpuTier}, GPU Tier: {$gpuTier}"
            ];
        }
        
        return null;
    }
}