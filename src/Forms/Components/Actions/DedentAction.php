<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Support\Enums\ActionSize;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class DedentAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'dedent';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-arrow-left')->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.dedent.label'));

        $this->size(ActionSize::ExtraSmall);

        $this->action(
            function (Component $component, array $arguments): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $state = $component->getState();

                $item = data_get($state, $statePath);
                $uuid = (string) Str::afterLast($statePath, '.');

                $parentPath = (string) Str::beforeLast($statePath, '.');
                $parent = data_get($state, $parentPath);

                $pathToMoveInto = (string) Str::of($statePath)->beforeLast('.')->rtrim('.children')->beforeLast('.');
                $pathToMoveIntoData = data_get($state, $pathToMoveInto);

                if (array_key_exists($pathToMoveInto, $state) || ! str_contains($pathToMoveInto, '.children')) {
                    data_set($state, $uuid, $item);
                } else {
                    $pathToMoveIntoData[$uuid] = $item;
                    data_set($state, $pathToMoveInto, $pathToMoveIntoData);
                }

                data_set($state, $parentPath, Arr::except($parent, $uuid));

                $component->state($state);
            }
        );

        $this->visible(
            fn (Component $component): bool => $component->isIndentable()
        );
    }
}
