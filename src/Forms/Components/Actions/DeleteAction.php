<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Notifications\Notification;
use Filament\Support\Enums\Size;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Str;
use Saade\FilamentAdjacencyList\Enums\ChildrenOnDelete;
use Saade\FilamentAdjacencyList\Forms\Components\Component;

class DeleteAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'delete';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->iconButton()->icon('heroicon-o-trash')->color('danger');

        $this->label(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.label'));

        $this->size(Size::ExtraSmall);

        $this->modalIcon('heroicon-o-trash');

        $this->modalHeading(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.heading'));

        $this->modalSubmitActionLabel(fn (): string => __('filament-adjacency-list::adjacency-list.actions.delete.modal.actions.confirm'));

        $this->action(function (Component $component, array $arguments): void {
            $record = $component->getRelatedModel() ? $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']) : null;

            if ($this->isRestricted($component, $arguments)) {
                Notification::make()
                    ->danger()
                    ->title(__('filament-adjacency-list::adjacency-list.actions.delete.notifications.restricted.title'))
                    ->send();

                return;
            }

            $this->process(function (Component $component, array $arguments): void {
                $statePath = $component->getItemStatePath($arguments);
                $items = $component->getState();

                $item = data_get($items, $statePath);
                $children = $item[$component->getChildrenKey()] ?? [];
                $behavior = $component->getChildrenOnDelete();

                if ($behavior === ChildrenOnDelete::MoveUp) {
                    $uuid = Str::afterLast($statePath, '.');
                    $listPath = str_contains($statePath, '.') ? Str::beforeLast($statePath, '.') : null;

                    $list = [];

                    foreach (data_get($items, $listPath) as $key => $sibling) {
                        $list = [...$list, ...(((string) $key === $uuid) ? $children : [$key => $sibling])];
                    }

                    if ($listPath === null) {
                        $items = $list;
                    } else {
                        data_set($items, $listPath, $list);
                    }
                } else {
                    data_forget($items, $statePath);
                }

                if ($behavior === ChildrenOnDelete::SetNull) {
                    $items = [...$items, ...$children];
                }

                $component->state($items);
            }, ['record' => $record]);
        });

        $this->visible(
            fn (Component $component, array $arguments): bool => $component->isDeletable() && (! $this->isRestricted($component, $arguments))
        );

        $this->authorize(function (Component $component, array $arguments): bool {
            try {
                $record = $component->getRelatedModel() ? $component->getCachedExistingRecords()->get($arguments['cachedRecordKey']) : null;

                return ! $record || \Filament\authorize('delete', $record)->allowed();
            } catch (AuthorizationException $exception) {
                return $exception->toResponse()->allowed();
            }
        });
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    protected function isRestricted(Component $component, array $arguments): bool
    {
        if ($component->getChildrenOnDelete() !== ChildrenOnDelete::Restrict) {
            return false;
        }

        $item = data_get($component->getState(), $component->getItemStatePath($arguments));

        return filled($item[$component->getChildrenKey()] ?? []);
    }
}
