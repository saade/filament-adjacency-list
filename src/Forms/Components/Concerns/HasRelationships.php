<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Concerns;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

trait HasRelationships
{
    protected ?Collection $cachedExistingRecords = null;

    protected string | Closure | null $orderColumn = null;

    protected string | Closure | null $relationship = null;

    protected ?Closure $modifyRelationshipQueryUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeCreateUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeFillUsing = null;

    protected ?Closure $mutateRelationshipDataBeforeSaveUsing = null;

    protected string | Closure | null $customPath = null;

    protected array | Closure | null $pivotAttributes = null;

    public function orderColumn(string | Closure | null $column = 'sort'): static
    {
        $this->orderColumn = $column;

        return $this;
    }

    public function pivotAttributes(array | Closure | null $pivotAttributes): static
    {
        $this->pivotAttributes = $pivotAttributes;

        return $this;
    }

    public function relationship(string | Closure | null $name = null, ?Closure $modifyQueryUsing = null): static
    {
        $this->relationship = $name ?? $this->getName();
        $this->modifyRelationshipQueryUsing = $modifyQueryUsing;

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

                    $path = $component->getPath();
                    $childrenKey = $component->getChildrenKey();
                    $recordKeyName = $relationship->getRelated()->getKeyName();
                    $recordKey = data_get($item, $recordKeyName);

                    // Update item order
                    if ($orderColumn = $component->getOrderColumn()) {
                        $item[$orderColumn] = array_search($key, array_keys($items));
                    }

                    $data = Arr::except($item, [$recordKeyName, $childrenKey, $path]);

                    // Update or create record
                    if ($record = $cachedExistingRecords->firstWhere($recordKeyName, $recordKey)) {
                        $record->fill($component->mutateRelationshipDataBeforeSave($data, $record));
                    } else {
                        $record = new ($component->getRelatedModel());
                        $record->fill($component->mutateRelationshipDataBeforeCreate($data));
                    }

                    unset($record->{$path});

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

            $component->fillFromRelationship();
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
                    $recordKeyName = $record->getKeyName();

                    $data = $this->mutateRelationshipDataBeforeFill(
                        $this->getLivewire()->makeFilamentTranslatableContentDriver() ?
                            $this->getLivewire()->makeFilamentTranslatableContentDriver()->getRecordAttributesToArray($record) :
                            $record->attributesToArray()
                    );

                    $data[$childrenKey] = $record->children->mapWithKeys($cb)->toArray();

                    return ['record-' . $record->{$recordKeyName} => $data];
                }
            )
            ->toArray();
    }

    public function getOrderColumn(): ?string
    {
        return $this->evaluate($this->orderColumn);
    }

    public function getRelationship(): HasMany | BelongsToMany | null
    {
        if (! $this->hasRelationship()) {
            return null;
        }

        if ($model = $this->getModelInstance()) {
            if (! in_array(HasRecursiveRelationships::class, class_uses($model))) {
                throw new \Exception('The model ' . $model::class . ' must use the HasRecursiveRelationships trait.');
            }
        }

        return $model->{$this->getRelationshipName()}();
    }

    public function getRelationshipName(): ?string
    {
        return $this->evaluate($this->relationship);
    }

    public function getPivotAttributes(): ?array
    {
        return $this->evaluate($this->pivotAttributes);
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

        return $this->cachedExistingRecords = $relationshipQuery->get();
    }

    public function clearCachedExistingRecords(): void
    {
        $this->cachedExistingRecords = null;
    }

    public function getRelatedModel(): string
    {
        return $this->getRelationship()->getModel()::class;
    }

    public function hasRelationship(): bool
    {
        return filled($this->getRelationshipName());
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

    public function mutateRelationshipDataBeforeSaveUsing(?Closure $callback): static
    {
        $this->mutateRelationshipDataBeforeSaveUsing = $callback;

        return $this;
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

    public function customPath(string | Closure $path): static
    {
        $this->customPath = $path;

        return $this;
    }

    public function getCustomPath(): ?string
    {
        return $this->evaluate($this->customPath);
    }

    public function getPath(): string
    {
        return $this->getCustomPath() ?? 'path';
    }
}
