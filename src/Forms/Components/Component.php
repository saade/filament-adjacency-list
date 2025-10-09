<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Filament\Forms;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Forms\Components\Actions\Action;

abstract class Component extends Forms\Components\Field
{
    use Concerns\CanBeCollapsed;
    use Concerns\HasActions;
    use Concerns\HasChildrenKey;
    use Concerns\HasForm;
    use Concerns\HasItemAction;
    use Concerns\HasItemUrl;
    use Concerns\HasLabelKey;
    use Concerns\HasMaxDepth;
    use Concerns\HasRulers;

    protected string $view = 'filament-adjacency-list::builder';

    protected function setUp(): void
    {
        parent::setUp();

        $this->afterStateHydrated(function (Component $component, ?array $state) {
            if (! $state) {
                $component->state([]);
            }
        });

        $this->default([]);

        $this->registerActions([
            fn (Component $component): Action => $component->getAddAction(),
            fn (Component $component): Action => $component->getAddChildAction(),
            fn (Component $component): Action => $component->getDeleteAction(),
            fn (Component $component): Action => $component->getEditAction(),
            fn (Component $component): Action => $component->getReorderAction(),
            fn (Component $component): Action => $component->getIndentAction(),
            fn (Component $component): Action => $component->getDedentAction(),
            fn (Component $component): Action => $component->getMoveUpAction(),
            fn (Component $component): Action => $component->getMoveDownAction(),
        ]);

        $this->registerListeners([
            'builder::sort' => [
                static function (Component $component, string $targetStatePath, array $targetItemsStatePaths) {
                    if (! str_starts_with($targetStatePath, $component->getStatePath())) {
                        return;
                    }

                    $state = $component->getState();
                    $relativeStatePath = $component->getRelativeStatePath($targetStatePath);

                    $items = [];

                    foreach ($targetItemsStatePaths as $targetItemStatePath) {
                        $targetItemRelativeStatePath = $component->getRelativeStatePath($targetItemStatePath);

                        $item = data_get($state, $targetItemRelativeStatePath);
                        $uuid = Str::afterLast($targetItemRelativeStatePath, '.');

                        $items[$uuid] = $item;
                    }

                    if (! $relativeStatePath) {
                        $state = $items;
                    } else {
                        data_set($state, $relativeStatePath, $items);
                    }

                    $component->state($state);
                },
            ],
        ]);
    }

    public function getRelativeStatePath(string $path): string
    {
        return str($path)->after($this->getStatePath())->trim('.')->toString();
    }
}
