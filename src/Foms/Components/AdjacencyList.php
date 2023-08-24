<?php

namespace Saade\FilamentAdjacencyList\Foms\Components;

use Closure;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Illuminate\Support\Str;

class AdjacencyList extends Forms\Components\Field
{
    use Concerns\HasRelationships;
    use Concerns\HasActions;
    use Concerns\HasForm;

    protected string $view = 'filament-adjacency-list::builder';

    protected string | Closure $labelKey = 'label';

    protected string | Closure $childrenKey = 'children';

    protected function setUp(): void
    {
        parent::setUp();

        $this->afterStateHydrated(function (AdjacencyList $component, ?array $state) {
            if (! $state) {
                $component->state([]);
            }
        });

        $this->default([]);

        $this->registerActions([
            fn (AdjacencyList $component): Action => $component->getAddAction(),
            fn (AdjacencyList $component): Action => $component->getAddChildAction(),
            fn (AdjacencyList $component): Action => $component->getDeleteAction(),
            fn (AdjacencyList $component): Action => $component->getEditAction(),
            fn (AdjacencyList $component): Action => $component->getReorderAction(),
        ]);

        $this->registerListeners([
            'builder::sort' => [
                function (AdjacencyList $component, string $targetStatePath, array $targetItemsStatePaths) {
                    $state = $component->getState();
                    $relativeStatePath = $this->getRelativeStatePath($targetStatePath);

                    $items = [];
                    foreach ($targetItemsStatePaths as $targetItemStatePath) {
                        $targetItemRelativeStatePath = $this->getRelativeStatePath($targetItemStatePath);

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

    public function labelKey(string | Closure $key): static
    {
        $this->labelKey = $key;

        return $this;
    }

    public function getLabelKey(): string
    {
        return $this->evaluate($this->labelKey);
    }

    public function childrenKey(string | Closure $key): static
    {
        $this->childrenKey = $key;

        return $this;
    }

    public function getChildrenKey(): string
    {
        return $this->evaluate($this->childrenKey);
    }

    public function getRelativeStatePath(string $path): string
    {
        return str($path)->after($this->getStatePath())->trim('.')->toString();
    }
}
