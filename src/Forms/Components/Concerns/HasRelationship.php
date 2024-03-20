<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Saade\FilamentAdjacencyList\Forms\Components\Actions\Action;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Saade\FilamentAdjacencyList\Forms\Components\Component;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

trait HasRelationship
{
    protected string | Closure | null $relationship = null;

    protected ?Collection $cachedExistingRecords = null;

    protected string | Closure | null $orderColumn = null;

    protected ?Closure $modifyRelationshipQueryUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeCreateUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeFillUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeSaveUsing = null;

    protected array | Closure | null $pivotAttributes = null;

    public function relationship(string | Closure | null $name = null, ?Closure $modifyQueryUsing = null): static
    {
        $this->relationship = $name ?? $this->getName();
        $this->modifyRelationshipQueryUsing = $modifyQueryUsing;

        $this->loadStateFromRelationshipsUsing(static function (AdjacencyList $component) {
            $component->clearCachedExistingRecords();

            $component->fillFromRelationship();
        });

        $this->saveRelationshipsUsing(static function (AdjacencyList $component, ?array $state) {
            if (! is_array($state)) {
                $state = [];
            }

            $cachedExistingRecords = $component->getCachedExistingRecords();
            $relationship = $component->getRelationship();
            $childrenKey = $component->getChildrenKey();
            $recordKeyName = $relationship->getRelated()->getKeyName();
            $orderColumn = $component->getOrderColumn();
            $pivotAttributes = $component->getPivotAttributes();

            Arr::map(
                $state,
                $traverse = function (array $item, string $itemKey, array $siblings = []) use (&$traverse, &$cachedExistingRecords, $state, $relationship, $childrenKey, $recordKeyName, $orderColumn, $pivotAttributes): Model {
                    $record = $cachedExistingRecords->get($itemKey);

                    /* Update item order */
                    if ($orderColumn) {
                        $record->{$orderColumn} = $pivotAttributes[$orderColumn] = array_search($itemKey, array_keys($siblings ?: $state));
                    }

                    if ($relationship instanceof BelongsToMany) {
                        $record->save();
                    } else {
                        $relationship->save($record);
                    }

                    if ($children = data_get($item, $childrenKey)) {
                        $childrenRecords = collect($children)->map(fn (array $child, string $childKey) => $traverse($child, $childKey, $children));

                        if ($relationship instanceof BelongsToMany) {
                            $record->{$childrenKey}()->syncWithPivotValues(
                                $childrenRecords->pluck($recordKeyName),
                                $pivotAttributes()
                            );

                            return $record;
                        }

                        $record->{$childrenKey}()->saveMany($childrenRecords);
                    }

                    return $record;
                }
            );

            // Clear cache
            $component->fillFromRelationship();
        });

        $this->addAction(function (Action $action): void {
            $action->using(function (Component $component, array $data): void {
                $relationship = $component->getRelationship();
                $model = $component->getRelatedModel();
                $pivotData = $component->getPivotAttributes() ?? [];

                if ($relationship instanceof BelongsToMany) {
                    $pivotColumns = $relationship->getPivotColumns();

                    $pivotData = Arr::only($data, $pivotColumns);
                    $data = Arr::except($data, $pivotColumns);
                }

                $data = $component->mutateRelationshipDataBeforeCreate($data);

                if ($translatableContentDriver = $component->getLivewire()->makeFilamentTranslatableContentDriver()) {
                    $record = $translatableContentDriver->makeRecord($model, $data);
                } else {
                    $record = new $model();
                    $record->fill($data);
                }

                if ($orderColumn = $component->getOrderColumn()) {
                    $record->{$orderColumn} = $pivotData[$orderColumn] = count($component->getState());
                }

                if ($relationship instanceof BelongsToMany) {
                    $record->save();

                    $relationship->attach($record, $pivotData);

                    $component->cacheRecord($record);

                    return;
                }

                $relationship->save($record);

                $component->cacheRecord($record);
            });
        });

        $this->addChildAction(function (Action $action): void {
            $action->using(function (Component $component, Model $parentRecord, array $data, array $arguments): void {
                $relationship = $component->getRelationship();
                $model = $component->getRelatedModel();

                $pivotData = $component->getPivotAttributes() ?? [];

                if ($relationship instanceof BelongsToMany) {
                    $pivotColumns = $relationship->getPivotColumns();

                    $pivotData = Arr::only($data, $pivotColumns);
                    $data = Arr::except($data, $pivotColumns);
                }

                $data = $component->mutateRelationshipDataBeforeCreate($data);

                if ($translatableContentDriver = $component->getLivewire()->makeFilamentTranslatableContentDriver()) {
                    $record = $translatableContentDriver->makeRecord($model, $data);
                } else {
                    $record = new $model();
                    $record->fill($data);
                }

                if ($orderColumn = $component->getOrderColumn()) {
                    $record->{$orderColumn} = $pivotData[$orderColumn] = count(
                        data_get(
                            $component->getState(),
                            $component->getRelativeStatePath($arguments['statePath']) . '.' . $component->getChildrenKey()
                        )
                    );
                }

                if ($relationship instanceof BelongsToMany) {
                    $record->save();

                    $parentRecord->{$component->getChildrenKey()}()->syncWithPivotValues(
                        [$record->getKey()],
                        $pivotData
                    );

                    $component->cacheRecord($record);

                    return;
                }

                $parentRecord->{$component->getChildrenKey()}()->save($record);

                $component->cacheRecord($record);
            });
        });

        $this->editAction(function (Action $action): void {
            $action->using(function (Component $component, Model $record, array $data): void {
                $relationship = $component->getRelationship();

                $translatableContentDriver = $component->getLivewire()->makeFilamentTranslatableContentDriver();

                if ($relationship instanceof BelongsToMany) {
                    $pivot = $record->{$relationship->getPivotAccessor()};

                    $pivotColumns = $relationship->getPivotColumns();
                    $pivotData = Arr::only($data, $pivotColumns);

                    if (count($pivotColumns)) {
                        if ($translatableContentDriver) {
                            $translatableContentDriver->updateRecord($pivot, $pivotData);
                        } else {
                            $pivot->update($pivotData);
                        }
                    }

                    $data = Arr::except($data, $pivotColumns);
                }

                $data = $component->mutateRelationshipDataBeforeSave($data, $record);

                if ($translatableContentDriver) {
                    $translatableContentDriver->updateRecord($record, $data);
                } else {
                    $record->update($data);
                }
            });
        });

        $this->deleteAction(function (Action $action): void {
            $action->using(function (Component $component, Model $record): void {
                $relationship = $component->getRelationship();

                if ($relationship instanceof BelongsToMany) {
                    $pivot = $record->{$relationship->getPivotAccessor()};

                    $pivot->delete();
                }

                $record->delete();

                $component->deleteCachedRecord($record);
            });
        });

        $this->dehydrated(false);

        return $this;
    }

