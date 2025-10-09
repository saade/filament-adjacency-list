<?php

namespace Saade\FilamentAdjacencyList\Widgets;

use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Widgets;
use Illuminate\Database\Eloquent\Model;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;

/**
 * @property \Filament\Forms\ComponentContainer $form
 */
class AdjacencyListWidget extends Widgets\Widget implements HasForms
{
    use InteractsWithForms;

    protected static string $view = 'filament-adjacency-list::widget';

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

    public function form(Form $form): Form
    {
        return $form
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
