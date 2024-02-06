<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
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

        $this->saveRelationshipsUsing(static function (AdjacencyList $component, ?array $state) {
            if (! is_array($state)) {
                $state = [];
            }

            $cachedExistingRecords = $component->getCachedExistingRecords();
            $existingItemsIds = [];

            foreach ($state as $key => $item) {
                $cb = function (array $items, array $item, string $key) use (&$cb, $component, $cachedExistingRecords, &$existingItemsIds) {
                    $relationship = $component->getRelationship();

                    $childrenKey = $component->getChildrenKey();
                    $recordKeyName = $relationship->getRelated()->getKeyName();
                    $recordKey = data_get($item, $recordKeyName);

                    // Update item order
                    if ($orderColumn = $component->getOrderColumn()) {
                        $item[$orderColumn] = array_search($key, array_keys($items));
                    }

                    // TODO: add ignore columns method
                    $data = Arr::except($item, [$recordKeyName, $childrenKey, 'path', 'depth']);

                    // Update or create record
                    if ($record = $cachedExistingRecords->firstWhere($recordKeyName, $recordKey)) {
                        $record->fill($component->mutateRelationshipDataBeforeSave($data, $record));
                    } else {
                        $record = new ($component->getRelatedModel());
                        $record->fill($component->mutateRelationshipDataBeforeCreate($data));
                    }

                    if ($relationship instanceof BelongsToMany) {
                        // if it's a many-to-many with pivot, we need to recursively walk down to the leaf nodes,
                        // potentially creating new nodes along the way, before we can then sync the children to the
                        // pivot on the way back up the tree.
                        $record->save();

                        if ($children = data_get($item, $childrenKey)) {
                            $childrenRecords = collect($children)
                                ->map(fn ($child, $childKey) => $cb($children, $child, $childKey));

                            $record->{$childrenKey}()->syncWithPivotValues(
                                $childrenRecords->pluck($recordKeyName),
                                $component->getPivotAttributes() ?? []
                            );
                        }
                    } else {
                        $record = $relationship->save($record);

                        // Update children
                        if ($children = data_get($item, $childrenKey)) {
                            $childrenRecords = collect($children)
                                ->map(fn ($child, $childKey) => $cb($children, $child, $childKey));

                            $record->{$childrenKey}()->saveMany($childrenRecords);
                        }
                    }

                    // Update cached existing records
                    $cachedExistingRecords->push($record);
                    $existingItemsIds[] = $record->getKey();

                    return $record;
                };

                $cb($state, $item, $key);
            }

            // Delete removed records
            $cachedExistingRecords
                ->filter(fn (Model $record) => ! in_array($record->getKey(), $existingItemsIds))
                ->each(function (Model $record) use ($cachedExistingRecords) {
                    $record->delete();
                    $cachedExistingRecords->forget("record-{$record->getKey()}");
                });

            $component->fillFromRelationship(cached: false);
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

    public function getPivotAttributes(): ?array
    {
        return $this->evaluate($this->pivotAttributes);
    }
}
