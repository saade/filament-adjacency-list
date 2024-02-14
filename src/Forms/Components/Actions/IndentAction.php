<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Forms\Components\Actions\Action;
use Filament\Support\Enums\ActionSize;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
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

        $this->size(ActionSize::ExtraSmall);

        $this->action(
            function (Component $component, array $arguments): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $state = $component->getState();

                $item = data_get($state, $statePath);
                $uuid = Str::afterLast($statePath, '.');

                $parentPath = Str::beforeLast($statePath, '.');
                $parent = data_get($state, $parentPath);

                if ($parentPath === $uuid) {
                    $parent = $state;
                }

                $keys = array_keys($parent);
                $position = array_search($uuid, $keys);

                $previous = $parent[$keys[$position - 1]];

                if (! isset($previous['children'])) {
                    $previous['children'] = [];
                }

                $previous['children'][$uuid] = $item;
                $parent[$keys[$position - 1]] = $previous;

                if ($parentPath === $uuid) {
                    $state = Arr::except($parent, $uuid);
                } else {
                    data_set($state, $parentPath, Arr::except($parent, $uuid));
                }

                $component->state($state);
            }
        );

        $this->visible(
            fn (Component $component): bool => $component->isIndentable()
        );
    }
}
