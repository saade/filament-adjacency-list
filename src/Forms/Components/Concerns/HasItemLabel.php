<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;
use Illuminate\Contracts\Support\Htmlable;

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
        $label = $this->evaluate(
            $this->itemLabel,
            namedInjections: [
                'item' => $item,
            ],
        );

        if (! $label) {
            return $item[$this->getLabelKey()];
        }

        return $label;
    }
}
