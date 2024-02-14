<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class AddChildAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'addChild';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-plus')->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add-child.label'));

        $this->modalHeading(
            fn (Component $component): ?string => match ($component->hasModal()) {
                true => __('filament-adjacency-list::adjacency-list.actions.add-child.modal.heading'),
                default => null,
            }
        );

        $this->modalSubmitActionLabel(
            fn (Component $component): ?string => match ($component->hasModal()) {
                true => __('filament-adjacency-list::adjacency-list.actions.add-child.modal.actions.create'),
                default => null,
            }
        );

        $this->action(
            function (Component $component, array $arguments, array $data): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $uuid = (string) Str::uuid();

                $items = $component->getState();

                data_set($items, ("$statePath." . $component->getChildrenKey() . ".$uuid"), [
                    $component->getLabelKey() => __('filament-adjacency-list::adjacency-list.items.untitled'),
                    $component->getChildrenKey() => [],
                    ...$data,
                ]);

                $component->state($items);
            }
        );

        $this->size(ActionSize::ExtraSmall);

        $this->form(
            fn (Component $component, Form $form): ?Form => match ($component->hasModal()) {
                true => $component->getModalForm($form),
                default => null,
            }
        );

        $this->visible(
            fn (Component $component): bool => $component->isAddable()
        );
    }
}
