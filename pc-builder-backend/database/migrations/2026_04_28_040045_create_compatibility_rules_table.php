<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('compatibility_rules', function (Blueprint $table) {
            $table->id();
            $table->string('rule_code')->unique();
            $table->string('description');
            $table->json('config')->nullable();
            $table->text('error_message');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
    
    public function down(): void {
        Schema::dropIfExists('compatibility_rules');
    }
};