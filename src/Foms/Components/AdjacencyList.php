<?php

namespace Saade\FilamentAdjacencyList\Foms\Components;

use Closure;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Illuminate\Support\Str;

class AdjacencyList extends Forms\Components\Field
{
    protected string $view = 'filament-adjacency-list::builder';

    protected string | Closure | null $addActionLabel = null;

    protected bool | Closure $isAddable = true;

    protected bool | Closure $isEditable = true;

    protected bool | Closure $isDeletable = true;

    protected bool | Closure $isReorderable = true;

    protected ?Closure $modifyAddActionUsing = null;

    protected ?Closure $modifyAddChildActionUsing = null;

    protected ?Closure $modifydeleteActionUsing = null;

    protected ?Closure $modifyEditActionUsing = null;

    protected bool | Closure $hasModal = true;

    protected array | Closure | null $formSchema = null;

    protected string | Closure $labelKey = 'label';

    protected string | Closure $childrenKey = 'children';

    protected function setUp(): void
    {
        parent::setUp();

        $this->afterStateHydrated(function (AdjacencyList $component, ?array $state) {
            if (! $state) {
                $component->state([]);
            }
        });

        $this->default([]);

        $this->registerActions([
            fn (AdjacencyList $component): Action => $component->getAddAction(),
            fn (AdjacencyList $component): Action => $component->getAddChildAction(),
            fn (AdjacencyList $component): Action => $component->getDeleteAction(),
            fn (AdjacencyList $component): Action => $component->getEditAction(),
        ]);

        $this->registerListeners([
            'builder::sort' => [
                function (AdjacencyList $component, string $targetStatePath, array $targetItemsStatePaths) {
                    $state = $component->getState();
                    $targetStatePath = $this->getRelativeStatePath($targetStatePath);

                    $items = [];
                    foreach ($targetItemsStatePaths as $targetItemStatePath) {
                        $targetItemStatePath = $this->getRelativeStatePath($targetItemStatePath);

                        $item = data_get($state, $targetItemStatePath);
                        $uuid = Str::afterLast($targetItemStatePath, '.');

                        $items[$uuid] = $item;
                    }

                    if (! $targetStatePath) {
                        $state = $items;
                    } else {
                        data_set($state, $targetStatePath, $items);
                    }

                    $component->state($state);
                },
            ],
        ]);
    }

    public function labelKey(string | Closure $key): static
    {
        $this->labelKey = $key;

        return $this;
    }

    public function getLabelKey(): string
    {
        return $this->evaluate($this->labelKey);
    }

    public function childrenKey(string | Closure $key): static
    {
        $this->childrenKey = $key;

        return $this;
    }

    public function getChildrenKey(): string
    {
        return $this->evaluate($this->childrenKey);
    }

    public function getAddAction(): Action
    {
        $action = Action::make('add')
            ->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add.label'))
            ->button()
            ->color('gray')
            ->form($this->getFormSchema(...))
            ->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add.modal.heading'))
            ->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add.modal.actions.create'))
            ->action(
                function (AdjacencyList $component, array $data): void {
                    $items = $component->getState();

                    $items[(string) Str::uuid()] = [
                        $this->getLabelKey() => __('filament-adjacency-list::adjacency-list.items.untitled'),
                        $this->getChildrenKey() => [],
                        ...$data,
                    ];

                    $component->state($items);
                }
            )
            ->size(ActionSize::Small)
            ->visible(fn (): bool => $this->isAddable());

        if (! $this->hasModal()) {
            $action->form(null);
        }

        if ($this->modifyAddActionUsing) {
            $action = $this->evaluate($this->modifyAddActionUsing, [
                'action' => $action,
            ]) ?? $action;
        }

        return $action;
    }

    public function addAction(?Closure $callback): static
    {
        $this->modifyAddActionUsing = $callback;

        return $this;
    }

    public function getAddChildAction(): Action
    {
        $action = Action::make('addChild')
            ->label(fn () => __('filament-adjacency-list::adjacency-list.actions.add-child.label'))
            ->iconButton()
            ->icon('heroicon-o-plus')
            ->color('gray')
            ->form($this->getFormSchema(...))
            ->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add-child.modal.heading'))
            ->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add-child.modal.actions.create'))
            ->action(
                function (AdjacencyList $component, array $arguments, array $data): void {
                    $statePath = $this->getRelativeStatePath($arguments['statePath']);
                    $uuid = (string) Str::uuid();

                    $items = $component->getState();

                    data_set($items, ("$statePath." . $this->getChildrenKey() . ".$uuid"), [
                        $this->getLabelKey() => __('filament-adjacency-list::adjacency-list.items.untitled'),
                        $this->getChildrenKey() => [],
                        ...$data,
                    ]);

                    $component->state($items);
                }
            )
            ->size(ActionSize::ExtraSmall)
            ->visible(fn (): bool => $this->isAddable());

        if (! $this->hasModal()) {
            $action->form(null);
        }

        if ($this->modifyAddChildActionUsing) {
            $action = $this->evaluate($this->modifyAddChildActionUsing, [
                'action' => $action,
            ]) ?? $action;
        }

        return $action;
    }

