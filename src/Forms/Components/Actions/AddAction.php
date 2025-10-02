<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Schemas\Schema;
use Filament\Support\Enums\Size;
use Illuminate\Auth\Access\AuthorizationException;
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

        $this->size(Size::Small);

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

        $this->schema(
            function (Component $component, Schema $schema): ?Schema {
                if (! $component->hasModal()) {
                    return null;
                }

                $schema = $component->getSchema($schema);

                if ($model = $component->getRelatedModel()) {
                    $schema->model($model);
                }

                return $schema;
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

        $this->authorize(function (Component $component): bool {
            try {
                return ! $component->getRelatedModel() || \Filament\authorize('create', $component->getModel())->allowed();
            } catch (AuthorizationException $exception) {
                return $exception->toResponse()->allowed();
            }
        });
    }
}
