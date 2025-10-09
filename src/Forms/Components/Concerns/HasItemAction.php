<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;
use Filament\Forms\Components\Actions\Action;

trait HasItemAction
{
    protected string | Closure | null $itemAction = null;

    public function itemAction(string | Closure | null $action): static
    {
        $this->itemAction = $action;

        return $this;
    }

    public function getItemAction(array $item): ?string
    {
        $action = $this->evaluate(
            $this->itemAction,
            namedInjections: [
                'item' => $item,
            ],
        );

        if (! $action) {
            return null;
        }

        if (! class_exists($action)) {
            return $action;
        }

        if (! is_subclass_of($action, Action::class)) {
            return $action;
        }

        return $action::getDefaultName() ?? $action;
    }
}
