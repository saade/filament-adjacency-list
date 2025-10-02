<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;
use Filament\Forms;
use Filament\Schemas\Schema;

trait HasSchema
{
    protected bool | Closure $hasModal = true;

    protected array | Closure | null $form = null;

    /**
     * @param  array<Forms\Component> | Closure | null  $components
     */
    public function schema(array | Closure | null $components): static
    {
        $this->form($components);

        return $this;
    }

    /**
     * @deprecated Use `->schema()` instead.
     */
    public function form(array | Closure | null $form): static
    {
        $this->form = $form;

        return $this;
    }

    public function getSchema(Schema $schema): ?Schema
    {
        $modifiedForm = $this->evaluate($this->form);

        if ($modifiedForm === null) {
            return $schema->schema([
                Forms\Components\TextInput::make($this->getLabelKey())
                    ->label(__('filament-adjacency-list::adjacency-list.items.label')),
            ]);
        }

        if (is_array($modifiedForm) && (! count($modifiedForm))) {
            return null;
        }

        if (is_array($modifiedForm)) {
            $modifiedForm = $schema->schema($modifiedForm);
        }

        if ($this->isDisabled()) {
            return $modifiedForm->disabled();
        }

        return $modifiedForm;
    }

    public function modal(bool | Closure $condition = true): static
    {
        $this->hasModal = $condition;

        return $this;
    }

    public function hasModal(): bool
    {
        return $this->evaluate($this->hasModal);
    }
}
