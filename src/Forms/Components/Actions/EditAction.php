<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Schemas\Schema;
use Filament\Support\Enums\Size;
use Illuminate\Auth\Access\AuthorizationException;
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

        $this->size(Size::ExtraSmall);

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.actions.save'));

        $this->schema(
            function (Component $component, Schema $schema, array $arguments): Schema {
                $schema = $component
                    ->getSchema($schema)
                    ->statePath($arguments['statePath']);

                if ($component->getRelatedModel()) {
                    $schema->model($component->getCachedExistingRecords()->get($arguments['cachedRecordKey']));
                }

                return $schema;
            }
        );

        $this->fillForm(
            function (Component $component, array $arguments): array {
                return data_get($component->getState(), $component->getRelativeStatePath($arguments['statePath']), []);
            }
        );

        $this->action(function (Component $component, array $arguments): void {
            $record = $component->getRelatedModel() ? $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']) : null;

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

        $this->authorize(function (Component $component, array $arguments): bool {
            try {
                $record = $component->getRelatedModel() ? $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']) : null;

                return ! $record || \Filament\authorize('update', $record)->allowed();
            } catch (AuthorizationException $exception) {
                return $exception->toResponse()->allowed();
            }
        });
    }
}
