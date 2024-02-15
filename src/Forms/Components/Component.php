<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Closure;
use Filament\Forms;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Forms\Components\Actions\Action;

abstract class Component extends Forms\Components\Field
{
    use Concerns\HasActions;
    use Concerns\HasForm;
    use Forms\Components\Concerns\CanBeCollapsed;

    protected string $view = 'filament-adjacency-list::builder';

    protected string | Closure $labelKey = 'label';

    protected string | Closure $childrenKey = 'children';

    protected int | Closure | null $maxDepth = null;

    protected bool | Closure $hasRulers = false;

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

    public function getMaxDepth(): ?int
    {
        return $this->evaluate($this->maxDepth);
    }

    public function rulers(bool | Closure $condition = true): static
    {
        $this->hasRulers = $condition;

        return $this;
    }

    public function hasRulers(): bool
    {
        return $this->evaluate($this->hasRulers);
    }

    public function getRelativeStatePath(string $path): string
    {
        return str($path)->after($this->getStatePath())->trim('.')->toString();
    }
}
