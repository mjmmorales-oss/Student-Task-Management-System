<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // READ
    public function index()
    {
        return response()->json(Task::latest()->get());
    }
    // CREATE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:Pending,Completed',
            'priority' => 'required|in:Low,Medium,High'
        ]);
        $task = Task::create($validated);
        return response()->json([
            'message' => 'Task created successfully.',
            'task' => $task
        ], 201);
    }
    // READ SINGLE RECORD
    public function show(Task $task)
    {
        return response()->json($task);
    }
    // UPDATE
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([

            'title' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:Pending,Completed',
            'priority' => 'required|in:Low,Medium,High'
        ]);
        $task->update($validated);
        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task
        ]);
    }
    // DELETE
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json([
            'message' => 'Task deleted successfully.'
        ]);
    }
}
