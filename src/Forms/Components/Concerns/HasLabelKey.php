<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;

trait HasLabelKey
{
    protected string | Closure $labelKey = 'label';

    public function labelKey(string | Closure $key): static
    {
        $this->labelKey = $key;

        return $this;
    }

    public function getLabelKey(): string
    {
        return $this->evaluate($this->labelKey);
    }
}
