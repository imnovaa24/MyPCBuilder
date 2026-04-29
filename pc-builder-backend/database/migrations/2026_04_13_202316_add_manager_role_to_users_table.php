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
        // Thay đổi enum role: thêm 'manager'
        \DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'manager') DEFAULT 'user'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user') DEFAULT NULL");
    }
};