    public function fillFromRelationship(): void
    {
        $this->state(
            $this->getStateFromRelatedRecords($this->getCachedExistingRecords()),
        );
    }

    /**
     * @return array<array<string, mixed>>
     */
    protected function getStateFromRelatedRecords(Collection $records): array
    {
        if (! $records->count()) {
            return [];
        }

        return $records
            ->toTree()
            ->mapWithKeys(
                $cb = function (Model $record) use (&$cb): array {
                    $childrenKey = $this->getChildrenKey();

                    $data = $this->mutateRelationshipDataBeforeFill(
                        $this->getLivewire()->makeFilamentTranslatableContentDriver() ?
                            $this->getLivewire()->makeFilamentTranslatableContentDriver()->getRecordAttributesToArray($record) :
                            $record->attributesToArray()
                    );

                    $key = md5('record-' . $record->getKey());
                    $data[$childrenKey] = $record->{$childrenKey}->mapWithKeys($cb)->toArray();

                    return [$key => $data];
                }
            )
            ->toArray();
    }

    public function orderColumn(string | Closure | null $column = 'sort'): static
    {
        $this->orderColumn = $column;

        return $this;
    }

    public function getOrderColumn(): ?string
    {
        return $this->evaluate($this->orderColumn);
    }

    public function getRelationship(): HasMany | BelongsToMany
    {
        if ($model = $this->getModelInstance()) {
            if (! in_array(HasRecursiveRelationships::class, class_uses($model))) {
                throw new \Exception('The model ' . $model::class . ' must use the ' . HasRecursiveRelationships::class . ' trait.');
            }
        }

        return $model->{$this->getRelationshipName()}();
    }

