<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Support\Enums\ActionSize;
use Illuminate\Auth\Access\AuthorizationException;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

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

        $this->size(ActionSize::ExtraSmall);

        $this->visible(
            fn (Component $component): bool => $component->isReorderable()
        );

        $this->authorize(function (Component $component, array $arguments): bool {
            try {
                $record = $component->getRelatedModel() ? $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']) : null;

                return ! $record || \Filament\authorize('reorder', $record)->allowed();
            } catch (AuthorizationException $exception) {
                return $exception->toResponse()->allowed();
            }
        });
    }
}
