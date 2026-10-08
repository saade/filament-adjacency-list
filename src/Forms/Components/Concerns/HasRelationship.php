<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Saade\FilamentAdjacencyList\Enums\ChildrenOnDelete;
use Saade\FilamentAdjacencyList\Forms\Components\Actions\Action;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Saade\FilamentAdjacencyList\Forms\Components\Component;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasGraphRelationships;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

trait HasRelationship
{
    protected string | Closure | null $relationship = null;

    protected ?Collection $cachedExistingRecords = null;

    protected ?string $cachedRelatedModel = null;

    protected string | Closure | null $orderColumn = null;

    protected ?Closure $modifyRelationshipQueryUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeCreateUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeFillUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeSaveUsing = null;

    protected array | Closure | null $pivotAttributes = null;

    protected bool | Closure $shouldSaveOnReorder = false;

    public function relationship(string | Closure | null $name = null, ?Closure $modifyQueryUsing = null): static
    {
        $this->relationship = $name ?? $this->getName();
        $this->modifyRelationshipQueryUsing = $modifyQueryUsing;

        $this->loadStateFromRelationshipsUsing(static function (AdjacencyList $component) {
            $component->clearCachedExistingRecords();

            $component->fillFromRelationship();
        });

        $this->saveRelationshipsUsing(static function (AdjacencyList $component, ?array $state) {
            if ($component->isWaitingForOwnerRecord()) {
                return;
            }

            if (! is_array($state)) {
                $state = [];
            }

            $cachedExistingRecords = $component->getCachedExistingRecords();
            $relationship = $component->getRelationship();
            $childrenKey = $component->getChildrenKey();
            $recordKeyName = $relationship->getRelated()->getKeyName();
            $orderColumn = $component->getOrderColumn();
            $pivotAttributes = $component->getPivotAttributes();
            $owner = $component->getModelInstance();

            $getPivotValues = function (array $records) use ($recordKeyName, $orderColumn, $pivotAttributes): array {
                $values = [];

                foreach (array_values($records) as $position => $record) {
                    $values[$record->getAttribute($recordKeyName)] = [
                        ...$pivotAttributes,
                        ...($orderColumn ? [$orderColumn => $position + 1] : []),
                    ];
                }

                return $values;
            };

            $records = Arr::map(
                $state,
                $traverse = function (array $item, string $itemKey, array $siblings = []) use (&$traverse, &$cachedExistingRecords, $state, $relationship, $childrenKey, $orderColumn, $getPivotValues, $owner): Model {
                    $record = $cachedExistingRecords->get($itemKey);
                    $isOwner = $record->is($owner);

                    /* Update item order */
                    if ($orderColumn && (! $isOwner)) {
                        $record->{$orderColumn} = array_search($itemKey, array_keys($siblings ?: $state)) + 1;
                    }

                    if ($relationship instanceof BelongsToMany) {
                        $record->save();

                        $children = data_get($item, $childrenKey) ?: [];

                        $record->{$childrenKey}()->sync($getPivotValues(
                            Arr::map($children, fn (array $child, string $childKey): Model => $traverse($child, $childKey, $children)),
                        ));

                        return $record;
                    }

                    if (! $isOwner) {
                        $relationship->save($record);
                    }

                    if ($children = data_get($item, $childrenKey)) {
                        $childrenRecords = collect($children)
                            ->map(fn (array $child, string $childKey) => $traverse($child, $childKey, $children))
                            ->reject(fn (Model $child): bool => $child->is($owner));

                        $record->{$childrenKey}()->saveMany($childrenRecords);
                    }

                    return $record;
                }
            );

            if ($relationship instanceof BelongsToMany) {
                $component->getModelInstance()->{$childrenKey}()->sync($getPivotValues($records));
            }

            // Clear cache
            $component->fillFromRelationship();
        });

        $this->configureActionUsing('add', function (Action $action): void {
            $action->using(function (Component $component, array $data): void {
                $relationship = $component->getRelationship();
                $model = $component->getRelatedModel();
                $pivotData = $component->getPivotAttributes();

                if ($relationship instanceof BelongsToMany) {
                    $pivotColumns = $relationship->getPivotColumns();

                    $pivotData = Arr::only($data, $pivotColumns);
                    $data = Arr::except($data, $pivotColumns);
                }

                $data = $component->mutateRelationshipDataBeforeCreate($data);

                if ($translatableContentDriver = $component->getLivewire()->makeFilamentTranslatableContentDriver()) {
                    $record = $translatableContentDriver->makeRecord($model, $data);
                } else {
                    $record = new $model;
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

        $this->configureActionUsing('addChild', function (Action $action): void {
            $action->using(function (Component $component, Model $parentRecord, array $data, array $arguments): void {
                $relationship = $component->getRelationship();
                $model = $component->getRelatedModel();

                $pivotData = $component->getPivotAttributes();

                if ($relationship instanceof BelongsToMany) {
                    $pivotColumns = $relationship->getPivotColumns();

                    $pivotData = Arr::only($data, $pivotColumns);
                    $data = Arr::except($data, $pivotColumns);
                }

                $data = $component->mutateRelationshipDataBeforeCreate($data);

                if ($translatableContentDriver = $component->getLivewire()->makeFilamentTranslatableContentDriver()) {
                    $record = $translatableContentDriver->makeRecord($model, $data);
                } else {
                    $record = new $model;
                    $record->fill($data);
                }

                if ($orderColumn = $component->getOrderColumn()) {
                    $record->{$orderColumn} = $pivotData[$orderColumn] = count(
                        data_get(
                            $component->getState(),
                            $component->getItemStatePath($arguments) . '.' . $component->getChildrenKey()
                        )
                    );
                }

                if ($relationship instanceof BelongsToMany) {
                    $record->save();

                    $parentRecord->{$component->getChildrenKey()}()->syncWithoutDetaching([
                        $record->getKey() => $pivotData,
                    ]);

                    $component->cacheRecord($record);

                    return;
                }

                $parentRecord->{$component->getChildrenKey()}()->save($record);

                $component->cacheRecord($record);
            });
        });

        $this->configureActionUsing('edit', function (Action $action): void {
            $action->using(function (Component $component, Model $record, array $data): void {
                $relationship = $component->getRelationship();

                $translatableContentDriver = $component->getLivewire()->makeFilamentTranslatableContentDriver();

                if ($relationship instanceof BelongsToMany) {
                    $pivot = $record->getAttribute($relationship->getPivotAccessor());

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

                // Clear cache
                $component->fillFromRelationship();
            });
        });

        $this->configureActionUsing('delete', function (Action $action): void {
            $action->using(function (Component $component, Model $record): void {
                $relationship = $component->getRelationship();

                if ($relationship instanceof BelongsToMany) {
                    $pivot = $record->getAttribute($relationship->getPivotAccessor());

                    $pivot->delete();

                    $record->delete();

                    $component->deleteCachedRecord($record);

                    return;
                }

                $childrenKey = $component->getChildrenKey();

                $record->getConnection()->transaction(function () use ($component, $record, $childrenKey): void {
                    $parentKeyName = $record->getParentKeyName();

                    $parentKey = match ($component->getChildrenOnDelete()) {
                        ChildrenOnDelete::MoveUp => $record->getAttribute($parentKeyName),
                        ChildrenOnDelete::SetNull => null,
                        ChildrenOnDelete::Cascade, ChildrenOnDelete::Restrict => false,
                    };

                    if ($parentKey === false) {
                        $record->descendants()->orderByDesc($record->getDepthName())->get()->each->delete();
                    } else {
                        $record->{$childrenKey}()->get()->each(
                            fn (Model $child) => $child->setAttribute($parentKeyName, $parentKey)->save(),
                        );
                    }

                    $record->delete();
                });

                $component->clearCachedExistingRecords();
                $component->fillFromRelationship();
            });
        });

        $this->dehydrated(false);

        return $this;
    }

    public function saveOnReorder(bool | Closure $condition = true): static
    {
        $this->shouldSaveOnReorder = $condition;

        return $this;
    }

    public function shouldSaveOnReorder(): bool
    {
        return (bool) $this->evaluate($this->shouldSaveOnReorder);
    }

    public function saveReorderedRelationships(): void
    {
        if (blank($this->getRelationshipName()) || (! $this->shouldSaveOnReorder())) {
            return;
        }

        $this->saveRelationships();
    }

    public function fillFromRelationship(): void
    {
        $this->state(
            $this->getStateFromRelatedRecords($this->getCachedExistingRecords()),
        );
    }

    /**
     * @param  \Staudenmeir\LaravelAdjacencyList\Eloquent\Collection | \Staudenmeir\LaravelAdjacencyList\Eloquent\Graph\Collection  $records
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

                    $key = $this->getCacheKey($record);
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

    /**
     * @throws \Exception
     */
    public function getRelationship(): HasMany | BelongsToMany | null
    {
        $name = $this->getRelationshipName();

        if (blank($name)) {
            return null;
        }

        if (! ($model = $this->getModelInstance())) {
            return null;
        }

        $traits = class_uses_recursive($model);

        if (! in_array(HasRecursiveRelationships::class, $traits)
        && ! in_array(HasGraphRelationships::class, $traits)) {
            throw new \Exception('The model ' . $model::class . ' must use either the ' . HasRecursiveRelationships::class . ' or ' . HasGraphRelationships::class . ' trait.');
        }

        return $model->{$name}();
    }

    public function isWaitingForOwnerRecord(): bool
    {
        return filled($this->getRelationshipName()) && (! $this->getModelInstance()?->exists);
    }

    public function getRelationshipName(): ?string
    {
        return $this->evaluate($this->relationship);
    }

    public function cacheRecord(Model $record): void
    {
        $this->cachedExistingRecords?->put($this->getCacheKey($record), $record);

        $this->fillFromRelationship();
    }

    public function deleteCachedRecord(Model $record): void
    {
        $this->cachedExistingRecords?->forget($this->getCacheKey($record));

        $this->fillFromRelationship();
    }

    public function getCachedExistingRecords(): Collection
    {
        if ($this->cachedExistingRecords) {
            return $this->cachedExistingRecords;
        }

        if ($this->isWaitingForOwnerRecord()) {
            return new Collection;
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
            ->mapWithKeys(function (Model $record): array {
                return [$this->getCacheKey($record) => $record];
            });
    }

    private function getCacheKey(Model $record): string
    {
        if (method_exists($record, 'getParentKeyName')) {
            $pivotAttribute = 'pivot_' . $record->getParentKeyName();
            $pivotSuffix = isset($record->$pivotAttribute) ? '-' . $record->$pivotAttribute : '';
        } else {
            $pivotSuffix = null;
        }

        return md5('record-' . $record->getKey() . $pivotSuffix);
    }

    public function clearCachedExistingRecords(): void
    {
        $this->cachedExistingRecords = null;
    }

    public function getRelatedModel(): ?string
    {
        return $this->cachedRelatedModel ??= ($model = $this->getRelationship()?->getModel()) ? $model::class : null;
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
