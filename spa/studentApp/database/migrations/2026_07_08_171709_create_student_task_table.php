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
        Schema::create('student_task', function (Blueprint $table) {
            $table->id();
            // cascadeOnDelete sprawi, że usunięcie studenta lub zadania automatycznie wyczyści powiązania
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();

            // pola specyficzne dla danej instancji przypisania zadania studentowi
            $table->date('due_date')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_task');
    }
};
