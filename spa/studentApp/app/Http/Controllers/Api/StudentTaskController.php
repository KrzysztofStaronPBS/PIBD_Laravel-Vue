<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentTaskController extends Controller
{
    // pobierz zadania przypisane do studenta
    public function index(Student $student)
    {
        $attached = $student->tasks->mapWithKeys(function ($task) {
            return [$task->id => [
                'status' => $task->pivot->status,
                'due_date' => $task->pivot->due_date ? date('Y-m-d', strtotime($task->pivot->due_date)) : null,
            ]];
        });

        return response()->json([
            'attached' => $attached
        ]);
    }

    // synchronizuj zadania studenta wraz z terminami i statusami
    public function sync(Request $request, Student $student)
    {
        $request->validate([
            'tasks' => 'array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.status' => 'required|in:pending,completed,failed',
            'tasks.*.due_date' => 'nullable|date'
        ]);

        // przygotowanie tablicy w formacie [id => ['status' => wartość, 'due_date' => wartość]]
        $syncData = [];
        foreach ($request->input('tasks', []) as $taskItem) {
            $syncData[$taskItem['id']] = [
                'status' => $taskItem['status'],
                'due_date' => $taskItem['due_date']
            ];
        }

        // metoda sync() automatycznie zepnie relacje, nadpisując stare dane w pivot
        $student->tasks()->sync($syncData);

        return response()->json(['message' => 'Tasks synchronized successfully']);
    }
}
