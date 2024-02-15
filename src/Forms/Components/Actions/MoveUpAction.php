<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Support\Enums\ActionSize;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class MoveUpAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'moveUp';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-arrow-up')->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.moveUp.label'));

        $this->size(ActionSize::ExtraSmall);

        $this->action(
            function (Component $component, array $arguments): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $state = $component->getState();

                $parentPath = Str::beforeLast($statePath, '.');
                $uuid = Str::afterLast($statePath, '.');

                $parent = data_get($state, $parentPath);
                $hasMoved = false;

                if ($parentPath === $uuid) {
                    $parent = $state;
                }

                uksort($parent, function ($_, $b) use ($uuid, &$hasMoved) {
                    if ($b === $uuid && ! $hasMoved) {
                        $hasMoved = true;

                        return 1;
                    }

                    return 0;
                });

                if ($parentPath === $uuid) {
                    $state = $parent;
                } else {
                    data_set($state, $parentPath, $parent);
                }

                $component->state($state);
            }
        );

        $this->visible(
            fn (Component $component): bool => $component->isMoveable()
        );
    }
}
