<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\Admin\ProfileCreationController;
use App\Http\Controllers\Admin\ProcessManagerController;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\StepController;
use App\Http\Controllers\ProcessExecutionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\BotManController;

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
    Route::get('/profile-creation', [ProfileCreationController::class, 'index'])->name('profile-creation');
    Route::get('/profile-creation/create', [ProfileCreationController::class, 'create'])->name('profile-creation.create');
    Route::get('/profile-creation/edit/{id}/{profile_category_id}/{quick_capture}', [ProfileCreationController::class, 'edit'])->name('profile-creation.edit');
    Route::get('/profile-creation/edit-input/{id}/{profile_category_id}/{quick_capture}', [ProfileCreationController::class, 'editInput'])->name('profile-creation.edit-input');

    // Profiles
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::get('/profile/create/{profile_type_id}', [ProfileController::class, 'create'])->name('profile.create');
    Route::get('/profile/{id?}/processes', [ProfileController::class, 'processes'])->name('profile.processes');
    Route::get('/profile/{id?}/profile-details', [ProfileController::class, 'details'])->name('profile.profile-details');
    Route::get('/profile/{id?}/profile-details/edit', [ProfileController::class, 'editDetails'])->name('profile.profile-details.edit');
    Route::get('/profile/{id?}/documents', [ProfileController::class, 'documents'])->name('profile.documents');
    Route::get('/profile/{id?}/notes', [ProfileController::class, 'notes'])->name('profile.notes');
    Route::get('/profile/{id?}/communications', [ProfileController::class, 'communications'])->name('profile.communications');

    // Process Execution
    Route::get('/process-execution/{profile_id}/edit/{process_id}/{step_id}', [ProcessExecutionController::class, 'edit'])->name('process-execution.edit');

    Route::get('/process', [ProcessController::class, 'index'])->name('process');
    Route::get('/process/create', [ProcessController::class, 'create'])->name('process.create');
    Route::get('/process/edit/{process_id}', [ProcessController::class, 'edit'])->name('process.edit');
    Route::get('/process/edit/{process_id}/{step_id?}', [ProcessController::class, 'edit'])->name('process.edit');

    Route::get('/process-manager', [ProcessManagerController::class, 'index'])->name('process-manager');
    Route::get('/process-manager/create', [ProcessManagerController::class, 'create'])->name('process-manager.create');
    Route::get('/process-manager/edit/{process_id}', [ProcessManagerController::class, 'edit'])->name('process-manager.edit');
    Route::get('/process-manager/edit/{process_id}/{step_id?}', [ProcessManagerController::class, 'edit'])->name('process-manager.edit');
    Route::get('/process-manager/edit-activity/{process_id}/{step_id?}', [ProcessManagerController::class, 'editActivity'])->name('process-manager.edit-activity');

    Route::get('/step/create/{process_id}', [StepController::class, 'create'])->name('step.create');
    
    // Profiles
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');

    Route::match(['get', 'post'], '/botman', [BotManController::class, 'handle']);
});

require __DIR__.'/auth.php';
