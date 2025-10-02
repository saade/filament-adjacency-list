<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Illuminate\Contracts\Support\Htmlable;
use Closure;

trait HasItemLabel
{
    protected string | Closure | null $itemLabel = null;

    public function itemLabel(string | Closure | null $label): static
    {
        $this->itemLabel = $label;

        return $this;
    }

    public function getItemLabel(array $item): string | Htmlable | null
    {
        return $this->evaluate(
            $this->itemLabel,
            namedInjections: [
                'item' => $item,
            ],
        );
    }
}