    public function getRelationshipName(): ?string
    {
        return $this->evaluate($this->relationship);
    }

    public function cacheRecord(Model $record): void
    {
        $this->cachedExistingRecords?->put(md5('record-' . $record->getKey()), $record);

        $this->fillFromRelationship();
    }

    public function deleteCachedRecord(Model $record): void
    {
        $this->cachedExistingRecords?->forget(md5('record-' . $record->getKey()));

        $this->fillFromRelationship();
    }

    public function getCachedExistingRecords(): Collection
    {
        if ($this->cachedExistingRecords) {
            return $this->cachedExistingRecords;
        }

        $relationship = $this->getRelationship();
        $relationshipQuery = $relationship->getQuery();

        if ($this->modifyRelationshipQueryUsing) {
            $relationshipQuery = $this->evaluate($this->modifyRelationshipQueryUsing, [
                'query' => $relationshipQuery,
            ]) ?? $relationshipQuery;
        }

        if ($orderColumn = $this->getOrderColumn()) {
            $relationshipQuery->orderBy($orderColumn);
        }

        return $this->cachedExistingRecords = $relationshipQuery->get()
            ->mapWithKeys(fn (Model $record): array => [md5('record-' . $record->getKey()) => $record]);
    }

    public function clearCachedExistingRecords(): void
    {
        $this->cachedExistingRecords = null;
    }

    public function getRelatedModel(): string
    {
        return $this->getRelationship()->getModel()::class;
    }

    public function mutateRelationshipDataBeforeCreateUsing(?Closure $callback): static
    {
        $this->mutateRelationshipDataBeforeCreateUsing = $callback;

        return $this;
    }

    /**
     * @param  array<array<string, mixed>>  $data
     * @return array<array<string, mixed>>
     */
    public function mutateRelationshipDataBeforeCreate(array $data): array
    {
        if ($this->mutateRelationshipDataBeforeCreateUsing instanceof Closure) {
            $data = $this->evaluate($this->mutateRelationshipDataBeforeCreateUsing, [
                'data' => $data,
            ]);
        }

        return $data;
    }

    /**
     * @param  array<array<string, mixed>>  $data
     * @return array<array<string, mixed>>
     */
    public function mutateRelationshipDataBeforeFill(array $data): array
    {
        if ($this->mutateRelationshipDataBeforeFillUsing instanceof Closure) {
            $data = $this->evaluate($this->mutateRelationshipDataBeforeFillUsing, [
                'data' => $data,
            ]);
        }

        return $data;
    }

    public function mutateRelationshipDataBeforeFillUsing(?Closure $callback): static
    {
        $this->mutateRelationshipDataBeforeFillUsing = $callback;

        return $this;
    }

    public function mutateRelationshipDataBeforeSaveUsing(?Closure $callback): static
    {
        $this->mutateRelationshipDataBeforeSaveUsing = $callback;

        return $this;
    }

    /**
     * @param  array<array<string, mixed>>  $data
     * @return array<array<string, mixed>>
     */
    public function mutateRelationshipDataBeforeSave(array $data, Model $record): array
    {
        if ($this->mutateRelationshipDataBeforeSaveUsing instanceof Closure) {
            $data = $this->evaluate(
                $this->mutateRelationshipDataBeforeSaveUsing,
                namedInjections: [
                    'data' => $data,
                    'record' => $record,
                ],
                typedInjections: [
                    Model::class => $record,
                    $record::class => $record,
                ],
            );
        }

        return $data;
    }

    public function pivotAttributes(array | Closure | null $pivotAttributes): static
    {
        $this->pivotAttributes = $pivotAttributes;

        return $this;
    }

    public function getPivotAttributes(): array
    {
        return $this->evaluate($this->pivotAttributes) ?? [];
    }
}
