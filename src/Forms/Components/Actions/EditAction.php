<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Actions\Concerns\InteractsWithRecord;
use Filament\Actions\Contracts\HasRecord;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Support\Enums\ActionSize;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;

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

        $this->iconButton()->icon('heroicon-o-pencil-square')->color('gray');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.label'));

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.edit.modal.actions.save'));

        $this->action(
            function (AdjacencyList $component, array $arguments, array $data): void {
                $statePath = $component->getRelativeStatePath($arguments['statePath']);
                $state = $component->getState();

                $item = array_merge(data_get($state, $statePath), $data);

                data_set($state, $statePath, $item);

                $component->state($state);
            }
        );

        $this->size(ActionSize::Small);

        $this->form(
            fn (AdjacencyList $component, Form $form) => $component->getForm($form)
        );

        $this->fillForm(
            function (AdjacencyList $component, array $arguments) {
                return data_get($component->getState(), $component->getRelativeStatePath($arguments['statePath']), []);
            }
        );

        $this->record(
            fn (AdjacencyList $component, array $arguments) => $component->getCachedExistingRecords()->firstWhere($component->getPath(), $component->getRelativeStatePath($arguments['statePath']))
        );

        $this->visible(
            fn (AdjacencyList $component): bool => $component->isEditable()
        );
    }

    /**
     * @return array<mixed>
     */
    protected function resolveDefaultClosureDependencyForEvaluationByName(string $parameterName): array
    {
        return match ($parameterName) {
            'record' => [$this->getRecord()],
            default => parent::resolveDefaultClosureDependencyForEvaluationByName($parameterName),
        };
    }

    /**
     * @return array<mixed>
     */
    protected function resolveDefaultClosureDependencyForEvaluationByType(string $parameterType): array
    {
        $record = $this->getRecord();

        if (! $record) {
            return parent::resolveDefaultClosureDependencyForEvaluationByType($parameterType);
        }

        return match ($parameterType) {
            Model::class, $record::class => [$record],
            default => parent::resolveDefaultClosureDependencyForEvaluationByType($parameterType),
        };
    }
}
