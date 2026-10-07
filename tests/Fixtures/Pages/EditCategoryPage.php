<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pages;

use Closure;
use Filament\Forms\Components\TextInput;
use Filament\Forms\FormsComponent;
use Filament\Schemas\Schema;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Models\Category;

class EditCategoryPage extends FormsComponent
{
    public static ?Closure $configureBeforeRelationship = null;

    public static ?Closure $configureAfterRelationship = null;

    public Category $record;

    /** @var array<string, mixed> */
    public array $data = [];

    public function mount(): void
    {
        $this->form->fill($this->record->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        $list = AdjacencyList::make('descendants');

        if (static::$configureBeforeRelationship) {
            (static::$configureBeforeRelationship)($list);
        }

        $list
            ->relationship('descendants')
            ->labelKey('name')
            ->orderColumn('sort')
            ->schema([
                TextInput::make('name')->required(),
            ]);

        if (static::$configureAfterRelationship) {
            (static::$configureAfterRelationship)($list);
        }

        return $schema
            ->statePath('data')
            ->model($this->record)
            ->components([
                TextInput::make('name'),
                $list,
            ]);
    }

    public function save(): void
    {
        $this->record->update(['name' => $this->form->getState()['name']]);

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
