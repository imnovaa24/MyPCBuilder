<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ComponentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompatibilityController;
use App\Http\Controllers\Api\FeaturedBuildController;
use App\Models\Category;
use App\Models\SavedBuild;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// API Xem danh sách (Mở cửa tự do cho Khách vãng lai xem để Build PC)
Route::get('/components', [ComponentController::class, 'index']);

// API Kiểm tra tương thích linh kiện (Mở cửa tự do)
Route::post('/compatibility/check', [CompatibilityController::class, 'check']);

// API Cấu hình nổi bật (Mở cửa tự do)
Route::get('/featured-builds', [FeaturedBuildController::class, 'index']);
Route::get('/featured-builds/{id}', [FeaturedBuildController::class, 'show']);

// ==========================================
// KHU VỰC BẢO MẬT (Cần đăng nhập)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // Lấy thông tin user hiện tại
    Route::get('/me', [AuthController::class, 'me']);

    // Đổi mật khẩu (tất cả user đã đăng nhập)
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Cập nhật thông tin cá nhân
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Upload avatar
    Route::post('/profile/avatar', [AuthController::class, 'uploadAvatar']);

    // ==========================================
    // QUẢN TRỊ (Chỉ Admin + Manager)
    // ==========================================
    Route::middleware('role.admin')->group(function () {
        // Thêm linh kiện mới
        Route::post('/components', [ComponentController::class, 'store']);
        
        // Sửa linh kiện
        Route::put('/components/{id}', [ComponentController::class, 'update']);
        
        // Xóa linh kiện
        Route::delete('/components/{id}', [ComponentController::class, 'destroy']);

        // Sửa cấu hình phổ biến (Featured Builds)
        Route::post('/featured-builds', [FeaturedBuildController::class, 'store']);
        Route::put('/featured-builds/{id}', [FeaturedBuildController::class, 'update']);
        Route::delete('/featured-builds/{id}', [FeaturedBuildController::class, 'destroy']);

        // ==========================================
        // Quản lý tài khoản User (Admin + Manager)
        // ==========================================
        Route::get('/users', [AuthController::class, 'listUsers']);
        Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);

        // ==========================================
        // CHỈ ADMIN: Quản lý Manager
        // ==========================================
        Route::post('/managers', [AuthController::class, 'createManager']);
        Route::get('/managers', [AuthController::class, 'listManagers']);
        Route::delete('/managers/{id}', [AuthController::class, 'deleteManager']);
    });

    // ==========================================
    // API CẤU HÌNH ĐÃ LƯU (Saved Builds - Tất cả user đã đăng nhập)
    // ==========================================
    // Lấy danh sách cấu hình đã lưu của user
    Route::get('/saved-builds', function (Illuminate\Http\Request $request) {
        $builds = SavedBuild::where('user_id', $request->user()->id)
            ->orderBy('id', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $builds]);
    });

    // Lưu cấu hình mới
    Route::post('/saved-builds', function (Illuminate\Http\Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'components' => 'required|array',
            'total_min_price' => 'required|integer',
            'total_max_price' => 'required|integer',
        ]);

        $build = SavedBuild::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'components' => $request->components,
            'total_min_price' => $request->total_min_price,
            'total_max_price' => $request->total_max_price,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Đã lưu cấu hình!',
            'data' => $build
        ], 201);
    });

    // Xóa cấu hình đã lưu
    Route::delete('/saved-builds/{id}', function (Illuminate\Http\Request $request, $id) {
        $build = SavedBuild::where('id', $id)
            ->where('user_id', $request->user()->id)->first();
        if (!$build) {
            return response()->json(['message' => 'Không tìm thấy!'], 404);
        }
        $build->delete();
        return response()->json(['status' => 'success', 'message' => 'Đã xóa cấu hình!']);
    });
    
});


// API lấy danh sách các loại linh kiện
Route::get('/categories', function () {
    return response()->json([
        'status' => 'success',
        'data' => Category::all()
    ]);
});
Route::post('/compatibility/check', [
    \App\Http\Controllers\Api\CompatibilityController::class,
    'check'
]);