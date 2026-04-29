<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedBuild extends Model
{
    protected $fillable = [
        'name', 'tag', 'tag_color', 'subtitle', 'image', 'rating', 'component_ids', 'component_quantities', 'is_active',
    ];

    protected $casts = [
        'component_ids' => 'array',
        'component_quantities' => 'array',
        'rating' => 'decimal:1',
        'is_active' => 'boolean',
    ];
}
