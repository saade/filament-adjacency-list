<?php

namespace Saade\FilamentAdjacencyList\Foms\Components\Actions;

use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Saade\FilamentAdjacencyList\Foms\Components\AdjacencyList;
use Illuminate\Support\Str;

class ReorderAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'reorder';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-arrows-up-down')->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.reorder.label'));

        $this->livewireClickHandlerEnabled(false);

        $this->extraAttributes(['data-sortable-handle' => 'true']);

        $this->size(ActionSize::Small);

        $this->visible(
            fn (AdjacencyList $component): bool => $component->isReorderable()
        );
    }
}
