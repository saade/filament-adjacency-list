<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pages;

use Filament\Forms\FormsComponent;
use Filament\Schemas\Schema;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;

class AdjacencyListPage extends FormsComponent
{
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
                    ->labelKey('label'),
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
