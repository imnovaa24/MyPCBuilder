<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompatibilityRule;
use Illuminate\Http\Request;

class CompatibilityRuleController extends Controller
{
    public function index()
    {
        $rules = CompatibilityRule::orderBy('id')->get();
        return response()->json(['status' => 'success', 'data' => $rules]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rule_code'     => 'required|string|max:100|unique:compatibility_rules,rule_code',
            'description'   => 'required|string|max:500',
            'error_message' => 'required|string|max:500',
            'config'        => 'nullable|string',
            'is_active'     => 'boolean',
            'severity'      => 'in:error,warning',
        ]);

        $rule = CompatibilityRule::create([
            'rule_code'     => strtoupper(trim($validated['rule_code'])),
            'description'   => $validated['description'],
            'error_message' => $validated['error_message'],
            'config'        => $validated['config'] ? json_decode($validated['config'], true) : null,
            'is_active'     => $validated['is_active'] ?? true,
            'severity'      => $validated['severity'] ?? 'error',
        ]);

        return response()->json(['status' => 'success', 'message' => 'Đã thêm luật mới!', 'data' => $rule], 201);
    }

    public function update(Request $request, $id)
    {
        $rule = CompatibilityRule::findOrFail($id);

        $validated = $request->validate([
            'rule_code'     => 'sometimes|string|max:100|unique:compatibility_rules,rule_code,' . $id,
            'description'   => 'sometimes|string|max:500',
            'error_message' => 'sometimes|string|max:500',
            'config'        => 'nullable|string',
            'is_active'     => 'sometimes|boolean',
            'severity'      => 'sometimes|in:error,warning',
        ]);

        if (isset($validated['rule_code'])) {
            $validated['rule_code'] = strtoupper(trim($validated['rule_code']));
        }
        if (array_key_exists('config', $validated)) {
            $validated['config'] = $validated['config'] ? json_decode($validated['config'], true) : null;
        }

        $rule->update($validated);

        return response()->json(['status' => 'success', 'message' => 'Đã cập nhật luật!', 'data' => $rule]);
    }

    public function toggleActive($id)
    {
        $rule = CompatibilityRule::findOrFail($id);
        $rule->is_active = !$rule->is_active;
        $rule->save();

        $status = $rule->is_active ? 'bật' : 'tắt';
        return response()->json(['status' => 'success', 'message' => "Đã {$status} luật '{$rule->rule_code}'!", 'data' => $rule]);
    }

    public function destroy($id)
    {
        $rule = CompatibilityRule::findOrFail($id);
        $code = $rule->rule_code;
        $rule->delete();

        return response()->json(['status' => 'success', 'message' => "Đã xóa luật '{$code}'!"]);
    }
}
