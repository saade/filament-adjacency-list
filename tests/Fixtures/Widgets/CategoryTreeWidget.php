<?php

declare(strict_types=1);

namespace Tests\Fixtures\Widgets;

use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Model;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Saade\FilamentAdjacencyList\Widgets\AdjacencyListWidget;

class CategoryTreeWidget extends AdjacencyListWidget
{
    public ?Model $record = null;

    protected function adjacencyList(AdjacencyList $adjacencyList): AdjacencyList
    {
        return $adjacencyList
            ->labelKey('name')
            ->orderColumn('sort')
            ->schema([
                TextInput::make('name')->required(),
            ]);
    }
}
