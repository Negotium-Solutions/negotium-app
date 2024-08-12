<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\Admin\ProfileManagerController;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\StepController;

Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/document', [DocumentController::class, 'index'])->name('document');
    Route::get('/document/create', [DocumentController::class, 'create'])->name('document.create');
    Route::post('/document/store', [DocumentController::class, 'store'])->name('document.store');
    Route::get('/document/edit/{id}', [DocumentController::class, 'edit'])->name('document.edit');

    // Profile Manager
    Route::get('/profile-manager', [ProfileManagerController::class, 'index'])->name('profile-manager');

    // Profiles
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::get('/profile/details', [ProfileController::class, 'details'])->name('profile.details');

    Route::get('/process', [ProcessController::class, 'index'])->name('process');
    Route::get('/process/create', [ProcessController::class, 'create'])->name('process.create');
    Route::get('/process/edit/{process_id}', [ProcessController::class, 'edit'])->name('process.edit');
    Route::get('/process/edit/{process_id}/{step_id?}', [ProcessController::class, 'edit'])->name('process.edit');

    Route::get('/step/create/{process_id}', [StepController::class, 'create'])->name('step.create');
});

require __DIR__.'/auth.php';
