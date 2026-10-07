<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pages;

use Filament\Forms\Components\TextInput;
use Filament\Forms\FormsComponent;
use Filament\Schemas\Schema;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Models\Category;

class CreateCategoryPage extends FormsComponent
{
    /** @var class-string<Category> | null */
    public static ?string $model = Category::class;

    /** @var array<string, mixed> */
    public array $data = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->model(static::$model)
            ->components([
                TextInput::make('name'),
                AdjacencyList::make('descendants')
                    ->relationship('descendants')
                    ->labelKey('name')
                    ->orderColumn('sort')
                    ->schema([
                        TextInput::make('name')->required(),
                    ]),
            ]);
    }

    public function create(): void
    {
        $record = Category::create(['name' => $this->form->getState()['name']]);

        $this->form->model($record)->saveRelationships();
    }

    public function render(): string
    {
        return <<<'HTML'
        <div>
            <form wire:submit="create">
                {{ $this->form }}
                <button type="submit">Create</button>
            </form>
        </div>
        HTML;
    }
}