    public function addChildAction(?Closure $callback): static
    {
        $this->modifyAddChildActionUsing = $callback;

        return $this;
    }

    public function getDeleteAction(): Action
    {
        $action = Action::make('delete')
            ->label(fn () => __('filament-adjacency-list::adjacency-list.actions.delete.label'))
            ->iconButton()
            ->icon('heroicon-o-trash')
            ->color('danger')
            ->modalIcon('heroicon-o-trash')
            ->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.heading'))
            ->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.actions.confirm'))
            ->action(
                function (array $arguments, AdjacencyList $component): void {
                    $statePath = $this->getRelativeStatePath($arguments['statePath']);
                    $items = $component->getState();

                    data_forget($items, $statePath);

                    $component->state($items);
                }
            )
            ->size(ActionSize::ExtraSmall)
            ->visible(fn (): bool => $this->isDeletable());

        if ($this->modifydeleteActionUsing) {
            $action = $this->evaluate($this->modifydeleteActionUsing, [
                'action' => $action,
            ]) ?? $action;
        }

        return $action;
    }

    public function deleteAction(?Closure $callback): static
    {
        $this->modifydeleteActionUsing = $callback;

        return $this;
    }

    public function getEditAction(): Action
    {
        $action = Action::make('edit')
            ->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.label'))
            ->iconButton()
            ->icon('heroicon-o-pencil-square')
            ->color('gray')
            ->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.heading'))
            ->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.actions.save'))
            ->mountUsing(
                fn (AdjacencyList $component, Form $form, array $arguments) => $form->fill(
                    data_get($component->getState(), $this->getRelativeStatePath($arguments['statePath']), [])
                )
            )
            ->form($this->getFormSchema(...))
            ->action(
                function (AdjacencyList $component, array $arguments, array $data): void {
                    $statePath = $this->getRelativeStatePath($arguments['statePath']);
                    $state = $component->getState();

                    $item = array_merge(data_get($state, $statePath), $data);

                    data_set($state, $statePath, $item);

                    $component->state($state);
                }
            )
            ->size(ActionSize::ExtraSmall)
            ->visible(fn (): bool => $this->isEditable());

        if ($this->modifyEditActionUsing) {
            $action = $this->evaluate($this->modifyEditActionUsing, [
                'action' => $action,
            ]) ?? $action;
        }

        return $action;
    }

    public function editAction(?Closure $callback): static
    {
        $this->modifyEditActionUsing = $callback;

        return $this;
    }

    public function form(array | Closure | null $form): static
    {
        $this->formSchema = $form;

        return $this;
    }

    public function getFormSchema(Form $form): ?Form
    {
        $modifiedForm = $this->evaluate($this->formSchema, [
            'form' => $form,
        ]);

        if ($modifiedForm === null) {
            return $form->schema([
                Forms\Components\TextInput::make($this->getLabelKey())
                    ->label(__('filament-adjacency-list::adjacency-list.items.label')),
            ]);
        }

        if (is_array($modifiedForm) && (! count($modifiedForm))) {
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

    protected function hasModal(): bool
    {
        return $this->evaluate($this->hasModal);
    }

    protected function getRelativeStatePath(string $path): string
    {
        return str($path)->after($this->getStatePath())->trim('.')->toString();
    }

    public function addable(bool | Closure $condition = true): static
    {
        $this->isAddable = $condition;

        return $this;
    }

    public function isAddable(): bool
    {
        if ($this->isDisabled()) {
            return false;
        }

        return (bool) $this->evaluate($this->isAddable);
    }

    public function deletable(bool | Closure $condition = true): static
    {
        $this->isDeletable = $condition;

        return $this;
    }

    public function isDeletable(): bool
    {
        if ($this->isDisabled()) {
            return false;
        }

        return (bool) $this->evaluate($this->isDeletable);
    }

    public function editable(bool | Closure $condition = true): static
    {
        $this->isEditable = $condition;

        return $this;
    }

    public function isEditable(): bool
    {
        if ($this->isDisabled()) {
            return false;
        }

        return (bool) $this->evaluate($this->isEditable);
    }

    public function reorderable(bool | Closure $condition = true): static
    {
        $this->isReorderable = $condition;

        return $this;
    }

    public function isReorderable(): bool
    {
        if ($this->isDisabled()) {
            return false;
        }

        return (bool) $this->evaluate($this->isReorderable);
    }
}
