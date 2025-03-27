<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\HtmlString;

trait CanFormatItemLabel
{
    protected ?Closure $formatItemLabel = null;

    public function formatItemLabelUsing(?Closure $callback): static
    {
        $this->formatItemLabel = $callback;

        return $this;
    }

    public function formatItemLabel(array $item): Htmlable | string | null
    {
        $label = $item[$this->getLabelKey()];
        $formattedLabel = $this->evaluate($this->formatItemLabel ?? $label, ['label' => $label, 'item' => $item]);

        return $this->isHtmlAllowed() ? new HtmlString($formattedLabel) : $formattedLabel;
    }
}
