<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;

trait HasRulers
{
    protected bool | Closure $hasRulers = false;

    public function rulers(bool | Closure $condition = true): static
    {
        $this->hasRulers = $condition;

        return $this;
    }

    public function hasRulers(): bool
    {
        return $this->evaluate($this->hasRulers);
    }
}
