<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class AddAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'add';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->button()->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add.label'));

        $this->modalHeading(
            fn (Component $component): ?string => match ($component->hasModal()) {
                true => __('filament-adjacency-list::adjacency-list.actions.add.modal.heading'),
                default => null,
            }
        );

        $this->modalSubmitActionLabel(
            fn (Component $component): ?string => match ($component->hasModal()) {
                true => __('filament-adjacency-list::adjacency-list.actions.add.modal.submit'),
                default => null,
            }
        );

        $this->action(
            function (Component $component, array $data): void {
                $items = $component->getState();

                $items[(string) Str::uuid()] = [
                    $component->getLabelKey() => __('filament-adjacency-list::adjacency-list.items.untitled'),
                    $component->getChildrenKey() => [],
                    ...$data,
                ];

                $component->state($items);
            }
        );

        $this->size(ActionSize::Small);

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
