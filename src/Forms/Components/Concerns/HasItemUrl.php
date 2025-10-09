<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;

trait HasItemUrl
{
    protected bool | Closure $shouldOpenItemUrlInNewTab = false;

    protected string | Closure | null $itemUrl = null;

    public function openItemUrlInNewTab(bool | Closure $condition = true): static
    {
        $this->shouldOpenItemUrlInNewTab = $condition;

        return $this;
    }

    public function itemUrl(string | Closure | null $url, bool | Closure $shouldOpenInNewTab = false): static
    {
        $this->openItemUrlInNewTab($shouldOpenInNewTab);
        $this->itemUrl = $url;

        return $this;
    }

    public function getItemUrl(array $item): ?string
    {
        return $this->evaluate(
            $this->itemUrl,
            namedInjections: [
                'item' => $item,
            ],
        );
    }

    public function shouldOpenItemUrlInNewTab(array $item): bool
    {
        return (bool) $this->evaluate(
            $this->shouldOpenItemUrlInNewTab,
            namedInjections: [
                'item' => $item,
            ],
        );
    }
}
