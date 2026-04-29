# HƯỚNG DẪN NỘP BÁO CÁO
## Mô-đun Kiểm Tra Tương Thích Linh Kiện

---

## 1. YÊU CẦU CỦA BÀI TẬP

**Nhiệm vụ**: Cài đặt mô-đun kiểm tra tương thích linh kiện dựa trên hệ thống luật (Rule-Based Compatibility Engine)

**Phạm vi**: Xử lý các kiểm tra cơ bản:
- ✅ Socket CPU ↔ Mainboard
- ✅ Chuẩn RAM (DDR4/DDR5) ↔ Mainboard hỗ trợ
- ✅ Công suất PSU ≥ TDP (CPU + GPU + buffer)
- ✅ Kích thước GPU (chiều dài) ≤ Case tối đa

**Thời gian**: 2-3 tuần

---

## 2. DANH SÁCH FILE CẦN NỘP (BẮT BUỘC)

### Cấu Trúc Thư Mục Backend

```
pc-builder-backend/
├── app/
│   ├── Models/
│   │   └── CompatibilityRule.php          [1] Model
│   ├── Services/
│   │   └── CompatibilityService.php       [2] Service Logic
│   └── Http/
│       └── Controllers/Api/
│           └── CompatibilityController.php [3] API Controller
├── database/
│   ├── migrations/
│   │   └── YYYY_MM_DD_create_compatibility_rules_table.php  [4] Migration
│   └── seeders/
│       └── CompatibilityRuleSeeder.php    [5] Seeder
├── routes/
│   └── api.php                            [6] Thêm route
└── tests/
    └── Unit/
        └── CompatibilityServiceTest.php   [7] Unit Test
```

---

## 3. MÔ TẢ CHI TIẾT: 7 FILE CẦN TẠO

### [1] Model: CompatibilityRule.php

