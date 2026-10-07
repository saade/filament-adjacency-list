<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pages;

use Filament\Forms\Components\TextInput;
use Filament\Forms\FormsComponent;
use Filament\Schemas\Schema;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Models\Node;

class EditNodePage extends FormsComponent
{
    public static bool $isOrdered = false;

    public Node $record;

    /** @var array<string, mixed> */
    public array $data = [];

    public function mount(): void
    {
        $this->form->fill($this->record->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->model($this->record)
            ->components([
                AdjacencyList::make('descendants')
                    ->relationship('descendants')
                    ->labelKey('name')
                    ->orderColumn(static::$isOrdered ? 'sort' : null)
                    ->schema([
                        TextInput::make('name')->required(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $this->form->getState();

        $this->form->model($this->record)->saveRelationships();
    }

    public function render(): string
    {
        return <<<'HTML'
        <div>
            <form wire:submit="save">
                {{ $this->form }}
                <button type="submit">Save</button>
            </form>
        </div>
        HTML;
    }
}
