<?php

namespace Saade\FilamentAdjacencyList\Foms\Components\Actions;

use Filament\Forms\Components\Actions\Action;
use Filament\Support\Enums\ActionSize;
use Saade\FilamentAdjacencyList\Foms\Components\AdjacencyList;

class DeleteAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'delete';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-trash')->color('danger');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.label'));

        $this->modalIcon('heroicon-o-trash');

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.actions.confirm'));

        $this->action(
            function (array $arguments, AdjacencyList $component): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $items = $component->getState();

                data_forget($items, $statePath);

                $component->state($items);
            }
        );

        $this->size(ActionSize::ExtraSmall);

        $this->visible(
            fn (AdjacencyList $component): bool => $component->isDeletable()
        );
    }
}
