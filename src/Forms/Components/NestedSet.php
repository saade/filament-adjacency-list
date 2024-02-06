<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Kalnoy\Nestedset\DescendantsRelation;

class NestedSet extends Component
{
    use Concerns\HasRelationship;

    protected function setUp(): void
    {
        parent::setUp();

        $this->afterStateHydrated(null);

        $this->loadStateFromRelationshipsUsing(static function (NestedSet $component) {
            $component->clearCachedExistingRecords();

            $component->fillFromRelationship();
        });

        $this->saveRelationshipsUsing(static function (NestedSet $component, ?array $state) {
            if (! is_array($state)) {
                $state = [];
            }

            $cachedExistingRecords = $component->getCachedExistingRecords();

            $data = collect($state)
                ->map(
                    $cb = function ($item, $key, $children = []) use (&$cb, $component, $state, $cachedExistingRecords) {
                        $relationship = $component->getRelationship();

                        $childrenKey = $component->getChildrenKey();
                        $recordKeyName = $relationship->getRelated()->getKeyName();
                        $recordKey = data_get($item, $recordKeyName);

                        // Update item order
                        if ($orderColumn = $component->getOrderColumn()) {
                            $item[$orderColumn] = array_search($key, array_keys($children ?: $state));
                        }

                        $data = Arr::except($item, [$childrenKey, 'parent_id', '_lft', '_rgt', 'created_at', 'updated_at', 'deleted_at']);

                        // Update or create record
                        if ($record = $cachedExistingRecords->firstWhere($recordKeyName, $recordKey)) {
                            $data = $component->mutateRelationshipDataBeforeSave($data, $record);
                        } else {
                            $data = $component->mutateRelationshipDataBeforeCreate($data);
                        }

                        // Update children
                        if ($children = data_get($item, $childrenKey)) {
                            $data[$childrenKey] = collect($children)
                                ->map(fn ($child, $childKey) => $cb($child, $childKey, $children))
                                ->toArray();
                        }

                        return $data;
                    }
                )
                ->toArray();

            $component->getRelatedModel()::rebuildTree($data);

            $component->fillFromRelationship(cached: false);
        });

        $this->dehydrated(false);
    }

    public function getRelationship(): HasMany | BelongsToMany | DescendantsRelation
    {
        return $this->getModelInstance()->{$this->getRelationshipName()}();
    }

    public function getChildrenKey(): string
    {
        return 'children';
    }
}
