<?php

namespace Saade\FilamentAdjacencyList\Foms\Components\Concerns;

use Closure;
use Filament\Forms\Form;
use Filament\Forms;

trait HasForm
{
    protected bool | Closure $hasModal = true;

    protected array | Closure | null $form = null;

    public function form(array | Closure | null $form): static
    {
        $this->form = $form;

        return $this;
    }

    public function getForm(Form $form): ?Form
    {
        if (!$this->hasModal()) {
            return null;
        }

        $modifiedForm = $this->evaluate($this->form);

        if ($modifiedForm === null) {
            return $form->schema([
                Forms\Components\TextInput::make($this->getLabelKey())
                    ->label(__('filament-adjacency-list::adjacency-list.items.label')),
            ]);
        }

        if (is_array($modifiedForm) && (!count($modifiedForm))) {
            return null;
        }

        if (is_array($modifiedForm)) {
            $modifiedForm = $form->schema($modifiedForm);
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
