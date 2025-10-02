<?php

namespace Saade\FilamentAdjacencyList\Widgets;

use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Filament\Support\Concerns\CanBeContained;
use Filament\Support\Concerns\EvaluatesClosures;
use Filament\Widgets\Widget;
use Illuminate\Database\Eloquent\Model;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;

class AdjacencyListWidget extends Widget implements HasActions, HasForms
{
    use CanBeContained;
    use EvaluatesClosures;
    use InteractsWithActions;
    use InteractsWithForms;

    protected string $view = 'filament-adjacency-list::widget';

    protected int | string | array $columnSpan = 'full';

    protected static string $relationshipName = 'descendants';

    public ?Model $model = null;

    public ?array $data = [];

    public function mount(): void
    {
        $this->model = $this->getModel();

        $this->form->fill(
            $this->model?->toArray()
        );
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                $this->adjacencyList(
                    $this->makeAdjacencyList()
                ),
            ])
            ->statePath('data')
            ->model($this->model);
    }

    protected function getModel(): ?Model
    {
        return $this->record ?? null;
    }

    protected function adjacencyList(AdjacencyList $adjacencyList): AdjacencyList
    {
        return $adjacencyList;
    }

    protected function makeAdjacencyList(): AdjacencyList
    {
        return AdjacencyList::make(static::$relationshipName)
            ->relationship();
    }
}
