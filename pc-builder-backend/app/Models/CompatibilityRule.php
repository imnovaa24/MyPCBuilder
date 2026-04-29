<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompatibilityRule extends Model
{
    protected $fillable = [
        'rule_code', 'description', 'config', 'error_message', 'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];
}
