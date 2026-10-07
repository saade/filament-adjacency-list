<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Support\Enums\Size;
use Illuminate\Auth\Access\AuthorizationException;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class IndentAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'indent';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-arrow-right')->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.indent.label'));

        $this->size(Size::ExtraSmall);

        $this->action(
            function (Component $component, array $arguments): void {
                $component->indentItem($component->getItemStatePath($arguments));

                $component->saveReorderedRelationships();
            }
        );

        $this->visible(
            fn (Component $component): bool => $component->isIndentable()
        );

        $this->authorize(function (Component $component, array $arguments): bool {
            try {
                $record = $component->getRelatedModel() ? $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']) : null;

                return ! $record || \Filament\authorize('update', $record)->allowed();
            } catch (AuthorizationException $exception) {
                return $exception->toResponse()->allowed();
            }
        });
    }
}
