<?php

declare(strict_types=1);

namespace Tests\Fixtures\Models;

use Illuminate\Database\Eloquent\Model;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasGraphRelationships;

class Node extends Model
{
    use HasGraphRelationships;

    protected $fillable = ['name', 'sort'];

    public function getPivotTableName(): string
    {
        return 'edges';
    }
}
