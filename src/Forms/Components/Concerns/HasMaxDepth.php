<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;

trait HasMaxDepth
{
    protected int | Closure | null $maxDepth = null;

    public function maxDepth(int | Closure | null $maxDepth): static
    {
        $this->maxDepth = $maxDepth;

        return $this;
    }

    public function getMaxDepth(): ?int
    {
        return $this->evaluate($this->maxDepth);
    }
}
