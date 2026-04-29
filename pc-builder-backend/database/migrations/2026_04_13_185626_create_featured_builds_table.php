<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('featured_builds', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tag');
            $table->string('tag_color')->default('bg-primary');
            $table->string('subtitle')->nullable();
            $table->text('image')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->json('component_ids'); // {"1": 2, "2": 4, "3": 6, ...} category_id => component_id
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_builds');
    }
};
