<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Closure;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Illuminate\Support\Str;

class AdjacencyList extends Forms\Components\Field
{
    use Concerns\HasActions;
    use Concerns\HasForm;

    protected string $view = 'filament-adjacency-list::builder';

    protected string | Closure $labelKey = 'label';

    protected string | Closure $childrenKey = 'children';

    protected int | Closure $maxDepth = -1;

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
                    $targetStatePath = $this->getRelativeStatePath($targetStatePath);

                    $items = [];
                    foreach ($targetItemsStatePaths as $targetItemStatePath) {
                        $targetItemStatePath = $this->getRelativeStatePath($targetItemStatePath);

                        $item = data_get($state, $targetItemStatePath);
                        $uuid = Str::afterLast($targetItemStatePath, '.');

                        $items[$uuid] = $item;
                    }

                    if (! $targetStatePath) {
                        $state = $items;
                    } else {
                        data_set($state, $targetStatePath, $items);
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

    public function maxDepth(int | Closure $maxDepth): static
    {
        $this->maxDepth = $maxDepth;

        return $this;
    }

    public function getMaxDepth(): int
    {
        return $this->evaluate($this->maxDepth);
    }

    public function getRelativeStatePath(string $path): string
    {
        return str($path)->after($this->getStatePath())->trim('.')->toString();
    }
}
