<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedBuild extends Model
{
    protected $fillable = [
        'user_id', 'name', 'components', 'total_min_price', 'total_max_price'
    ];

    protected $casts = [
        'components' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
