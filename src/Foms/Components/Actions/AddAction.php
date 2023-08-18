<?php

namespace Saade\FilamentAdjacencyList\Foms\Components\Actions;

use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Foms\Components\AdjacencyList;

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

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.add.modal.actions.create'));

        $this->action(
            function (AdjacencyList $component, array $data): void {
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
            fn (AdjacencyList $component, Form $form) => $component->getForm($form)
        );

        $this->visible(
            fn (AdjacencyList $component): bool => $component->isAddable()
        );
    }
}
