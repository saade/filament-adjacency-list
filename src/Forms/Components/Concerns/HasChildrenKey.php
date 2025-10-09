<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;

trait HasChildrenKey
{
    protected string | Closure $childrenKey = 'children';

    public function childrenKey(string | Closure $key): static
    {
        $this->childrenKey = $key;

        return $this;
    }

    public function getChildrenKey(): string
    {
        return $this->evaluate($this->childrenKey);
    }
}
