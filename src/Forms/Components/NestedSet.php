<?php

namespace Saade\FilamentAdjacencyList\Forms\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
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
            $existingRecordsIds = [];

            $data = Arr::map(
                $state,
                $traverse = function (array $item, string $key, array $siblings = []) use (&$traverse, $component, $state, $cachedExistingRecords, &$existingRecordsIds): array {
                    $relationship = $component->getRelationship();
                    $childrenKey = $component->getChildrenKey();
                    $recordKeyName = $relationship->getRelated()->getKeyName();
                    $recordKey = data_get($item, $recordKeyName);

                    // Update item order
                    if ($orderColumn = $component->getOrderColumn()) {
                        $item[$orderColumn] = array_search($key, array_keys($siblings ?? $state));
                    }

                    // Remove ignored columns
                    $data = Arr::except($item, $component->getIgnoredColumns());

                    // Update or Create record
                    if ($record = $cachedExistingRecords->firstWhere($recordKeyName, $recordKey)) {
                        $data = $component->mutateRelationshipDataBeforeSave($data, $record);
                    } else {
                        $data = $component->mutateRelationshipDataBeforeCreate($data);
                    }

                    // Update children
                    if ($children = data_get($item, $childrenKey)) {
                        $data[$childrenKey] = Arr::map($children, fn ($child, $childKey) => $traverse($child, $childKey, $children));
                    }

                    // Do not delete this item
                    $existingRecordsIds[] = $recordKey;

                    return $data;
                }
            );

            DB::transaction(
                function () use ($component, $data, $existingRecordsIds, $cachedExistingRecords): void {
                    // Save tree
                    $component->getRelatedModel()::rebuildTree($data);

                    // Delete removed records
                    $cachedExistingRecords
                        ->reject(fn (Model $record) => in_array($record->getKey(), $existingRecordsIds))
                        ->each(function (Model $record) use ($cachedExistingRecords) {
                            $record->delete();
                            $cachedExistingRecords->forget("record-{$record->getKey()}");
                        });
                }
            );

            // Clear cache
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

    public function getIgnoredColumns(): array
    {
        return [
            'children',
            'parent_id',
            '_lft',
            '_rgt',
            'created_at',
            'updated_at',
            'deleted_at',
        ];
    }
}
