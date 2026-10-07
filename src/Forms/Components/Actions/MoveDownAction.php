<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Support\Enums\Size;
use Illuminate\Auth\Access\AuthorizationException;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class MoveDownAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'moveDown';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-arrow-down')->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.moveDown.label'));

        $this->size(Size::ExtraSmall);

        $this->action(
            function (Component $component, array $arguments): void {
                $component->moveItem($component->getItemStatePath($arguments), 1);

                $component->saveReorderedRelationships();
            }
        );

        $this->visible(
            fn (Component $component): bool => $component->isMoveable()
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
