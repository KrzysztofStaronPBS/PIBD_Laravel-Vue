<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->task_title,
            'description' => $this->description,
            'due_date'    => $this->due_date,
            'completed'   => $this->status === 'completed',
            'created_at'  => $this->created_at,
        ];
    }
}
