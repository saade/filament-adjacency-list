<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

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

        $this->size(ActionSize::Small);

        $this->modalHeading(
            fn (Component $component): ?string => match ($component->hasModal()) {
                true => __('filament-adjacency-list::adjacency-list.actions.add.modal.heading'),
                default => null,
            }
        );

        $this->modalSubmitActionLabel(
            fn (Component $component): ?string => match ($component->hasModal()) {
                true => __('filament-adjacency-list::adjacency-list.actions.add.modal.actions.create'),
                default => null,
            }
        );

        $this->form(
            function (Component $component, Form $form): ?Form {
                if(! $component->hasModal()) {
                    return null;
                }

                $form = $component->getForm($form);

                if( $model = $component->getRelatedModel()) {
                    $form->model($model);
                }

                return $form;
            }
        );

        $this->action(function (): void {
            $this->process(function (Component $component, array $data): void {
                $items = $component->getState();

                $items[(string) Str::uuid()] = [
                    $component->getLabelKey() => __('filament-adjacency-list::adjacency-list.items.untitled'),
                    $component->getChildrenKey() => [],
                    ...$data,
                ];

                $component->state($items);
            });
        });

        $this->visible(
            fn (Component $component): bool => $component->isAddable()
        );
    }
}
