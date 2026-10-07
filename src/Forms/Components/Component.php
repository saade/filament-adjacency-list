<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Filament\Forms;
use Filament\Support\Components\Attributes\ExposedLivewireMethod;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Livewire\Attributes\Renderless;
use Saade\FilamentAdjacencyList\Forms\Components\Actions\Action;

abstract class Component extends Forms\Components\Field
{
    use Concerns\CanBeCollapsed;
    use Concerns\HasActions;
    use Concerns\HasChildrenKey;
    use Concerns\HasItemAction;
    use Concerns\HasItemLabel;
    use Concerns\HasItemUrl;
    use Concerns\HasLabelKey;
    use Concerns\HasMaxDepth;
    use Concerns\HasRulers;
    use Concerns\HasSchema;

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
    }

    #[ExposedLivewireMethod]
    #[Renderless]
    public function sort(string $targetStatePath, array $targetItemsStatePaths)
    {
        if (! str_starts_with($targetStatePath, $this->getStatePath())) {
            return;
        }

        $state = $this->getState() ?? [];

        // A sort does not render the page again, so the paths it sends go stale.
        $listPath = $this->locateList($state, $this->getRelativeStatePath($targetStatePath));

        if ($listPath === null) {
            return;
        }

        $itemPaths = [];

        foreach ($targetItemsStatePaths as $targetItemStatePath) {
            $uuid = Str::afterLast($this->getRelativeStatePath($targetItemStatePath), '.');

            if (filled($itemPath = $this->locateItem($state, $uuid))) {
                $itemPaths[$uuid] = $itemPath;
            }
        }

        $items = Arr::map($itemPaths, fn (string $itemPath): array => data_get($state, $itemPath));

        foreach ($itemPaths as $itemPath) {
            if ($this->getListPath($itemPath) !== $listPath) {
                Arr::forget($state, $itemPath);
            }
        }

        $list = ($listPath === '') ? $state : data_get($state, $listPath, []);
        $list = [...$items, ...array_diff_key($list, $items)];

        if ($listPath === '') {
            $state = $list;
        } else {
            data_set($state, $listPath, $list);
        }

        $this->state($state);

        $this->saveReorderedRelationships();
    }

    /**
     * @param  array<string, array<string, mixed>>  $items
     */
    protected function locateItem(array $items, string $uuid, string $path = ''): ?string
    {
        foreach ($items as $key => $item) {
            $itemPath = ltrim("{$path}.{$key}", '.');

            if ((string) $key === $uuid) {
                return $itemPath;
            }

            $childrenKey = $this->getChildrenKey();

            if (filled($found = $this->locateItem($item[$childrenKey] ?? [], $uuid, "{$itemPath}.{$childrenKey}"))) {
                return $found;
            }
        }

        return null;
    }

    /**
     * @param  array<string, array<string, mixed>>  $state
     */
    protected function locateList(array $state, string $path): ?string
    {
        if ($path === '') {
            return '';
        }

        $itemPath = $this->locateItem($state, Str::afterLast(Str::beforeLast($path, '.'), '.'));

        return filled($itemPath) ? "{$itemPath}.{$this->getChildrenKey()}" : null;
    }

    protected function getListPath(string $itemPath): string
    {
        return str_contains($itemPath, '.') ? Str::beforeLast($itemPath, '.') : '';
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    public function getItemStatePath(array $arguments): string
    {
        $path = $this->getRelativeStatePath($arguments['statePath'] ?? '');

        return $this->locateItem($this->getState() ?? [], $arguments['cachedRecordKey'] ?? Str::afterLast($path, '.')) ?? $path;
    }

    public function getRelativeStatePath(string $path): string
    {
        return str($path)->after($this->getStatePath())->trim('.')->toString();
    }
}
