<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Actions\Concerns\InteractsWithRecord;
use Filament\Actions\Contracts\HasRecord;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Illuminate\Database\Eloquent\Model;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class EditAction extends Action implements HasRecord
{
    use InteractsWithRecord;

    public static function getDefaultName(): ?string
    {
        return 'edit';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.label'));

        $this->iconButton()->icon('heroicon-o-pencil-square')->color('gray');

        $this->size(ActionSize::Small);

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.actions.save'));

        $this->form(
            function (Component $component, Form $form, array $arguments): Form {
                return $component
                    ->getForm($form)
                    ->model($this->getRecord() ?? $component->getRelatedModel())
                    ->statePath($arguments['statePath']);
            }
        );

        $this->fillForm(
            function (Component $component, array $arguments): array {
                return data_get($component->getState(), $component->getRelativeStatePath($arguments['statePath']), []);
            }
        );

        $this->record(
            function (Component $component, array $arguments): ?Model {
                return $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']);
            }
        );

        $this->action(
            function (Component $component, array $arguments, array $data): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $state = $component->getState();

                $item = array_merge(data_get($state, $statePath), $data);

                data_set($state, $statePath, $item);

                $component->state($state);
            }
        );

        $this->visible(
            function (Component $component): bool {
                return $component->isEditable();
            }
        );
    }
}
