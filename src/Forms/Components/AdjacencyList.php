<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Saade\FilamentAdjacencyList\Forms\Components\Actions\Action;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

class AdjacencyList extends Component
{
    use Concerns\HasRelationship;

    protected array | Closure | null $pivotAttributes = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->afterStateHydrated(null);

        $this->loadStateFromRelationshipsUsing(static function (AdjacencyList $component) {
            $component->clearCachedExistingRecords();

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

        $this->dehydrated(false);
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
