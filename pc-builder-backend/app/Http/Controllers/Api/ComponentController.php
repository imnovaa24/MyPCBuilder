<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Component;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ComponentController extends Controller
{
    // Hàm lấy toàn bộ danh sách linh kiện
    public function index()
    {
        // Lấy tất cả linh kiện, kèm theo việc sắp xếp mới nhất lên đầu
        $components = Component::orderBy('id', 'desc')->get();

        // Trả về định dạng JSON kèm mã trạng thái 200 (Thành công)
        return response()->json([
            'status' => 'success',
            'data' => $components
        ], 200);
        
    }
    // 1. HÀM THÊM MỚI (CREATE)
    public function store(Request $request)
    {
        // Kiểm tra dữ liệu đầu vào (Validation) để tránh lỗi Database
        $validatedData = $request->validate([
            'category_id' => 'required|integer',
            'brand' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'min_price' => 'required|integer',
            'max_price' => 'required|integer',
            'specifications' => 'required|array',
            'image' => 'nullable|image|mimes:png,jpeg,jpg|max:4096|dimensions:max_width=2000,max_height=2000',
        ]);

        // Upload ảnh nếu có
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('components', 'public');
            $validatedData['image_url'] = '/storage/' . $path;
        }

        unset($validatedData['image']);

        // Lưu vào Database
        $component = Component::create($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm linh kiện thành công!',
            'data' => $component
        ], 201); // 201 là mã trạng thái: Đã tạo mới
    }

    // 2. HÀM CHỈNH SỬA (UPDATE)
    public function update(Request $request, $id)
    {
        // Tìm linh kiện theo ID
        $component = Component::find($id);

        if (!$component) {
            return response()->json(['message' => 'Không tìm thấy linh kiện!'], 404);
        }

        $validatedData = $request->validate([
            'category_id' => 'sometimes|integer',
            'brand' => 'sometimes|string|max:100',
            'name' => 'sometimes|string|max:255',
            'min_price' => 'sometimes|integer',
            'max_price' => 'sometimes|integer',
            'specifications' => 'sometimes|array',
            'image' => 'nullable|image|mimes:png,jpeg,jpg|max:4096|dimensions:max_width=2000,max_height=2000',
        ]);

        // Upload ảnh nếu có
        if ($request->hasFile('image')) {
            // Xóa ảnh cũ nếu có
            if ($component->image_url) {
                $oldPath = str_replace('/storage/', '', $component->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('components', 'public');
            $validatedData['image_url'] = '/storage/' . $path;
        }

        unset($validatedData['image']);

        $component->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thành công!',
            'data' => $component
        ]);
    }

    // 3. HÀM XÓA (DELETE)
    public function destroy($id)
    {
        $component = Component::find($id);

        if (!$component) {
            return response()->json(['message' => 'Không tìm thấy linh kiện!'], 404);
        }

        // Nhờ lúc trước chúng ta đã khai báo SoftDeletes ở Model, 
        // lệnh delete() này sẽ chỉ cập nhật ngày giờ vào cột deleted_at chứ không xóa hẳn khỏi ổ cứng.
        $component->delete(); 

        return response()->json([
            'status' => 'success',
            'message' => 'Đã đưa linh kiện vào thùng rác!'
        ]);
    }
}