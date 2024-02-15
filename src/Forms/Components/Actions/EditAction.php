<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class EditAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'edit';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.label'));

        $this->iconButton()->icon('heroicon-o-pencil-square')->color('gray');

        $this->size(ActionSize::ExtraSmall);

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.actions.save'));

        $this->form(
            function (Component $component, Form $form, array $arguments): Form {
                return $component
                    ->getForm($form)
                    ->model($component->getCachedExistingRecords()->get($arguments['cachedRecordKey']))
                    ->statePath($arguments['statePath']);
            }
        );

        $this->fillForm(
            function (Component $component, array $arguments): array {
                return data_get($component->getState(), $component->getRelativeStatePath($arguments['statePath']), []);
            }
        );

        $this->action(function (Component $component, array $arguments): void {
            $record = $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']);

            $this->process(function (Component $component, array $arguments, array $data): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $state = $component->getState();

                $item = array_merge(data_get($state, $statePath), $data);

                data_set($state, $statePath, $item);

                $component->state($state);
            }, ['record' => $record]);
        });

        $this->visible(
            function (Component $component): bool {
                return $component->isEditable();
            }
        );
    }
}
