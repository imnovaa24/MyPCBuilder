# BÁO CÁO ĐỒ ÁN
## Xây Dựng Hệ Thống Backend & Thiết Kế API  
### Ứng Dụng Hỗ Trợ Truy Vấn Linh Kiện và Quản Lý Cấu Hình Máy Tính

---

| Thông tin | Nội dung |
|-----------|----------|
| **Tên đồ án** | PC Builder – Hệ thống lắp ráp & quản lý cấu hình máy tính |
| **Công nghệ Backend** | Laravel 13 (PHP), Laravel Sanctum |
| **Công nghệ Frontend** | React 19 + Vite |
| **Cơ sở dữ liệu** | MySQL |
| **Ngày hoàn thành** | Tháng 4, 2026 |

---

## MỤC LỤC

1. [Giới thiệu đề tài](#1-giới-thiệu-đề-tài)
2. [Phân tích yêu cầu hệ thống](#2-phân-tích-yêu-cầu-hệ-thống)
3. [Thiết kế cơ sở dữ liệu](#3-thiết-kế-cơ-sở-dữ-liệu)
4. [Thiết kế API](#4-thiết-kế-api)
5. [Kiến trúc Backend](#5-kiến-trúc-backend)
6. [Cơ chế xác thực & phân quyền](#6-cơ-chế-xác-thực--phân-quyền)
7. [Tính năng kiểm tra tương thích linh kiện](#7-tính-năng-kiểm-tra-tương-thích-linh-kiện)
8. [Hướng dẫn cài đặt & chạy dự án](#8-hướng-dẫn-cài-đặt--chạy-dự-án)
9. [Kết quả đạt được](#9-kết-quả-đạt-được)
10. [Kết luận](#10-kết-luận)
11. [Kế hoạch chi tiết: LLM API Hybrid Recommendation System](#11-kế-hoạch-chi-tiết-llm-api-hybrid-recommendation-system)
12. [Hướng dẫn nộp báo cáo: Mô-đun kiểm tra tương thích](#12-hướng-dẫn-nộp-báo-cáo-mô-đun-kiểm-tra-tương-thích)
11. [Kế hoạch: LLM API Hybrid Recommendation System](#11-kế-hoạch-chi-tiết-llm-api-hybrid-recommendation-system)
12. [Hướng dẫn nộp báo cáo: Mô-đun Kiểm Tra Tương Thích](#12-hướng-dẫn-nộp-báo-cáo-mô-đun-kiểm-tra-tương-thích)

---

## 1. GIỚI THIỆU ĐỀ TÀI

### 1.1 Bối cảnh

Thị trường linh kiện máy tính ngày càng đa dạng với hàng nghìn sản phẩm từ nhiều thương hiệu khác nhau. Người dùng, đặc biệt là những người mới bắt đầu, thường gặp khó khăn trong việc:

- Lựa chọn linh kiện phù hợp với ngân sách
- Kiểm tra tính tương thích giữa các linh kiện (CPU–Mainboard, RAM–Mainboard, GPU–Case, PSU...)
- Lưu lại và quản lý các cấu hình đã tạo

### 1.2 Mục tiêu

Xây dựng hệ thống **PC Builder** với backend API phục vụ:

1. **Truy vấn linh kiện**: Lấy danh sách linh kiện theo danh mục, tìm kiếm và lọc
2. **Kiểm tra tương thích**: Tự động phát hiện xung đột giữa các linh kiện được chọn
3. **Quản lý cấu hình**: Người dùng có thể lưu, tải, xóa cấu hình máy tính cá nhân
4. **Quản trị hệ thống**: Admin/Manager quản lý kho linh kiện và các cấu hình nổi bật

### 1.3 Phạm vi

| Thành phần | Công nghệ |
|------------|-----------|
| Backend API | Laravel 13 (PHP 8.2+) |
| Xác thực | Laravel Sanctum (Token-based) |
| Cơ sở dữ liệu | MySQL |
| Frontend | React 19 + Vite (không thuộc phạm vi báo cáo này) |

---

## 2. PHÂN TÍCH YÊU CẦU HỆ THỐNG

### 2.1 Các đối tượng người dùng (Actors)

```
┌─────────────────────────────────────────────────────────┐
│                    HỆ THỐNG PC BUILDER                  │
├──────────────┬──────────────┬──────────────┬────────────┤
│   KHÁCH      │    USER      │   MANAGER    │   ADMIN    │
│ (Guest)      │ (Đăng ký)    │ (Quản lý)    │ (Toàn     │
│              │              │              │  quyền)    │
├──────────────┼──────────────┼──────────────┼────────────┤
│ Xem linh     │ Xem linh     │ Xem linh     │ Tất cả     │
│ kiện         │ kiện         │ kiện         │ quyền      │
│              │              │              │ của        │
│ Kiểm tra     │ Kiểm tra     │ Thêm/Sửa/    │ Manager    │
│ tương thích  │ tương thích  │ Xóa linh     │            │
│              │              │ kiện         │ Quản lý    │
│ Xem cấu hình │ Lưu/Xóa cấu │              │ Manager    │
│ nổi bật      │ hình cá nhân │ Quản lý cấu  │            │
│              │              │ hình nổi bật │            │
│              │ Cập nhật hồ  │              │            │
│              │ sơ cá nhân   │ Xem/Xóa User │            │
└──────────────┴──────────────┴──────────────┴────────────┘
```

### 2.2 Yêu cầu chức năng

**Nhóm 1 – Quản lý linh kiện (Component Management)**
- [x] Lấy danh sách toàn bộ linh kiện
- [x] Thêm linh kiện mới (kèm ảnh upload)
- [x] Cập nhật thông tin linh kiện
- [x] Xóa linh kiện (Soft Delete – có thể khôi phục)

**Nhóm 2 – Kiểm tra tương thích (Compatibility Check)**
- [x] Kiểm tra socket CPU ↔ Mainboard
- [x] Kiểm tra loại RAM ↔ Mainboard hỗ trợ
- [x] Kiểm tra chiều dài GPU ↔ kích thước Case
- [x] Kiểm tra công suất PSU đủ cho CPU + GPU
- [x] Kiểm tra form factor Mainboard ↔ Case
- [x] Kiểm tra chiều cao CPU Cooler ↔ Case
- [x] Cảnh báo bottleneck CPU/GPU

**Nhóm 3 – Cấu hình đã lưu (Saved Builds)**
- [x] Lưu cấu hình với tên tùy chọn
- [x] Lấy danh sách cấu hình đã lưu của user
- [x] Xóa cấu hình đã lưu

**Nhóm 4 – Cấu hình nổi bật (Featured Builds)**
- [x] Xem danh sách cấu hình nổi bật (public)
- [x] Xem chi tiết 1 cấu hình nổi bật
- [x] Thêm/Sửa/Xóa cấu hình nổi bật (Admin/Manager)

**Nhóm 5 – Xác thực & Tài khoản**
- [x] Đăng ký, đăng nhập, đăng xuất
- [x] Quên mật khẩu / Đặt lại mật khẩu
- [x] Cập nhật hồ sơ cá nhân, đổi mật khẩu, upload avatar

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU

### 3.1 Sơ đồ quan hệ (ERD)

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  categories │     │    components    │     │  compatibility    │
├─────────────┤     ├──────────────────┤     │      _rules       │
│ id (PK)     │1   N│ id (PK)          │     ├───────────────────┤
│ code        ├─────┤ category_id (FK) │     │ id (PK)           │
│ name        │     │ brand            │     │ rule_code         │
│ created_at  │     │ name             │     │ description       │
│ updated_at  │     │ min_price        │     │ config (JSON)     │
└─────────────┘     │ max_price        │     │ error_message     │
                    │ specifications   │     │ is_active         │
                    │   (JSON)         │     └───────────────────┘
                    │ image_url        │
                    │ deleted_at       │
                    └──────────────────┘

┌─────────────────┐     ┌──────────────────────┐
│      users      │     │    saved_builds      │
├─────────────────┤     ├──────────────────────┤
│ id (PK)         │1   N│ id (PK)              │
│ username        ├─────┤ user_id (FK)         │
│ email           │     │ name                 │
│ password        │     │ components (JSON)    │
│ role            │     │ total_min_price      │
│ date_of_birth   │     │ total_max_price      │
│ phone           │     │ created_at           │
│ address         │     └──────────────────────┘
│ avatar          │
└─────────────────┘

┌─────────────────────────────┐
│       featured_builds       │
├─────────────────────────────┤
│ id (PK)                     │
│ name                        │
│ tag / tag_color             │
│ subtitle                    │
│ image                       │
│ rating                      │
│ component_ids (JSON)        │
│ component_quantities (JSON) │
│ is_active                   │
└─────────────────────────────┘
```

### 3.2 Mô tả chi tiết các bảng

#### Bảng `users` – Tài khoản người dùng
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO | Khóa chính |
| `username` | VARCHAR(255) | NOT NULL | Tên hiển thị |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu băm (Bcrypt) |
| `role` | ENUM | NOT NULL | `admin` / `manager` / `user` |
| `date_of_birth` | DATE | NULL | Ngày sinh |
| `phone` | VARCHAR(20) | NULL | Số điện thoại |
| `address` | TEXT | NULL | Địa chỉ |
| `avatar` | VARCHAR(255) | NULL | Đường dẫn ảnh đại diện |

#### Bảng `components` – Linh kiện máy tính
| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | BIGINT | PK, AUTO | Khóa chính |
| `category_id` | BIGINT | FK → categories | Loại linh kiện |
| `brand` | VARCHAR(100) | NOT NULL | Thương hiệu |
| `name` | VARCHAR(255) | NOT NULL | Tên sản phẩm |
| `min_price` | INT | NOT NULL | Giá thấp nhất (VNĐ) |
| `max_price` | INT | NOT NULL | Giá cao nhất (VNĐ) |
| `specifications` | JSON | NOT NULL | Thông số kỹ thuật |
| `image_url` | VARCHAR(255) | NULL | Đường dẫn ảnh |
| `deleted_at` | TIMESTAMP | NULL | Soft Delete |

> **Thiết kế linh hoạt**: Cột `specifications` lưu dạng JSON cho phép mỗi loại linh kiện (CPU, GPU, RAM...) có tập thông số riêng biệt mà không cần thêm bảng.

#### Bảng `categories` – Danh mục linh kiện
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | BIGINT | Khóa chính |
| `code` | VARCHAR | Mã loại: `cpu`, `vga`, `ram`, `mainboard`, `psu`, `case`, `cooler`, `storage` |
| `name` | VARCHAR | Tên hiển thị: "Vi xử lý", "Card màn hình"... |

#### Bảng `saved_builds` – Cấu hình máy tính đã lưu
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | BIGINT | Khóa chính |
| `user_id` | BIGINT | FK → users |
| `name` | VARCHAR(255) | Tên cấu hình do user đặt |
| `components` | JSON | `{"cpu": 5, "vga": 12, "ram": 3, ...}` |
| `total_min_price` | INT | Tổng giá thấp nhất |
| `total_max_price` | INT | Tổng giá cao nhất |

#### Bảng `featured_builds` – Cấu hình nổi bật
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | BIGINT | Khóa chính |
| `name` | VARCHAR | Tên cấu hình |
| `tag` | VARCHAR | Nhãn: Gaming / Performance / Workstation |
| `component_ids` | JSON | Mảng ID linh kiện |
| `component_quantities` | JSON | Số lượng từng linh kiện |
| `is_active` | BOOLEAN | Hiển thị hay ẩn |

#### Bảng `compatibility_rules` – Luật kiểm tra tương thích
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `rule_code` | VARCHAR | `RULE_SOCKET_MATCH`, `RULE_RAM_TYPE_MATCH`... |
| `config` | JSON | Cấu hình rule: `{"operator": "<="}` |
| `error_message` | TEXT | Thông báo lỗi trả về cho người dùng |
| `is_active` | BOOLEAN | Bật/tắt rule |

---

## 4. THIẾT KẾ API

### 4.1 Quy ước chung

- **Base URL**: `http://127.0.0.1:8000/api`
- **Format dữ liệu**: JSON (`Content-Type: application/json`)
- **Xác thực**: Bearer Token trong header `Authorization: Bearer {token}`
- **Chuẩn phản hồi**:

```json
// Thành công
{
  "status": "success",
  "data": { ... }
}

// Lỗi
{
  "message": "Mô tả lỗi",
  "errors": { "field": ["Chi tiết lỗi"] }
}
```

### 4.2 Bảng tổng hợp toàn bộ API Endpoints

| # | Method | Endpoint | Mô tả | Quyền truy cập |
|---|--------|----------|-------|----------------|
| 1 | POST | `/api/login` | Đăng nhập | Public |
| 2 | POST | `/api/register` | Đăng ký tài khoản | Public |
| 3 | POST | `/api/forgot-password` | Yêu cầu đặt lại mật khẩu | Public |
| 4 | POST | `/api/reset-password` | Đặt lại mật khẩu | Public |
| 5 | GET | `/api/components` | Lấy danh sách linh kiện | Public |
| 6 | GET | `/api/categories` | Lấy danh sách danh mục | Public |
| 7 | POST | `/api/compatibility/check` | Kiểm tra tương thích linh kiện | Public |
| 8 | GET | `/api/featured-builds` | Lấy danh sách cấu hình nổi bật | Public |
| 9 | GET | `/api/featured-builds/{id}` | Lấy chi tiết cấu hình nổi bật | Public |
| 10 | GET | `/api/me` | Lấy thông tin tài khoản | User+ |
| 11 | POST | `/api/change-password` | Đổi mật khẩu | User+ |
| 12 | PUT | `/api/profile` | Cập nhật hồ sơ cá nhân | User+ |
| 13 | POST | `/api/profile/avatar` | Upload ảnh đại diện | User+ |
| 14 | GET | `/api/saved-builds` | Lấy danh sách cấu hình đã lưu | User+ |
| 15 | POST | `/api/saved-builds` | Lưu cấu hình mới | User+ |
| 16 | DELETE | `/api/saved-builds/{id}` | Xóa cấu hình đã lưu | User+ |
| 17 | POST | `/api/components` | Thêm linh kiện mới | Admin/Manager |
| 18 | PUT | `/api/components/{id}` | Cập nhật linh kiện | Admin/Manager |
| 19 | DELETE | `/api/components/{id}` | Xóa linh kiện (Soft Delete) | Admin/Manager |
| 20 | POST | `/api/featured-builds` | Thêm cấu hình nổi bật | Admin/Manager |
| 21 | PUT | `/api/featured-builds/{id}` | Cập nhật cấu hình nổi bật | Admin/Manager |
| 22 | DELETE | `/api/featured-builds/{id}` | Xóa cấu hình nổi bật | Admin/Manager |
| 23 | GET | `/api/users` | Lấy danh sách người dùng | Admin/Manager |
| 24 | DELETE | `/api/users/{id}` | Xóa tài khoản người dùng | Admin/Manager |
| 25 | POST | `/api/managers` | Tạo tài khoản Manager | Admin only |
| 26 | GET | `/api/managers` | Lấy danh sách Manager | Admin only |
| 27 | DELETE | `/api/managers/{id}` | Xóa tài khoản Manager | Admin only |

### 4.3 Mô tả chi tiết các API quan trọng

---

#### API 1: Lấy danh sách linh kiện
```
GET /api/components
```

**Request**: Không cần tham số

**Response thành công (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "brand": "Intel",
      "name": "Intel Core i5-13400F",
      "min_price": 3500000,
      "max_price": 4200000,
      "image_url": "/storage/components/abc123.jpg",
      "specifications": {
        "socket": "LGA1700",
        "cores": 10,
        "threads": 16,
        "base_clock_ghz": 2.5,
        "boost_clock_ghz": 4.6,
        "tdp": 65
      }
    }
  ]
}
```

---

#### API 2: Thêm linh kiện mới
```
POST /api/components
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data
```

**Request Body**:
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `category_id` | integer | Có | ID danh mục |
| `brand` | string | Có | Thương hiệu (tối đa 100 ký tự) |
| `name` | string | Có | Tên sản phẩm (tối đa 255 ký tự) |
| `min_price` | integer | Có | Giá thấp nhất (VNĐ) |
| `max_price` | integer | Có | Giá cao nhất (VNĐ) |
| `specifications` | object/JSON | Có | Thông số kỹ thuật |
| `image` | file | Không | PNG/JPEG, tối đa 4MB, 2000×2000px |

**Response thành công (201)**:
```json
{
  "status": "success",
  "message": "Thêm linh kiện thành công!",
  "data": { "id": 42, "name": "Intel Core i9-14900K", ... }
}
```

**Response lỗi validation (422)**:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "min_price": ["The min price must be an integer."]
  }
}
```

---

#### API 3: Kiểm tra tương thích linh kiện
```
POST /api/compatibility/check
```

**Request Body**:
```json
{
  "components": {
    "cpu": 1,
    "mainboard": 5,
    "ram": 3,
    "vga": 8,
    "psu": 12,
    "case": 7,
    "cooler": 4
  }
}
```
> Các key là `code` của category. Giá trị là `id` của component.

**Response thành công (200)**:
```json
{
  "status": "success",
  "passed": false,
  "alerts": [
    {
      "rule_code": "RULE_SOCKET_MATCH",
      "type": "error",
      "message": "Socket của CPU và Mainboard không khớp!",
      "detail": "cpu.socket (LGA1700) vs mainboard.socket (AM5)"
    },
    {
      "rule_code": "RULE_BOTTLENECK_WARNING",
      "type": "warning",
      "message": "CPU và GPU có thể gây bottleneck!",
      "detail": null
    }
  ]
}
```

> - `passed: true` → Tất cả linh kiện tương thích  
> - `type: "error"` → Xung đột nghiêm trọng, không thể dùng chung  
> - `type: "warning"` → Cảnh báo hiệu năng, vẫn dùng được

---

#### API 4: Lưu cấu hình máy tính
```
POST /api/saved-builds
Authorization: Bearer {user_token}
```

**Request Body**:
```json
{
  "name": "Cấu hình gaming tháng 4",
  "components": {
    "cpu": 1,
    "vga": 8,
    "ram": 3,
    "mainboard": 5,
    "psu": 12,
    "case": 7,
    "storage": 15
  },
  "total_min_price": 18500000,
  "total_max_price": 22000000
}
```

**Response thành công (201)**:
```json
{
  "status": "success",
  "message": "Đã lưu cấu hình!",
  "data": {
    "id": 10,
    "user_id": 3,
    "name": "Cấu hình gaming tháng 4",
    "total_min_price": 18500000,
    "total_max_price": 22000000,
    "created_at": "2026-04-23T08:00:00.000000Z"
  }
}
```

---

#### API 5: Đăng nhập
```
POST /api/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response thành công (200)**:
```json
{
  "status": "success",
  "message": "Đăng nhập thành công!",
  "token": "1|abcdef123456...",
  "role": "user",
  "user": {
    "id": 3,
    "username": "nguyenvan",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Response lỗi (401)**:
```json
{
  "message": "Email hoặc mật khẩu không chính xác!"
}
```

---

## 5. KIẾN TRÚC BACKEND

### 5.1 Cấu trúc thư mục

```
pc-builder-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php         ← Xác thực & quản lý user
│   │   │       ├── ComponentController.php    ← CRUD linh kiện
│   │   │       ├── FeaturedBuildController.php← CRUD cấu hình nổi bật
│   │   │       └── CompatibilityController.php← Kiểm tra tương thích
│   │   └── Middleware/
│   │       └── CheckAdminRole.php             ← Kiểm tra quyền Admin/Manager
│   └── Models/
│       ├── User.php
│       ├── Component.php                      ← Có SoftDeletes
│       ├── Category.php
│       ├── SavedBuild.php
│       ├── FeaturedBuild.php
│       └── CompatibilityRule.php
├── database/
│   ├── migrations/                            ← 9 file migration
│   └── seeders/
│       ├── DatabaseSeeder.php                 ← Tạo tài khoản admin mặc định
│       └── FeaturedBuildSeeder.php            ← 3 cấu hình nổi bật mẫu
└── routes/
    └── api.php                                ← 27 endpoints
```

### 5.2 Luồng xử lý request

```
HTTP Request
    │
    ▼
routes/api.php
    │
    ├─── Middleware: auth:sanctum (kiểm tra token)
    │        │
    │        ├─── Middleware: role.admin (kiểm tra quyền)
    │        │
    │        └─── Controller Method
    │                   │
    │                   ├─── Validate Request
    │                   ├─── Business Logic
    │                   ├─── Model (Eloquent ORM)
    │                   │         │
    │                   │         └─── MySQL Database
    │                   │
    │                   └─── JSON Response
    │
    └─── (Public routes) → Controller trực tiếp
```

### 5.3 Mô hình phân tầng (Layered Architecture)

| Tầng | Thành phần | Trách nhiệm |
|------|------------|-------------|
| **Route Layer** | `routes/api.php` | Định tuyến URL → Controller |
| **Middleware Layer** | `CheckAdminRole`, `auth:sanctum` | Xác thực & phân quyền |
| **Controller Layer** | `*Controller.php` | Xử lý logic, validate input |
| **Model Layer** | `*.php` (Models) | Tương tác Database via Eloquent ORM |
| **Database Layer** | MySQL | Lưu trữ dữ liệu |

---

## 6. CƠ CHẾ XÁC THỰC & PHÂN QUYỀN

### 6.1 Laravel Sanctum – Token-based Authentication

Hệ thống sử dụng **Laravel Sanctum** cho xác thực API không trạng thái (stateless):

```
Luồng đăng nhập:
┌──────────┐    POST /api/login     ┌────────────┐
│  Client  │ ─────────────────────► │  Backend   │
│          │  {email, password}     │            │
│          │                        │ 1. Tìm user│
│          │                        │ 2. Bcrypt  │
│          │                        │    verify  │
│          │   {token, role, user}  │ 3. Tạo     │
│          │ ◄───────────────────── │   token    │
└──────────┘                        └────────────┘

Luồng gọi API sau đăng nhập:
┌──────────┐  Authorization: Bearer {token}  ┌────────────┐
│  Client  │ ──────────────────────────────► │  Backend   │
│          │  GET /api/me                    │            │
│          │                                 │ 1. Kiểm tra│
│          │                                 │    token   │
│          │   {status: success, user: ...}  │ 2. Trả dữ │
│          │ ◄─────────────────────────────  │    liệu   │
└──────────┘                                 └────────────┘
```

### 6.2 Hệ thống phân quyền 3 cấp

```
ADMIN
  │  ├── Tất cả quyền của Manager
  │  └── Quản lý tài khoản Manager (tạo/xóa)
  │
MANAGER
  │  ├── Thêm/Sửa/Xóa linh kiện
  │  ├── Quản lý cấu hình nổi bật
  │  └── Xem/Xóa tài khoản User
  │
USER
     ├── Đăng nhập, cập nhật hồ sơ
     ├── Lưu/Xóa cấu hình máy tính cá nhân
     └── Xem linh kiện, kiểm tra tương thích
```

### 6.3 Middleware CheckAdminRole

```php
// app/Http/Middleware/CheckAdminRole.php
// Logic kiểm tra: user phải có role 'admin' HOẶC 'manager'
if (!in_array($user->role, ['admin', 'manager'])) {
    return response()->json(['message' => 'Forbidden'], 403);
}
```

---

## 7. TÍNH NĂNG KIỂM TRA TƯƠNG THÍCH LINH KIỆN

### 7.1 Kiến trúc Rule-Based Engine

Hệ thống kiểm tra tương thích được thiết kế theo mô hình **Rule-Based**:

- Các quy tắc (rules) được lưu trong database bảng `compatibility_rules`
- Mỗi rule có `rule_code` định danh và `config` JSON mô tả điều kiện
- Engine đọc tất cả rule đang active, tải thông số linh kiện, rồi đánh giá từng rule

**Lợi ích**: Dễ dàng thêm/sửa/tắt rule mà không cần sửa code.

### 7.2 Các luật tương thích đã triển khai

| Rule Code | Mô tả | Loại |
|-----------|-------|------|
| `RULE_SOCKET_MATCH` | Socket CPU phải khớp socket Mainboard | ERROR |
| `RULE_RAM_TYPE_MATCH` | Loại RAM phải khớp Mainboard hỗ trợ (DDR4/DDR5) | ERROR |
| `RULE_VGA_CLEARANCE` | Chiều dài GPU ≤ chiều dài tối đa Case | ERROR |
| `RULE_PSU_WATTAGE` | Công suất PSU ≥ TDP CPU + TDP GPU + 100W | ERROR |
| `RULE_MB_FORM_FACTOR` | Form factor Mainboard phải Case hỗ trợ | ERROR |
| `RULE_COOLER_CLEARANCE` | Chiều cao Cooler ≤ chiều cao tối đa Case | ERROR |
| `RULE_BOTTLENECK_WARNING` | Cảnh báo nếu CPU/GPU chênh lệch tier | WARNING |

### 7.3 Ví dụ luồng kiểm tra

```
Input: { cpu: 1, mainboard: 5, ram: 3, vga: 8, psu: 12, case: 7 }
   │
   ▼
Load specifications từ DB cho từng component
   │
   ▼
Load tất cả CompatibilityRule (is_active = true)
   │
   ▼
Với mỗi Rule:
  ├── RULE_SOCKET_MATCH:
  │     cpu.socket = "LGA1700", mainboard.socket = "AM5"
  │     → LGA1700 ≠ AM5 → ERROR!
  │
  ├── RULE_PSU_WATTAGE:
  │     psu.wattage = 650, cpu.tdp = 65, vga.tdp = 200
  │     → 650 ≥ (65 + 200 + 100) = 365 → PASS
  │
  └── ... các rule khác
   │
   ▼
Trả về: { passed: false, alerts: [{ rule_code, type, message }] }
```

---

## 8. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 8.1 Yêu cầu môi trường

| Phần mềm | Phiên bản tối thiểu |
|----------|---------------------|
| PHP | 8.2+ |
| Composer | 2.x |
| MySQL | 8.0+ |
| Node.js | 18+ |
| npm | 9+ |

### 8.2 Cài đặt Backend

```bash
# 1. Di chuyển vào thư mục backend
cd pc-builder-backend

# 2. Cài đặt dependencies PHP
composer install

# 3. Tạo file cấu hình môi trường
cp .env.example .env

# 4. Chỉnh sửa .env – cấu hình kết nối database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pcbuilder
DB_USERNAME=root
DB_PASSWORD=yourpassword

# 5. Tạo application key
php artisan key:generate

# 6. Tạo bảng database và seed dữ liệu mẫu
php artisan migrate --seed

# 7. Tạo symbolic link cho file uploads
php artisan storage:link

# 8. Khởi động server
php artisan serve
# → Server chạy tại: http://127.0.0.1:8000
```

### 8.3 Tài khoản mặc định sau khi seed

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | `buildermypc@gmail.com` | `password` |

### 8.4 Cài đặt Frontend

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt dependencies
npm install

# 3. Chạy môi trường development
npm run dev
# → Ứng dụng chạy tại: http://localhost:5173
```

---

## 9. KẾT QUẢ ĐẠT ĐƯỢC

### 9.1 Tổng quan hệ thống đã hoàn thành

| Hạng mục | Số lượng | Chi tiết |
|----------|----------|----------|
| API Endpoints | **27** | Public: 9, User: 7, Admin/Manager: 11 |
| Database Tables | **7** | users, components, categories, saved_builds, featured_builds, compatibility_rules, personal_access_tokens |
| Models | **6** | User, Component (SoftDeletes), Category, SavedBuild, FeaturedBuild, CompatibilityRule |
| Controllers | **4** | AuthController, ComponentController, FeaturedBuildController, CompatibilityController |
| Compatibility Rules | **7** | 6 Error rules + 1 Warning rule |
| Migrations | **9** | Đầy đủ, có thể rollback |
| Seeders | **2** | Admin account + Featured builds mẫu |

### 9.2 Các tính năng nổi bật

1. **Soft Delete**: Linh kiện bị xóa không mất khỏi database, có thể khôi phục
2. **JSON Specifications**: Thông số kỹ thuật linh hoạt cho từng loại linh kiện
3. **Rule-Based Compatibility Engine**: Dễ mở rộng thêm luật kiểm tra mới
4. **Phân quyền 3 cấp**: Admin > Manager > User với kiểm soát chi tiết
5. **Image Upload**: Upload và quản lý ảnh linh kiện, avatar người dùng
6. **Token Revocation**: Đăng xuất hủy token, bảo mật tốt hơn session-based

### 9.3 Giao diện minh họa

| Trang | Mô tả |
|-------|-------|
| Trang chủ | Hiển thị cấu hình nổi bật, điều hướng danh mục |
| Builder Page | Giao diện lắp ráp máy tính với kiểm tra tương thích realtime |
| Component List | Duyệt linh kiện theo danh mục |
| My Builds | Quản lý cấu hình đã lưu của người dùng |
| Admin Dashboard | Bảng điều khiển quản trị với 4 tab |

---

## 10. KẾT LUẬN

### 10.1 Tóm tắt

Đồ án đã xây dựng thành công hệ thống backend hoàn chỉnh với **27 API endpoints** phục vụ đầy đủ các nghiệp vụ:
- Truy vấn và quản lý linh kiện máy tính
- Kiểm tra tương thích tự động theo 7 luật kỹ thuật
- Quản lý cấu hình máy tính cá nhân của người dùng
- Phân quyền 3 cấp bảo mật

### 10.2 Công nghệ áp dụng

| Công nghệ | Ứng dụng |
|-----------|----------|
| **Laravel 13** | Framework PHP MVC cho backend API |
| **Eloquent ORM** | Tương tác database hướng đối tượng |
| **Laravel Sanctum** | Xác thực API bằng token |
| **Soft Deletes** | Xóa an toàn, có thể khôi phục |
| **JSON Cast** | Lưu dữ liệu phức tạp (specifications, components) |
| **Middleware** | Phân quyền và xác thực theo tầng |
| **Database Seeding** | Khởi tạo dữ liệu mặc định tự động |

### 10.3 Hướng phát triển tiếp theo

- [x] **Thêm LLM API cho AI recommendation** (Phần 11 - Chi tiết bên dưới)
- [ ] Thêm tính năng tìm kiếm và lọc linh kiện theo giá, thương hiệu
- [ ] Thêm API thống kê cho Admin (số lượng user, số lượt xem...)
- [ ] Tích hợp giỏ hàng và thanh toán
- [ ] Thêm tính năng so sánh linh kiện trực tiếp
- [ ] Viết Unit Test và Feature Test đầy đủ

---

## 11. KẾ HOẠCH CHI TIẾT: LLM API HYBRID RECOMMENDATION SYSTEM

### 11.1 Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  BuilderPage + RecommendationModal                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
                HTTP POST /api/recommendations
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Laravel)                        │
│                                                                 │
│  RecommendationController                                       │
│    ├─ Validate Input (purpose, budget, requirements)            │
│    ├─ Load Components from DB (CPU, GPU, RAM, etc.)             │
│    ├─ Format Smart Prompt with Component List                   │
│    └─ Cache Layer (Redis) - check if similar request exists     │
│                                                                 │
│  LLMService                                                     │
│    ├─ Call Claude API (claude-3-5-sonnet-20241022)              │
│    ├─ Parse JSON Response                                       │
│    └─ Retry Logic (max 3 attempts)                              │
│                                                                 │
│  ValidatorService                                               │
│    ├─ Verify LLM output (component IDs exist)                   │
│    ├─ Run Compatibility Check                                   │
│    ├─ Validate Budget Constraint                                │
│    └─ Auto-fix if needed                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓↑
                HTTP Response (with reasoning)
┌─────────────────────────────────────────────────────────────────┐
│              Frontend Display + User Actions                    │
│  ├─ View Recommendation Details                                 │
│  ├─ [Save Build] → POST /api/saved-builds                       │
│  ├─ [Regenerate] → Call API again                               │
│  └─ [Cancel]                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Phase 1: Chuẩn Bị & Setup (2-3 ngày)

#### Step 1.1 - Cài đặt Anthropic SDK

```bash
# Thêm package Anthropic PHP vào composer.json
composer require anthropic-ai/sdk

# Hoặc dùng Guzzle + HTTP client trực tiếp
composer require guzzlehttp/guzzle
```

#### Step 1.2 - Cấu hình Environment

Thêm vào `.env`:
```env
# Claude API Configuration
CLAUDE_API_KEY=sk-ant-xxxxxxxxxx  # Lấy từ https://console.anthropic.com
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=2000
CLAUDE_TIMEOUT=30

# Cache Configuration (sử dụng Redis)
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Feature Toggle
ENABLE_LLM_RECOMMENDATION=true
LLM_RECOMMENDATION_CACHE_TTL=3600  # 1 giờ
```

#### Step 1.3 - Tạo Configuration File

```php
// config/llm.php
return [
    'provider' => env('CLAUDE_API_KEY') ? 'anthropic' : 'mock',
    'anthropic' => [
        'api_key' => env('CLAUDE_API_KEY'),
        'model' => env('CLAUDE_MODEL', 'claude-3-5-sonnet-20241022'),
        'max_tokens' => env('CLAUDE_MAX_TOKENS', 2000),
        'timeout' => env('CLAUDE_TIMEOUT', 30),
    ],
    'cache' => [
        'enabled' => env('ENABLE_LLM_RECOMMENDATION', true),
        'ttl' => env('LLM_RECOMMENDATION_CACHE_TTL', 3600),
    ],
];
```

### 11.3 Phase 2: Backend Implementation (4-5 ngày)

#### Step 2.1 - Tạo Service Layer

**File: `app/Services/LLMService.php`**

```php
<?php
namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Exception;

class LLMService {
    private $client;
    private $apiKey;
    private $model;
    private $maxTokens;
    private $timeout;
    
    public function __construct() {
        $this->apiKey = config('llm.anthropic.api_key');
        $this->model = config('llm.anthropic.model');
        $this->maxTokens = config('llm.anthropic.max_tokens');
        $this->timeout = config('llm.anthropic.timeout');
        
        $this->client = new Client([
            'base_uri' => 'https://api.anthropic.com/v1/',
            'timeout' => $this->timeout,
        ]);
    }
    
    /**
     * Gọi Claude API để recommend cấu hình
     */
    public function recommendBuild(array $params): array {
        try {
            // 1. Kiểm tra cache
            $cacheKey = $this->generateCacheKey($params);
            if (config('llm.cache.enabled')) {
                $cached = Cache::get($cacheKey);
                if ($cached) {
                    Log::info('LLM recommendation from cache', ['key' => $cacheKey]);
                    return $cached;
                }
            }
            
            // 2. Build prompt
            $prompt = $this->buildPrompt($params);
            
            // 3. Call API với retry logic
            $response = $this->callWithRetry($prompt, 3);
            
            // 4. Parse response
            $recommendation = $this->parseResponse($response);
            
            // 5. Cache result
            if (config('llm.cache.enabled')) {
                Cache::put($cacheKey, $recommendation, 
                    config('llm.cache.ttl'));
            }
            
            return $recommendation;
            
        } catch (Exception $e) {
            Log::error('LLM API Error', [
                'error' => $e->getMessage(),
                'params' => $params
            ]);
            throw $e;
        }
    }
    
    /**
     * Call API với retry logic (max 3 lần)
     */
    private function callWithRetry(string $prompt, int $maxRetries): array {
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                $response = $this->client->post('messages', [
                    'headers' => [
                        'x-api-key' => $this->apiKey,
                        'anthropic-version' => '2023-06-01',
                        'content-type' => 'application/json',
                    ],
                    'json' => [
                        'model' => $this->model,
                        'max_tokens' => $this->maxTokens,
                        'messages' => [[
                            'role' => 'user',
                            'content' => $prompt
                        ]],
                        'temperature' => 0.7,
                    ],
                ]);
                
                return json_decode($response->getBody(), true);
                
            } catch (Exception $e) {
                Log::warning("LLM API Attempt $attempt failed", [
                    'error' => $e->getMessage()
                ]);
                
                if ($attempt === $maxRetries) {
                    throw $e;
                }
                
                // Exponential backoff: 1s, 2s, 4s
                sleep(2 ** ($attempt - 1));
            }
        }
    }
    
    /**
     * Build smart prompt với component list
     */
    private function buildPrompt(array $params): string {
        $components = $this->getComponentsList($params);
        
        $promptText = <<<PROMPT
Bạn là chuyên gia lắp ráp máy tính với 10 năm kinh nghiệm. 
Hãy tạo cấu hình PC tối ưu dựa trên yêu cầu của khách hàng.

=== YÊU CẦU CỦA KHÁCH HÀNG ===
- Mục đích sử dụng: {$params['purpose']}
- Budget: {$params['budget']:,} VNĐ
- Yêu cầu đặc biệt: {$params['requirements']}
- Thương hiệu ưa thích: {$params['brand_preference'] ?? 'Bất kỳ'}

=== DANH SÁCH LINH KIỆN CÓ SẴN (đơn vị: VNĐ) ===

{$components}

=== YÊUMẪU OUTPUT ===
Phải là valid JSON:
{
  "cpu": {"id": 5, "name": "Intel Core i7-14700K", "reasoning": "..."},
  "gpu": {"id": 14, "name": "RTX 4080 Super", "reasoning": "..."},
  "ram": {"id": 22, "name": "32GB DDR5 6000MHz", "reasoning": "..."},
  "mainboard": {"id": 32, "name": "ASUS ROG MAXIMUS Z890", "reasoning": "..."},
  "psu": {"id": 45, "name": "Corsair RM1000e", "reasoning": "..."},
  "case": {"id": 50, "name": "Lian Li O11 Dynamic", "reasoning": "..."},
  "cooler": {"id": 60, "name": "Noctua NH-D15", "reasoning": "..."},
  "storage": {"id": 70, "name": "Samsung 990 Pro 2TB", "reasoning": "..."},
  "total_estimate_min": 18500000,
  "total_estimate_max": 22000000,
  "performance_rating": "Gaming 4K @ 100+ FPS",
  "overall_reasoning": "Cấu hình này balanced giữa..."
}

=== CONSTRAINTS ===
1. Total budget: {$params['budget']} ± 5% (cho phép vượt tối đa 1 triệu)
2. Tất cả linh kiện phải compatible
3. Đừng recommend component bị xóa (deleted_at không null)
4. Ưu tiên mới nhất (2024-2025)
5. Giải thích rõ lý do từng component

PROMPT;
        
        return $promptText;
    }
    
    /**
     * Lấy danh sách components được format cho prompt
     */
    private function getComponentsList(array $params): string {
        // Query components từ DB, order by rating/price
        $cpus = \App\Models\Component::where('category_id', 1)
            ->where('deleted_at', null)
            ->orderBy('specifications->performance_score', 'desc')
            ->take(15)
            ->get();
        
        // Tương tự cho GPU, RAM, v.v.
        $gpus = \App\Models\Component::where('category_id', 2)
            ->where('deleted_at', null)
            ->take(12)
            ->get();
        
        // Format thành string dễ đọc cho LLM
        $output = "**CPUs:**\n";
        foreach ($cpus as $cpu) {
            $output .= "- ID: {$cpu->id}, {$cpu->brand} {$cpu->name} " .
                      "({$cpu->min_price:,} - {$cpu->max_price:,})\n";
        }
        
        $output .= "\n**GPUs:**\n";
        foreach ($gpus as $gpu) {
            $output .= "- ID: {$gpu->id}, {$gpu->brand} {$gpu->name} " .
                      "({$gpu->min_price:,} - {$gpu->max_price:,})\n";
        }
        
        // ... Tiếp tục với RAM, Mainboard, PSU, Case, Cooler, Storage
        
        return $output;
    }
    
    /**
     * Parse response từ Claude
     */
    private function parseResponse(array $response): array {
        // Claude trả về content array
        if (!isset($response['content'][0]['text'])) {
            throw new Exception('Invalid Claude response format');
        }
        
        $text = $response['content'][0]['text'];
        
        // Extract JSON từ response (có thể có text trước/sau JSON)
        preg_match('/\{[\s\S]*\}/', $text, $matches);
        
        if (empty($matches)) {
            throw new Exception('No JSON found in Claude response');
        }
        
        $jsonStr = $matches[0];
        $result = json_decode($jsonStr, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON in Claude response: ' . 
                              json_last_error_msg());
        }
        
        return $result;
    }
    
    /**
     * Generate cache key từ params
     */
    private function generateCacheKey(array $params): string {
        return 'llm_recommendation:' . md5(
            $params['purpose'] . '|' .
            $params['budget'] . '|' .
            ($params['requirements'] ?? '')
        );
    }
}
```

#### Step 2.2 - Validator Service

**File: `app/Services/RecommendationValidator.php`**

```php
<?php
namespace App\Services;

use App\Models\Component;
use App\Models\CompatibilityRule;

class RecommendationValidator {
    
    /**
     * Validate LLM output & run compatibility check
     */
    public function validate(array $recommendation, int $budget): array {
        $errors = [];
        $warnings = [];
        
        // 1. Verify component IDs exist
        $components = [];
        foreach (['cpu', 'gpu', 'ram', 'mainboard', 'psu', 'case', 
                  'cooler', 'storage'] as $type) {
            if (isset($recommendation[$type]['id'])) {
                $component = Component::find($recommendation[$type]['id']);
                if (!$component || $component->deleted_at !== null) {
                    $errors[] = "$type component không tồn tại";
                    continue;
                }
                $components[$type] = $component;
            }
        }
        
        // 2. Validate budget
        $estimatedTotal = $recommendation['total_estimate_min'] ?? 0;
        if ($estimatedTotal > $budget * 1.05) {
            $warnings[] = [
                'type' => 'budget_exceeded',
                'message' => "Vượt budget " . 
                    ($estimatedTotal - $budget) . " VNĐ"
            ];
        }
        
        // 3. Run compatibility check
        $componentIds = array_column($components, 'id', 0);
        $compatibilityResult = (new CompatibilityService)
            ->checkCompatibility($componentIds);
        
        if (!$compatibilityResult['passed']) {
            foreach ($compatibilityResult['alerts'] as $alert) {
                if ($alert['type'] === 'error') {
                    $errors[] = $alert['message'];
                } else {
                    $warnings[] = $alert;
                }
            }
        }
        
        return [
            'is_valid' => empty($errors),
            'errors' => $errors,
            'warnings' => $warnings,
            'components' => $components,
            'compatibility_result' => $compatibilityResult
        ];
    }
    
    /**
     * Auto-fix recommendation nếu có lỗi nhỏ
     */
    public function autoFix(array $recommendation, int $budget): array {
        $validated = $this->validate($recommendation, $budget);
        
        if ($validated['is_valid']) {
            return $recommendation;
        }
        
        // Nếu vượt budget, tìm alternative component rẻ hơn
        foreach ($validated['errors'] as $error) {
            if (strpos($error, 'Socket') !== false) {
                // Try find compatible mainboard
                // ...
            }
        }
        
        return $recommendation;
    }
}
```

#### Step 2.3 - Controller

**File: `app/Http/Controllers/Api/RecommendationController.php`**

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LLMService;
use App\Services\RecommendationValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecommendationController extends Controller {
    private $llmService;
    private $validator;
    
    public function __construct(
        LLMService $llmService,
        RecommendationValidator $validator
    ) {
        $this->llmService = $llmService;
        $this->validator = $validator;
    }
    
    /**
     * POST /api/recommendations
     * 
     * Request:
     * {
     *   "purpose": "gaming",
     *   "budget": 20000000,
     *   "requirements": "4K, high FPS",
     *   "brand_preference": "Intel/NVIDIA"
     * }
     */
    public function getRecommendation(Request $request) {
        // 1. Validate input
        $validated = Validator::make($request->all(), [
            'purpose' => 'required|in:gaming,streaming,workstation,office,design',
            'budget' => 'required|integer|min:5000000|max:200000000',
            'requirements' => 'nullable|string|max:500',
            'brand_preference' => 'nullable|string',
        ])->validate();
        
        try {
            // 2. Call LLM
            $recommendation = $this->llmService
                ->recommendBuild($validated);
            
            // 3. Validate output
            $validationResult = $this->validator
                ->validate($recommendation, $validated['budget']);
            
            if (!$validationResult['is_valid']) {
                // Try auto-fix
                $recommendation = $this->validator
                    ->autoFix($recommendation, $validated['budget']);
                
                $validationResult = $this->validator
                    ->validate($recommendation, $validated['budget']);
            }
            
            // 4. Enrich với full component details
            $enriched = $this->enrichRecommendation(
                $recommendation,
                $validationResult
            );
            
            return response()->json([
                'status' => 'success',
                'data' => $enriched,
                'validation' => [
                    'is_valid' => $validationResult['is_valid'],
                    'warnings' => $validationResult['warnings'] ?? []
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo recommendation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    private function enrichRecommendation(
        array $recommendation,
        array $validationResult
    ): array {
        // Thêm full component data (image_url, specs, etc.)
        $enriched = [];
        
        foreach (['cpu', 'gpu', 'ram', 'mainboard', 'psu', 'case', 
                  'cooler', 'storage'] as $type) {
            if (isset($validationResult['components'][$type])) {
                $component = $validationResult['components'][$type];
                $enriched[$type] = [
                    'id' => $component->id,
                    'name' => $component->name,
                    'brand' => $component->brand,
                    'price_range' => [
                        'min' => $component->min_price,
                        'max' => $component->max_price
                    ],
                    'image_url' => $component->image_url,
                    'specifications' => $component->specifications,
                    'reasoning' => $recommendation[$type]['reasoning'] ?? '',
                ];
            }
        }
        
        $enriched['summary'] = [
            'total_estimate_min' => $recommendation['total_estimate_min'],
            'total_estimate_max' => $recommendation['total_estimate_max'],
            'performance_rating' => $recommendation['performance_rating'] ?? 'N/A',
            'overall_reasoning' => $recommendation['overall_reasoning'] ?? '',
        ];
        
        return $enriched;
    }
}
```

#### Step 2.4 - Register Routes

**File: `routes/api.php`**

```php
// Thêm route mới
Route::post('/recommendations', [
    RecommendationController::class, 
    'getRecommendation'
]); // Public endpoint

// Hoặc middleware-protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recommendations/premium', [
        RecommendationController::class,
        'getPremiumRecommendation'
    ]); // Advanced features chỉ cho user đã login
});
```

### 11.4 Phase 3: Frontend Integration (3-4 ngày)

#### Step 3.1 - Hook cho React

**File: `frontend/src/hooks/useRecommendation.js`**

```javascript
import { useState } from 'react';

export function useRecommendation() {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const getRecommendation = async (params) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });
            
            if (!response.ok) {
                throw new Error('Failed to get recommendation');
            }
            
            const data = await response.json();
            setRecommendation(data.data);
            return data;
            
        } catch (err) {
            setError(err.message);
            console.error('Recommendation error:', err);
        } finally {
            setLoading(false);
        }
    };
    
    return {
        recommendation,
        loading,
        error,
        getRecommendation
    };
}
```

#### Step 3.2 - Component RecommendationModal

**File: `frontend/src/components/RecommendationModal.jsx`**

```javascript
import React, { useState } from 'react';
import { useRecommendation } from '../hooks/useRecommendation';

export function RecommendationModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        purpose: 'gaming',
        budget: 20000000,
        requirements: '',
        brand_preference: ''
    });
    
    const { recommendation, loading, error, getRecommendation } = 
        useRecommendation();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await getRecommendation(formData);
    };
    
    const handleSaveBuild = () => {
        if (recommendation) {
            onSave({
                name: `${formData.purpose} build - ${new Date().toLocaleDateString()}`,
                components: {
                    cpu: recommendation.cpu?.id,
                    gpu: recommendation.gpu?.id,
                    ram: recommendation.ram?.id,
                    mainboard: recommendation.mainboard?.id,
                    psu: recommendation.psu?.id,
                    case: recommendation.case?.id,
                    cooler: recommendation.cooler?.id,
                    storage: recommendation.storage?.id,
                },
                total_min_price: recommendation.summary.total_estimate_min,
                total_max_price: recommendation.summary.total_estimate_max
            });
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                
                <h2>🤖 AI Recommend Cấu Hình</h2>
                
                {!recommendation ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Mục đích sử dụng</label>
                            <select
                                value={formData.purpose}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    purpose: e.target.value
                                })}
                            >
                                <option value="gaming">Gaming</option>
                                <option value="streaming">Streaming</option>
                                <option value="workstation">Workstation</option>
                                <option value="office">Office</option>
                                <option value="design">Design</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Budget (VNĐ)</label>
                            <input
                                type="number"
                                min="5000000"
                                max="200000000"
                                value={formData.budget}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    budget: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Yêu cầu đặc biệt</label>
                            <textarea
                                placeholder="VD: 4K monitor, high FPS, silent operation..."
                                value={formData.requirements}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    requirements: e.target.value
                                })}
                                rows="3"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? '⏳ Đang tạo...' : '✨ Tạo Recommendation'}
                        </button>
                        
                        {error && <div className="error">{error}</div>}
                    </form>
                ) : (
                    <div className="recommendation-result">
                        <h3>✅ Recommend Cấu Hình</h3>
                        
                        <div className="components-grid">
                            {Object.entries(recommendation).map(([key, comp]) => {
                                if (key === 'summary') return null;
                                return (
                                    <div key={key} className="component-card">
                                        <h4>{key.toUpperCase()}</h4>
                                        <p><strong>{comp.name}</strong></p>
                                        <p className="price">
                                            💰 {comp.price_range.min.toLocaleString()} - 
                                            {comp.price_range.max.toLocaleString()} VNĐ
                                        </p>
                                        <p className="reasoning">
                                            <em>"{comp.reasoning}"</em>
                                        </p>
                                        {comp.image_url && (
                                            <img 
                                                src={comp.image_url} 
                                                alt={comp.name}
                                                style={{ maxWidth: '100%' }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="summary">
                            <p>📊 <strong>Performance:</strong> {recommendation.summary.performance_rating}</p>
                            <p>💵 <strong>Total Budget:</strong> {recommendation.summary.total_estimate_min.toLocaleString()} - {recommendation.summary.total_estimate_max.toLocaleString()} VNĐ</p>
                            <p>📝 <strong>Overall:</strong> {recommendation.summary.overall_reasoning}</p>
                        </div>
                        
                        <div className="actions">
                            <button onClick={handleSaveBuild} className="btn-save">
                                💾 Lưu Cấu Hình
                            </button>
                            <button 
                                onClick={() => setRecommendation(null)}
                                className="btn-regenerate"
                            >
                                🔄 Tạo Lại
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
```

### 11.5 Phase 4: Testing & Optimization (3-4 ngày)

#### Step 4.1 - Unit Test

**File: `tests/Unit/RecommendationValidatorTest.php`**

```php
<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Services\RecommendationValidator;

class RecommendationValidatorTest extends TestCase {
    
    public function test_validate_recomm endation_with_valid_data() {
        $validator = new RecommendationValidator();
        
        $recommendation = [
            'cpu' => ['id' => 1],
            'gpu' => ['id' => 2],
            'ram' => ['id' => 3],
            // ...
        ];
        
        $result = $validator->validate($recommendation, 20000000);
        
        $this->assertIsArray($result);
        $this->assertArrayHasKey('is_valid', $result);
    }
    
    public function test_budget_validation() {
        // ...
    }
}
```

#### Step 4.2 - Load Test với cách tối ưu

```bash
# Dùng Apache Bench để test
ab -n 100 -c 10 -p params.json -T application/json http://localhost:8000/api/recommendations

# Kết quả mong đợi:
# - Response time: < 3s (Claude API + processing)
# - Concurrent: 10-20 requests
# - Cache hit rate: > 60% với smart prompt
```

#### Step 4.3 - Error Handling & Fallback

```php
// Nếu LLM API fail, fallback to rule-based
if (config('llm.provider') === 'mock' || !$this->apiKey) {
    return (new RuleBasedRecommendationService)
        ->recommendBuild($params);
}
```

### 11.6 Timeline & Deliverables

| Phase | Duration | Deliverables |
|-------|----------|---------------|
| **Phase 1: Setup** | 2-3 days | Environment config, SDK installed |
| **Phase 2: Backend** | 4-5 days | Services, Controllers, Routes |
| **Phase 3: Frontend** | 3-4 days | Modal, Hook, Integration |
| **Phase 4: Testing** | 3-4 days | Unit tests, Load tests, Docs |
| **Phase 5: Deploy** | 1-2 days | Production deployment, monitoring |
| **Total** | **13-18 days** | Production-ready AI Recommendation |

### 11.7 Cost Analysis

| Item | Cost | Notes |
|------|------|-------|
| Claude API | $0.018/request | ~1k tokens avg |
| Servers (existing) | $0 | Reuse current infra |
| Development hours | ~200 hours | 5 developers × 4-5 days |
| **Total API Cost/month** | **$180-360** | 10,000-20,000 requests |

### 11.8 Monitoring & Metrics

```php
// Log LLM usage
Log::channel('llm')->info('Recommendation', [
    'purpose' => $params['purpose'],
    'budget' => $params['budget'],
    'response_time' => microtime(true) - $start,
    'cache_hit' => $cached ? 'yes' : 'no',
    'tokens_used' => $response['usage']['output_tokens'] ?? 0,
    'user_id' => auth()->id()
]);

// Metrics to track:
// 1. Success rate (% valid recommendations)
// 2. Avg response time
// 3. Cache hit rate
// 4. User satisfaction (ratings/feedback)
// 5. API cost per recommendation
```

### 11.9 Fallback & Safety Mechanisms

```php
// Safety Layer - Validate outputs
$safety_checks = [
    'component_exists' => true,    // All IDs exist in DB
    'compatibility_pass' => true,  // No error alerts
    'budget_ok' => true,           // Within ±5%
    'no_hallucination' => true,    // No made-up products
];

if (!in_array(false, array_values($safety_checks))) {
    return $recommendation;
} else {
    // Return saved "safe" recommendation from rules
    return $this->getFallbackRecommendation($params);
}
```

### 11.10 Checklist Implementation

- [ ] **Prep Phase**
  - [ ] Register Anthropic account
  - [ ] Create API key
  - [ ] Add env vars
  - [ ] Install SDK/dependencies

- [ ] **Backend Development**
  - [ ] LLMService class
  - [ ] RecommendationValidator class
  - [ ] RecommendationController
  - [ ] Routes setup
  - [ ] Error handling
  - [ ] Logging

- [ ] **Frontend Development**
  - [ ] useRecommendation hook
  - [ ] RecommendationModal component
  - [ ] UI/UX design
  - [ ] Save to build integration

- [ ] **Testing & QA**
  - [ ] Unit tests (Services)
  - [ ] Integration tests (Controller)
  - [ ] E2E tests (Frontend)
  - [ ] Load testing
  - [ ] Error scenario testing

- [ ] **Documentation**
  - [ ] API documentation
  - [ ] How to use guide
  - [ ] Configuration docs
  - [ ] Troubleshooting guide

- [ ] **Deployment**
  - [ ] Production environment setup
  - [ ] CI/CD pipeline
  - [ ] Monitoring dashboard
  - [ ] Backup plans
  - [ ] Post-launch monitoring

---

*Kế hoạch này cung cấp đầy đủ roadmap từ conception tới production.*

---

## 12. HƯỚNG DẪN NỘP BÁO CÁO: MÔ-ĐUN KIỂM TRA TƯƠNG THÍCH

### 12.1 Yêu Cầu Của Bài Tập

**Nhiệm vụ**: Cài đặt mô-đun kiểm tra tương thích linh kiện dựa trên hệ thống luật (Rule-Based Compatibility Engine)

**Phạm vi**: Xử lý các kiểm tra cơ bản:
- ✅ Socket CPU ↔ Mainboard
- ✅ Chuẩn RAM (DDR4/DDR5) ↔ Mainboard hỗ trợ
- ✅ Công suất PSU ≥ TDP (CPU + GPU + buffer)
- ✅ Kích thước GPU (chiều dài) ≤ Case tối đa

**Thời gian**: 2-3 tuần

---

### 12.2 File Cần Nộp (Bắt Buộc)

#### **Backend - Cấu trúc thư mục**

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

### 12.3 Mô Tả Chi Tiết: 7 File Cần Tạo

#### **[1] Model: CompatibilityRule.php**

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

---

#### **[2] Service: CompatibilityService.php**

**Đường dẫn**: `app/Services/CompatibilityService.php`

**Yêu cầu**: Phải implement 5 methods chính:
1. `checkCompatibility($components)` - Hàm chính
2. `checkSocketMatch()` - Check socket
3. `checkRamTypeMatch()` - Check RAM type
4. `checkPsuWattage()` - Check PSU power
5. `checkVgaClearance()` - Check GPU size

**(Xem full code trong section 12.3 ở trên)**

---

#### **[3] Controller: CompatibilityController.php**

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
    
    public function check(Request $request) {
        $validated = Validator::make($request->all(), [
            'components' => 'required|array',
            'components.cpu' => 'nullable|integer|exists:components,id',
            'components.mainboard' => 'nullable|integer|exists:components,id',
            'components.ram' => 'nullable|integer|exists:components,id',
            'components.gpu' => 'nullable|integer|exists:components,id',
            'components.psu' => 'nullable|integer|exists:components,id',
            'components.case' => 'nullable|integer|exists:components,id',
        ])->validate();
        
        try {
            $result = $this->compatibilityService
                ->checkCompatibility($validated['components']);
            
            return response()->json([
                'status' => 'success',
                'passed' => $result['passed'],
                'alerts' => $result['alerts'],
            ]);
        } catch (\\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi kiểm tra',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

---

#### **[4] Migration**

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

#### **[5] Seeder**

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
        ]);
    }
}
```

---

#### **[6] Routes: api.php**

**Thêm vào**: `routes/api.php`

```php
Route::post('/compatibility/check', [
    \App\Http\Controllers\Api\CompatibilityController::class,
    'check'
]);  // Public endpoint - không cần token
```

---

#### **[7] Unit Test**

**Đường dẫn**: `tests/Unit/CompatibilityServiceTest.php`

```php
<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CompatibilityService;

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
            'psu' => 45,  // Không đủ
        ]);
        $this->assertFalse($result['passed']);
    }
}
```

---

### 12.4 Danh Sách Checklist Nộp

- [ ] **Code Files (7 file)**
  - [ ] CompatibilityRule.php
  - [ ] CompatibilityService.php (5 methods)
  - [ ] CompatibilityController.php
  - [ ] Migration file
  - [ ] CompatibilityRuleSeeder.php
  - [ ] routes/api.php (updated)
  - [ ] CompatibilityServiceTest.php

- [ ] **Database**
  - [ ] Migration chạy thành công
  - [ ] Seeder chạy thành công
  - [ ] 4 rules được tạo

- [ ] **Testing**
  - [ ] Tối thiểu 3 unit tests
  - [ ] API test qua Postman/curl

- [ ] **Documentation (Báo cáo PDF/Word 8-10 trang)**
  - [ ] 1. Giới thiệu yêu cầu
  - [ ] 2. Thiết kế kiến trúc (diagram)
  - [ ] 3. Chi tiết implementation
  - [ ] 4. Kết quả test
  - [ ] 5. API documentation
  - [ ] Phụ lục: Source code

---

### 12.5 Cách Chạy Thử

```bash
# 1. Copy files vào project

# 2. Chạy migration
php artisan migrate --seed

# 3. Chạy tests
php artisan test tests/Unit/CompatibilityServiceTest.php

# 4. Test API
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
```

---

### 12.6 Nội Dung Báo Cáo (8-10 trang)

| Phần | Nội dung | Trang |
|------|---------|-------|
| 1 | Giới thiệu + Yêu cầu | 1-2 |
| 2 | Thiết kế kiến trúc (diagram) | 2-3 |
| 3 | Chi tiết implementation (5 methods) | 4-6 |
| 4 | Kết quả test (screenshot) | 6-7 |
| 5 | API documentation + examples | 7-8 |
| 6 | Kết luận | 8-9 |
| Phụ lục | Source code (file listing) | 9-10 |

---

**✅ Khi hoàn thành, nộp:**
1. Source code (GitHub/ZIP)
2. Báo cáo PDF
3. Test screenshots
4. README hướng dẫn chạy

*Hướng dẫn được tạo ngày 28/04/2026*
