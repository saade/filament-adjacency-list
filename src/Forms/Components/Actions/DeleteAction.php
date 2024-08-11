<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Support\Enums\ActionSize;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

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

        $this->size(ActionSize::ExtraSmall);

        $this->modalIcon('heroicon-o-trash');

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.actions.confirm'));

        $this->action(function (Component $component, array $arguments): void {
            $record = $component->getRelatedModel() ? $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']) : null;

            $this->process(function (Component $component, array $arguments): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $items = $component->getState();

                data_forget($items, $statePath);

                $component->state($items);
            }, ['record' => $record]);
        });

        $this->visible(
            fn (Component $component): bool => $component->isDeletable()
        );
    }
}
