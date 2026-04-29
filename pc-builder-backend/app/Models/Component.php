<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Dùng cho chức năng Xóa mềm

class Component extends Model
{
    use SoftDeletes; // Kích hoạt xóa mềm (deleted_at)

    protected $table = 'components'; // Chỉ định đúng tên bảng

    // Cho phép điền dữ liệu vào các cột này khi thêm/sửa
    protected $fillable = [
        'category_id', 'brand', 'name', 'min_price', 'max_price', 'image_url', 'specifications'
    ];

    // Khai báo cột specifications là dạng mảng/JSON
    protected $casts = [
        'specifications' => 'array',
    ];
}