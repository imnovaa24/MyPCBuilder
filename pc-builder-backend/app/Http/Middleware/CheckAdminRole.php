<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, ['admin', 'manager'])) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập! Chỉ Admin và Manager được phép.'
            ], 403);
        }

        return $next($request);
    }
}
