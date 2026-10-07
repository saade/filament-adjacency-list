<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pages;

use Closure;
use Filament\Forms\Components\TextInput;
use Filament\Forms\FormsComponent;
use Filament\Schemas\Schema;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;

class AdjacencyListPage extends FormsComponent
{
    public static ?Closure $configure = null;

    /** @var array<string, mixed> */
    public array $data = [];

    public function mount(): void
    {
        $this->setErrorBag([]);
        $this->form->fill();
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                AdjacencyList::make('items')
                    ->labelKey('label')
                    ->schema([
                        TextInput::make('label'),
                    ])
                    ->when(filled(static::$configure), static::$configure ?? fn () => null),
            ]);
    }

    public function submit(): void
    {
        $this->form->getState();
    }

    public function render(): string
    {
        return <<<'HTML'
        <div>
            <form wire:submit="submit">
                {{ $this->form }}
                <button type="submit">Save</button>
            </form>
        </div>
        HTML;
    }
}
