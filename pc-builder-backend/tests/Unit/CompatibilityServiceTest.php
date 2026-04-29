<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CompatibilityService;
use App\Models\Component;
use App\Models\CompatibilityRule;
use Database\Factories\ComponentFactory;

class CompatibilityServiceTest extends TestCase {
    private $service;
    
    protected function setUp(): void {
        parent::setUp();
        $this->service = new CompatibilityService();
    }
    
    /** @test */
    public function test_socket_match_pass() {
        // Tạo CPU và Mainboard với socket khớp
        $cpu = Component::factory()->cpu()->create();
        $mainboard = Component::factory()->mainboard()->create();
        
        $result = $this->service->checkCompatibility([
            'cpu' => $cpu->id,
            'mainboard' => $mainboard->id,
        ]);
        
        $this->assertTrue($result['passed']);
    }
    
    /** @test */
    public function test_psu_wattage_fail() {
        // Tạo CPU high-end, GPU high-end, PSU yếu
        $cpu = Component::factory()->cpu()->create();
        $gpu = Component::factory()->gpu()->create();
        $psu = Component::factory()->psuLow()->create();  // 450W - không đủ
        
        $result = $this->service->checkCompatibility([
            'cpu' => $cpu->id,
            'gpu' => $gpu->id,
            'psu' => $psu->id,
        ]);
        
        // Phải fail vì PSU không đủ
        $this->assertFalse($result['passed']);
        
        // Kiểm tra có PSU error
        $psuErrors = collect($result['alerts'])
            ->where('rule_code', 'RULE_PSU_WATTAGE')
            ->count();
        $this->assertGreaterThan(0, $psuErrors);
    }
    
    /** @test */
    public function test_ram_type_mismatch() {
        // Tạo RAM DDR4 với Mainboard DDR5
        $ram = Component::factory()->ram()->state([
            'specifications' => ['type' => 'DDR4']
        ])->create();
        
        $mainboard = Component::factory()->mainboard()->create();  // Hỗ trợ DDR5
        
        $result = $this->service->checkCompatibility([
            'ram' => $ram->id,
            'mainboard' => $mainboard->id,
        ]);
        
        // Kiểm tra có RAM_TYPE error
        $errors = collect($result['alerts'])
            ->where('rule_code', 'RULE_RAM_TYPE_MATCH')
            ->count();
        $this->assertGreaterThan(0, $errors);
    }
    
    /** @test */
    public function test_bottleneck_warning() {
        // Tạo CPU cao cấp (tier 3) với GPU thấp cấp (tier 1)
        $cpu = Component::factory()->cpu()->create();  // tier 3
        $gpu = Component::factory()->gpuLow()->create();  // tier 1
        
        $result = $this->service->checkCompatibility([
            'cpu' => $cpu->id,
            'gpu' => $gpu->id,
        ]);
        
        // Phải có warning (không fail, nhưng có alert)
        $warnings = collect($result['alerts'])
            ->where('type', 'warning')
            ->count();
        $this->assertGreaterThan(0, $warnings);
    }
}