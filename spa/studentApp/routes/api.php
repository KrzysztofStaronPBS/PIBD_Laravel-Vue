<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\StudentTaskController;

// endpointy publiczne - dostępne bez logowanie
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// endpointy prywatne - wymagają ważnego tokenu Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // zabezpieczenie pełnego CRUD dla studentów i zadań
    Route::apiResource('students', StudentController::class);
    Route::apiResource('tasks', TaskController::class);

    // trasy do zarządzania zadaniami konkretnego studenta
    Route::get('students/{student}/tasks', [StudentTaskController::class, 'index']);
    Route::post('students/{student}/tasks', [StudentTaskController::class, 'sync']);
});