**Đường dẫn**: `app/Models/CompatibilityRule.php`

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompatibilityRule extends Model {
    protected $table = 'compatibility_rules';
    protected $fillable = ['rule_code', 'description', 'config', 'error_message', 'is_active'];
    protected $casts = [
        'config' => 'json',
        'is_active' => 'boolean',
    ];
    public $timestamps = false;
}
```

**Ghi chú**:
- Model này đơn giản, chỉ cần đọc dữ liệu từ DB
- Không cần relationship vì rules độc lập
- Cast `config` as JSON để dễ xử lý

---

### [2] Service: CompatibilityService.php

**Đường dẫn**: `app/Services/CompatibilityService.php`

**Yêu cầu**: Phải implement 5 methods chính:

```php
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
            
            // 2. Load tất cả active rules
            $rules = CompatibilityRule::where('is_active', true)->get();
            
            // 3. Kiểm tra từng rule
            $alerts = [];
            foreach ($rules as $rule) {
                $result = $this->checkRule($rule, $loadedComponents);
                if ($result !== null) {
                    $alerts[] = $result;
                }
            }
            
            // 4. Kiểm tra có lỗi (error type) không
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
    
    /**
     * [KIỂM TRA 3] Công suất PSU ≥ TDP hệ thống
     */
    private function checkPsuWattage(array $components, CompatibilityRule $rule): ?array {
        if (!isset($components['psu']) || (!isset($components['cpu']) && !isset($components['gpu']))) {
            return null;
        }
        
        $psu = $components['psu'];
        $cpuTdp = $components['cpu']->specifications['tdp'] ?? 0;
        $gpuTdp = $components['gpu']->specifications['tdp'] ?? 0;
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
```

---

### [3] Controller: CompatibilityController.php

**Đường dẫn**: `app/Http/Controllers/Api/CompatibilityController.php`

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CompatibilityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompatibilityController extends Controller {
    private $compatibilityService;
    
    public function __construct(CompatibilityService $compatibilityService) {
        $this->compatibilityService = $compatibilityService;
    }
    
    /**
     * POST /api/compatibility/check
     * Kiểm tra tương thích linh kiện
     */
    public function check(Request $request) {
        // 1. Validate input
        $validated = Validator::make($request->all(), [
            'components' => 'required|array',
            'components.cpu' => 'nullable|integer|exists:components,id',
            'components.mainboard' => 'nullable|integer|exists:components,id',
            'components.ram' => 'nullable|integer|exists:components,id',
            'components.gpu' => 'nullable|integer|exists:components,id',
            'components.psu' => 'nullable|integer|exists:components,id',
            'components.case' => 'nullable|integer|exists:components,id',
            'components.cooler' => 'nullable|integer|exists:components,id',
        ])->validate();
        
        try {
            // 2. Call service
            $result = $this->compatibilityService
                ->checkCompatibility($validated['components']);
            
            // 3. Return response
            return response()->json([
                'status' => 'success',
                'passed' => $result['passed'],
                'alerts' => $result['alerts'],
                'total_rules_checked' => $result['total_rules_checked']
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi kiểm tra tương thích',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

---

### [4] Migration

**Đường dẫn**: `database/migrations/YYYY_MM_DD_HHMMSS_create_compatibility_rules_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('compatibility_rules', function (Blueprint $table) {
            $table->id();
            $table->string('rule_code')->unique();
            $table->string('description');
            $table->json('config')->nullable();
            $table->text('error_message');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    
    public function down(): void {
        Schema::dropIfExists('compatibility_rules');
    }
};
```

---

### [5] Seeder

**Đường dẫn**: `database/seeders/CompatibilityRuleSeeder.php`

```php
<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompatibilityRuleSeeder extends Seeder {
    public function run(): void {
        DB::table('compatibility_rules')->insert([
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
        ]);
    }
}
```

---

### [6] Routes: api.php

**Thêm vào**: `routes/api.php`

```php
Route::post('/compatibility/check', [
    \App\Http\Controllers\Api\CompatibilityController::class,
    'check'
]);  // Public endpoint - không cần token
```

---

### [7] Unit Test

**Đường dẫn**: `tests/Unit/CompatibilityServiceTest.php`

```php
<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CompatibilityService;
use App\Models\Component;
use App\Models\CompatibilityRule;

class CompatibilityServiceTest extends TestCase {
    private $service;
    
    protected function setUp(): void {
        parent::setUp();
        $this->service = new CompatibilityService();
    }
    
    /** @test */
    public function test_socket_match_pass() {
        $result = $this->service->checkCompatibility([
            'cpu' => 1,
            'mainboard' => 5,
        ]);
        $this->assertTrue($result['passed']);
    }
    
    /** @test */
    public function test_psu_wattage_fail() {
        $result = $this->service->checkCompatibility([
            'cpu' => 1,
            'gpu' => 8,
            'psu' => 45,
        ]);
        $this->assertFalse($result['passed']);
    }
    
    /** @test */
    public function test_ram_type_mismatch() {
        $result = $this->service->checkCompatibility([
            'ram' => 3,
            'mainboard' => 5,
        ]);
        // Kiểm tra có RAM_TYPE error
        $errors = collect($result['alerts'])
            ->where('rule_code', 'RULE_RAM_TYPE_MATCH')
            ->count();
        $this->assertGreaterThan(0, $errors);
    }
    
    /** @test */
    public function test_bottleneck_warning() {
        $result = $this->service->checkCompatibility([
            'cpu' => 4,
            'gpu' => 15,
        ]);
        $warnings = collect($result['alerts'])
            ->where('type', 'warning')
            ->count();
        $this->assertGreaterThan(0, $warnings);
    }
}
```

---

## 4. CÁC FILE KHÁC CẦN SỬA/THÊM

### A. Update DatabaseSeeder.php

```php
public function run(): void {
    $this->call([
        // ... seeders khác
        CompatibilityRuleSeeder::class,  // Thêm dòng này
    ]);
}
```

### B. Update .env (nếu cần log chi tiết)

```env
LOG_CHANNEL=single
LOG_LEVEL=debug
```

---

## 5. BẢNG TÓM TẮT NỘI DUNG CẦN NỘP

| # | File | Loại | Bắt buộc? | Mô tả |
|----|------|------|----------|-------|
| 1 | `CompatibilityRule.php` | Model | ✅ | Model đọc rules từ DB |
| 2 | `CompatibilityService.php` | Service | ✅ | **Core logic** - 5+ kiểm tra |
| 3 | `CompatibilityController.php` | Controller | ✅ | API endpoint |
| 4 | `*_create_compatibility_rules_table.php` | Migration | ✅ | Tạo bảng DB |
| 5 | `CompatibilityRuleSeeder.php` | Seeder | ✅ | Insert rules |
| 6 | `routes/api.php` | Config | ✅ | Route POST |
| 7 | `CompatibilityServiceTest.php` | Test | ✅ | 4 unit tests |
| 8 | `DatabaseSeeder.php` | Config | ✅ | Thêm call seeder |
| 9 | Documentation | Markdown | ✅ | Báo cáo 8-10 trang |

---

## 6. CHU ẨN BỊ BÁO CÁO ĐỂ NỘP

### A. Cấu Trúc Báo Cáo (8-10 trang PDF/Word)

```
┌────────────────────────────────────────┐
│ BÁOÁO THỰC HIỆN MÔ-ĐUN KIỂM TRA TƯƠNG  │
│              THÍCH LINH KIỆN            │
│                                         │
│ 1. Giới Thiệu (1-2 trang)               │
│    - Mục tiêu, phạm vi bài tập          │
│    - 4 kiểm tra cơ bản                  │
│                                         │
│ 2. Thiết Kế Kiến Trúc (2-3 trang)      │
│    - Diagram Rule-Based Engine          │
│    - Luồng xử lý request                │
│    - Quan hệ giữa components            │
│                                         │
│ 3. Triển Khai Chi Tiết (3-4 trang)     │
│    - CompatibilityRule Model            │
│    - CompatibilityService (5 methods)   │
│    - CompatibilityController            │
│    - Database schema                    │
│                                         │
│ 4. Kết Quả Kiểm Thử (1-2 trang)        │
│    - Unit tests screenshot              │
│    - API test (Postman/curl)            │
│    - Test cases (pass/fail)             │
│                                         │
│ 5. API Documentation (1-2 trang)       │
│    - Endpoint: POST /api/compatibility  │
│    - Request/Response examples          │
│    - Error handling                     │
│                                         │
│ 6. Kết Luận & Hướng Phát Triển         │
│    - Những gì hoàn thành                │
│    - Có thể mở rộng thêm                │
│                                         │
│ Phụ Lục: Source Code                    │
└────────────────────────────────────────┘
```

### B. Nội Dung Chi Tiết Mỗi Phần

**Phần 1: Giới Thiệu**
- Yêu cầu: Cài đặt 4 kiểm tra
- Mục tiêu: Xây dựng rule-based engine có thể mở rộng
- Tại sao rule-based: Dễ thêm/sửa rule không cần sửa code

**Phần 2: Thiết Kế**
- Flow: Input → Load → Check → Output alerts
- Sơ đồ: Request → Service → DB → Response
- Lý do return type warning vs error

**Phần 3: Triển Khai**
- Giải thích từng hàm trong Service
- Cách query component từ DB
- Cách parse specifications JSON

**Phần 4: Testing**
- Test case 1: Socket khớp → PASS
- Test case 2: PSU không đủ → FAIL (error)
- Test case 3: CPU/GPU chênh lệch → WARNING
- Test case 4: Multiple violations → Return tất cả

**Phần 5: API Docs**
```
POST /api/compatibility/check

Request:
{
  "components": {
    "cpu": 1,
    "mainboard": 5,
    "ram": 3,
    "gpu": 8,
    "psu": 12,
    "case": 7
  }
}

Response:
{
  "status": "success",
  "passed": false,
  "alerts": [
    {
      "rule_code": "RULE_SOCKET_MATCH",
      "type": "error",
      "message": "Socket không khớp",
      "detail": "LGA1700 vs AM5"
    }
  ],
  "total_rules_checked": 7
}
```

---

## 7. CHECKLIST NỘP BÁO CÁO

- [ ] **Code Implementation**
  - [ ] CompatibilityRule.php
  - [ ] CompatibilityService.php (5+ methods)
  - [ ] CompatibilityController.php
  - [ ] Migration file
  - [ ] CompatibilityRuleSeeder.php
  - [ ] routes/api.php (thêm route)
  - [ ] DatabaseSeeder.php (thêm call)

- [ ] **Database**
  - [ ] Migration tạo bảng
  - [ ] Seeder với 7 rules
  - [ ] Update DatabaseSeeder

- [ ] **Testing**
  - [ ] Ít nhất 4 unit tests
  - [ ] Test pass và fail scenarios
  - [ ] Test warning vs error
  - [ ] Test results screenshot

- [ ] **Documentation**
  - [ ] Báo cáo PDF/Word (8-10 trang)
  - [ ] API examples
  - [ ] Database schema
  - [ ] Architecture diagram

- [ ] **Submission**
  - [ ] Source code (GitHub link hoặc ZIP)
  - [ ] Báo cáo PDF
  - [ ] Test results screenshot
  - [ ] README hướng dẫn chạy

---

## 8. HƯỚNG DẪN CHẠY THỬ TRÊN MÁY TÍNH

```bash
# 1. Di chuyển code vào project
cp CompatibilityRule.php app/Models/
cp CompatibilityService.php app/Services/
cp CompatibilityController.php app/Http/Controllers/Api/
cp *_create_compatibility_rules_table.php database/migrations/
cp CompatibilityRuleSeeder.php database/seeders/

# 2. Update DatabaseSeeder & routes/api.php

# 3. Chạy migration & seed
php artisan migrate --seed

# 4. Chạy tests
php artisan test tests/Unit/CompatibilityServiceTest.php

# 5. Test API
curl -X POST http://127.0.0.1:8000/api/compatibility/check \
  -H "Content-Type: application/json" \
  -d '{
    "components": {
      "cpu": 1,
      "mainboard": 5,
      "ram": 3,
      "gpu": 8,
      "psu": 12,
      "case": 7
    }
  }'

# 6. Screenshot kết quả
```

---

## 9. CÂU HỎI THƯỜNG GẶP

**Q1: Tôi có cần cài đặt cả 7 rules không?**

A: Bài tập yêu cầu 4 rules cơ bản. 7 rules là toàn bộ. Nên làm tất cả để show toàn bộ kiến trúc.

**Q2: Phải sửa component specifications không?**

A: Nên thêm trường như `socket`, `tdp`, `wattage`, `length_mm`, `supported_ram_types` vào mock data hoặc fixture.

**Q3: Báo cáo dài bao nhiêu?**

A: 8-12 trang tuỳ chi tiết. Phần code + diagram chiếm 50%, phần text 50%.

**Q4: Có cần frontend không?**

A: Bài tập chỉ yêu cầu backend. Frontend test qua curl/Postman.

**Q5: Tôi có thể copy code này không?**

A: Đây là template hướng dẫn. Sinh viên cần hiểu và customize theo data riêng.

---

## 10. SCORING RUBRIC (CÁCH CHẤM ĐIỂM)

| Tiêu Chí | Điểm | Chi Tiết |
|----------|------|---------|
| **Code Implementation** | 40% | ✅ 5 methods ✅ Error handling ✅ Code quality |
| **Database Design** | 15% | ✅ Migration ✅ Seeder ✅ Data structure |
| **Testing** | 15% | ✅ Unit tests ✅ Coverage ✅ Test cases |
| **Documentation** | 20% | ✅ Báo cáo ✅ API docs ✅ Diagram |
| **Functionality** | 10% | ✅ API hoạt động ✅ Xử lý lỗi ✅ Edge cases |
| **Total** | **100%** | |

---

*Hướng dẫn này cung cấp đầy đủ mọi thứ sinh viên cần biết để hoàn thành và nộp bài tập.*

*Tạo ngày 28/04/2026*
