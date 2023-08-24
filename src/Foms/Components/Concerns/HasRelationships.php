<?php

namespace Saade\FilamentAdjacencyList\Foms\Components\Concerns;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Saade\FilamentAdjacencyList\Foms\Components\AdjacencyList;

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

    public function orderColumn(string | Closure | null $column = 'sort'): static
    {
        $this->orderColumn = $column;

        return $this;
    }

    public function relationship(string | Closure $name = null, Closure $modifyQueryUsing = null): static
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

                    $childrenKey = $component->getChildrenKey();
                    $recordKeyName = $relationship->getRelated()->getKeyName();
                    $recordKey = data_get($item, $recordKeyName);

                    // Update item order
                    if ($orderColumn = $component->getOrderColumn()) {
                        $item[$orderColumn] = array_search($key, array_keys($items));
                    }

                    $data = Arr::except($item, [$recordKeyName, $childrenKey]);

                    // Update or create record
                    if ($record = $cachedExistingRecords->firstWhere($recordKeyName, $recordKey)) {
                        $record->fill($component->mutateRelationshipDataBeforeSave($data, $record));
                    } else {
                        $record = new ($component->getRelatedModel());
                        $record->fill($component->mutateRelationshipDataBeforeCreate($data));
                    }

                    $record = $relationship->save($record);

                    // Update children
                    if ($children = data_get($item, $childrenKey)) {
                        $childrenRecords = collect($children)
                            ->map(fn ($child, $childKey) => $cb($children, $child, $childKey));

                        $record->{$childrenKey}()->saveMany($childrenRecords);
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

        $state = [];

        $path = $this->getPath();
        $translatableContentDriver = $this->getLivewire()->makeFilamentTranslatableContentDriver();

        $records
            ->each(
                function (Model $record) use (&$state, $path, $translatableContentDriver): void {
                    $data = $translatableContentDriver ?
                        $translatableContentDriver->getRecordAttributesToArray($record) :
                        $record->only([$record->getKeyName(), ...$record->getFillable()]);

                    $key = $record->{$path};

                    $data = $this->mutateRelationshipDataBeforeFill($data);

                    // Depending on the records order, a children can be created before its parent.
                    // In this case, we need to merge the children with the parent data.
                    if ($existing = data_get($state, $key)) {
                        data_set($state, $key, array_merge($existing, $data));
                    } else {
                        data_set($state, $key, $data);
                    }
                }
            );

        return $state;
    }

    public function getOrderColumn(): ?string
    {
        return $this->evaluate($this->orderColumn);
    }

    public function getRelationship(): ?HasMany
    {
        if (! $this->hasRelationship()) {
            return null;
        }

        return $this->getModelInstance()->{$this->getRelationshipName()}();
    }

    public function getRelationshipName(): ?string
    {
        return $this->evaluate($this->relationship);
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

        $relatedKeyName = $relationship->getRelated()->getKeyName();

        return $this->cachedExistingRecords = $relationshipQuery->get()->mapWithKeys(
            fn (Model $item): array => ["record-{$item[$relatedKeyName]}" => $item],
        );
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
