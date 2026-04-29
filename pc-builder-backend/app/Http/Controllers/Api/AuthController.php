<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    // Hàm xử lý đăng nhập
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác!'
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng nhập thành công!',
            'token' => $token,
            'user' => $user,
            'role' => $user->role,
        ]);
    }

    // Hàm xử lý đăng ký tài khoản khách hàng
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'username' => explode('@', $request->email)[0],
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng ký thành công!',
            'token' => $token,
            'user' => $user
        ], 201);
    }

    // Hàm lấy thông tin user hiện tại
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => $request->user()
        ]);
    }

    // Admin tạo tài khoản Manager
    public function createManager(Request $request)
    {
        // Chỉ admin mới được tạo manager
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền thực hiện!'], 403);
        }

        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'username' => 'sometimes|string|max:50|unique:users,username',
        ]);

        $user = User::create([
            'username' => $request->username ?? explode('@', $request->email)[0],
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'manager',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo tài khoản Manager thành công!',
            'user' => $user,
        ], 201);
    }

    // Lấy danh sách managers (chỉ admin)
    public function listManagers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền!'], 403);
        }

        $managers = User::where('role', 'manager')->get();

        return response()->json([
            'status' => 'success',
            'data' => $managers,
        ]);
    }

    // Xóa manager (chỉ admin)
    public function deleteManager(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền!'], 403);
        }

        $manager = User::where('id', $id)->where('role', 'manager')->first();
        if (!$manager) {
            return response()->json(['message' => 'Không tìm thấy manager!'], 404);
        }

        // Xóa token trước, rồi xóa user
        $manager->tokens()->delete();
        $manager->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa tài khoản manager!',
        ]);
    }

    // Lấy danh sách user — Admin thấy user+manager, Manager chỉ thấy user
    public function listUsers(Request $request)
    {
        $currentRole = $request->user()->role;

        if ($currentRole === 'admin') {
            // Admin thấy tất cả trừ admin
            $users = User::whereIn('role', ['user', 'manager'])->orderBy('id', 'desc')->get();
        } else {
            // Manager chỉ thấy user
            $users = User::where('role', 'user')->orderBy('id', 'desc')->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    // Xóa tài khoản user (admin xóa user/manager, manager chỉ xóa user)
    public function deleteUser(Request $request, $id)
    {
        $currentRole = $request->user()->role;
        $target = User::find($id);

        if (!$target) {
            return response()->json(['message' => 'Không tìm thấy tài khoản!'], 404);
        }

        // Không ai được xóa admin
        if ($target->role === 'admin') {
            return response()->json(['message' => 'Không thể xóa tài khoản admin!'], 403);
        }

        // Manager chỉ được xóa user, không được xóa manager khác
        if ($currentRole === 'manager' && $target->role !== 'user') {
            return response()->json(['message' => 'Bạn không có quyền xóa tài khoản này!'], 403);
        }

        $target->tokens()->delete();
        $target->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa tài khoản!',
        ]);
    }

    // Đổi mật khẩu (tất cả user đã đăng nhập)
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không chính xác!'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Đổi mật khẩu thành công!',
        ]);
    }

    // Cập nhật thông tin cá nhân
    public function updateProfile(Request $request)
    {
        $request->validate([
            'username' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'date_of_birth' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $user->fill($request->only(['username', 'email', 'date_of_birth', 'phone', 'address']));
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin thành công!',
            'user' => $user,
        ]);
    }

    // Upload avatar
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:png,jpeg,jpg|max:4096|dimensions:max_width=2000,max_height=2000',
        ]);

        $user = $request->user();

        // Xóa avatar cũ nếu có
        if ($user->avatar) {
            $oldPath = str_replace('/storage/', '', $user->avatar);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = '/storage/' . $path;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật avatar thành công!',
            'avatar_url' => $user->avatar,
            'user' => $user,
        ]);
    }

    // Quên mật khẩu — sinh mật khẩu tạm, gửi qua email
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
        ]);

        $user = User::where('username', $request->username)
                     ->orWhere('email', $request->username)
                     ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy tài khoản!'
            ], 404);
        }

        // Sinh mật khẩu ngẫu nhiên 10 ký tự (chữ hoa, chữ thường, số)
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $tempPassword = '';
        for ($i = 0; $i < 10; $i++) {
            $tempPassword .= $chars[random_int(0, strlen($chars) - 1)];
        }

        // Cập nhật mật khẩu mới trong DB
        $user->password = Hash::make($tempPassword);
        $user->save();

        // Gửi email
        Mail::raw("Chào bạn, mật khẩu mới của bạn là: {$tempPassword}", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Khôi phục mật khẩu - PC Builder Pro');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Mật khẩu mới đã được gửi đến email của bạn!',
            'email_hint' => $this->maskEmail($user->email),
        ]);
    }

    // Đặt lại mật khẩu (sau khi nhận mật khẩu tạm từ email)
    public function resetPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'temp_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::where('username', $request->username)
                     ->orWhere('email', $request->username)
                     ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy tài khoản!'
            ], 404);
        }

        if (!Hash::check($request->temp_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu tạm thời không chính xác!'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.',
        ]);
    }

    // Ẩn bớt email: abc@gmail.com → a***@gmail.com
    private function maskEmail($email)
    {
        $parts = explode('@', $email);
        $name = $parts[0];
        $masked = $name[0] . str_repeat('*', max(strlen($name) - 1, 2));
        return $masked . '@' . $parts[1];
    }
}