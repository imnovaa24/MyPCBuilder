<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeaturedBuild;
use App\Models\Component;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FeaturedBuildController extends Controller
{
    /**
     * GET /api/featured-builds
     * Trả về danh sách các cấu hình nổi bật (chỉ thông tin tổng quan).
     */
    public function index()
    {
        $builds = FeaturedBuild::where('is_active', true)->get();

        // Tính tổng giá cho mỗi build
        $result = $builds->map(function ($build) {
            $componentIds = is_array($build->component_ids)
                ? $build->component_ids
                : json_decode($build->component_ids, true);

            $ids = array_values($componentIds ?? []);
            $components = Component::whereIn('id', $ids)->get();

            $quantities = is_array($build->component_quantities)
                ? $build->component_quantities
                : (json_decode($build->component_quantities ?? '{}', true) ?: []);

            $totalMin = 0;
            $totalMax = 0;
            foreach ($componentIds as $key => $compId) {
                $comp = $components->firstWhere('id', $compId);
                if ($comp) {
                    $qty = $quantities[$key] ?? 1;
                    $totalMin += $comp->min_price * $qty;
                    $totalMax += $comp->max_price * $qty;
                }
            }

            // Lấy tên mainboard và loại RAM để hiển thị nhanh
            $mainboardName = null;
            $ramType       = null;
            foreach ($componentIds as $key => $compId) {
                $comp = $components->firstWhere('id', $compId);
                if (!$comp) continue;
                $cat = DB::table('categories')->where('id', $comp->category_id)->value('code');
                if ($cat === 'mainboard' && !$mainboardName) {
                    $mainboardName = $comp->name;
                    $specs = is_array($comp->specifications) ? $comp->specifications : json_decode($comp->specifications, true);
                    $ramType = $specs['ram_type'] ?? null;
                }
            }

            return [
                'id' => $build->id,
                'name' => $build->name,
                'tag' => $build->tag,
                'tag_color' => $build->tag_color,
                'subtitle' => $build->subtitle,
                'image' => $build->image,
                'rating' => $build->rating,
                'total_min_price' => $totalMin,
                'total_max_price' => $totalMax,
                'component_count' => $components->count(),
                'mainboard_name' => $mainboardName,
                'ram_type' => $ramType,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $result,
        ]);
    }

    /**
     * GET /api/featured-builds/{id}
     * Trả về chi tiết đầy đủ cấu hình nổi bật, bao gồm thông tin từng linh kiện.
     */
    public function show($id)
    {
        $build = FeaturedBuild::find($id);

        if (!$build) {
            return response()->json(['message' => 'Không tìm thấy cấu hình!'], 404);
        }

        $componentIds = is_array($build->component_ids)
            ? $build->component_ids
            : json_decode($build->component_ids, true);

        // Load category info
        $categories = DB::table('categories')->get()->keyBy('id');

        // Load all components in this build
        $ids = array_values($componentIds ?? []);
        $components = Component::whereIn('id', $ids)->get()->keyBy('id');

        // Build danh sách chi tiết: mỗi item gồm category info + component info
        $details = [];
        foreach ($componentIds as $key => $componentId) {
            // Hỗ trợ virtual key: "8_ssd", "8_hdd" -> categoryId = 8
            $categoryId = preg_replace('/_.*$/', '', $key);
            $cat = $categories->get($categoryId);
            $comp = $components->get($componentId);
            if ($cat && $comp) {
                $details[] = [
                    'category_id' => (int) $categoryId,
                    'category_code' => $cat->code,
                    'category_name' => $cat->name,
                    'component' => $comp,
                ];
            }
        }

        $totalMin = 0;
        $totalMax = 0;
        $quantities = is_array($build->component_quantities)
            ? $build->component_quantities
            : (json_decode($build->component_quantities ?? '{}', true) ?: []);
        foreach ($componentIds as $key => $compId) {
            $comp = $components->get($compId);
            if ($comp) {
                $qty = $quantities[$key] ?? 1;
                $totalMin += $comp->min_price * $qty;
                $totalMax += $comp->max_price * $qty;
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $build->id,
                'name' => $build->name,
                'tag' => $build->tag,
                'tag_color' => $build->tag_color,
                'subtitle' => $build->subtitle,
                'image' => $build->image,
                'rating' => $build->rating,
                'total_min_price' => $totalMin,
                'total_max_price' => $totalMax,
                'component_quantities' => $quantities,
                'components' => $details,
            ],
        ]);
    }

    /**
     * POST /api/featured-builds
     * Tạo mới cấu hình nổi bật.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'tag' => 'required|string|max:100',
            'tag_color' => 'sometimes|string|max:100',
            'subtitle' => 'sometimes|string|max:255',
            'rating' => 'sometimes|numeric|min:0|max:5',
            'component_ids' => 'sometimes|string',
            'component_quantities' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:png,jpeg,jpg,webp|max:4096|dimensions:max_width=2000,max_height=2000',
        ]);

        $build = new FeaturedBuild();
        $build->name = $request->name;
        $build->tag = $request->tag;
        $build->tag_color = $request->input('tag_color', 'bg-primary');
        $build->subtitle = $request->input('subtitle', '');
        $build->rating = $request->input('rating', 0);
        $build->is_active = true;

        if ($request->has('component_ids') && is_string($request->component_ids)) {
            $build->component_ids = json_decode($request->component_ids, true) ?? [];
        } else {
            $build->component_ids = [];
        }

        if ($request->has('component_quantities') && is_string($request->component_quantities)) {
            $build->component_quantities = json_decode($request->component_quantities, true) ?? [];
        } else {
            $build->component_quantities = [];
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('featured-builds', 'public');
            $build->image = '/storage/' . $path;
        }

        $build->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo cấu hình thành công!',
            'data' => $build,
        ], 201);
    }

    /**
     * DELETE /api/featured-builds/{id}
     * Xóa cấu hình nổi bật.
     */
    public function destroy($id)
    {
        $build = FeaturedBuild::find($id);

        if (!$build) {
            return response()->json(['message' => 'Không tìm thấy cấu hình!'], 404);
        }

        // Delete image if local
        if ($build->image && str_starts_with($build->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $build->image);
            Storage::disk('public')->delete($oldPath);
        }

        $build->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa cấu hình!',
        ]);
    }

    /**
     * PUT /api/featured-builds/{id}
     * Cập nhật cấu hình nổi bật (thay đổi linh kiện, tên, tag...).
     */
    public function update(Request $request, $id)
    {
        $build = FeaturedBuild::find($id);

        if (!$build) {
            return response()->json(['message' => 'Không tìm thấy cấu hình!'], 404);
        }

        $request->validate([
            'component_ids' => 'sometimes|string',
            'component_quantities' => 'sometimes|string',
            'name' => 'sometimes|string|max:255',
            'tag' => 'sometimes|string|max:100',
            'tag_color' => 'sometimes|string|max:100',
            'subtitle' => 'sometimes|string|max:255',
            'rating' => 'sometimes|numeric|min:0|max:5',
            'image' => 'sometimes|image|mimes:png,jpeg,jpg,webp|max:4096|dimensions:max_width=2000,max_height=2000',
        ]);

        if ($request->has('component_ids') && is_string($request->component_ids)) {
            $build->component_ids = json_decode($request->component_ids, true);
        }

        if ($request->has('component_quantities') && is_string($request->component_quantities)) {
            $build->component_quantities = json_decode($request->component_quantities, true);
        }

        if ($request->has('name')) {
            $build->name = $request->name;
        }

        if ($request->hasFile('image')) {
            // Delete old image if it's a local file
            if ($build->image && str_starts_with($build->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $build->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('featured-builds', 'public');
            $build->image = '/storage/' . $path;
        }

        $build->fill($request->only(['tag', 'tag_color', 'subtitle', 'rating']));
        $build->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật cấu hình thành công!',
            'data' => $build->fresh(),
        ]);
    }
}
