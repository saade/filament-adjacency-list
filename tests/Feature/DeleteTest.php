<?php

declare(strict_types=1);

use Filament\Actions\Testing\TestAction;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Enums\ChildrenOnDelete;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Models\Category;
use Tests\Fixtures\Pages\AdjacencyListPage;
use Tests\Fixtures\Pages\EditCategoryPage;

beforeEach(function () {
    // No foreign key, so nothing but the field decides what happens to the children.
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('parent_id')->nullable();
        $table->string('name');
        $table->unsignedInteger('sort')->default(0);
        $table->timestamps();
    });

    $this->root = Category::create(['name' => 'Catalog']);
    $this->books = $this->root->children()->create(['name' => 'Books', 'sort' => 1]);
    $this->music = $this->root->children()->create(['name' => 'Music', 'sort' => 2]);
    $this->fiction = $this->books->children()->create(['name' => 'Fiction', 'sort' => 1]);
    $this->crime = $this->fiction->children()->create(['name' => 'Crime', 'sort' => 1]);
});

afterEach(function () {
    EditCategoryPage::$configureAfterRelationship = null;
    AdjacencyListPage::$configure = null;
});

function deleteCategory($component, string $name): void
{
    $find = function (array $items, string $path) use (&$find, $name): ?array {
        foreach ($items as $key => $item) {
            if ($item['name'] === $name) {
                return ['statePath' => "{$path}.{$key}", 'cachedRecordKey' => $key];
            }

            if ($found = $find($item['children'], "{$path}.{$key}.children")) {
                return $found;
            }
        }

        return null;
    };

    $component->callAction(
        TestAction::make('delete')->schemaComponent('descendants')->arguments($find($component->get('data.descendants'), 'data.descendants')),
    );
}

function categoryNames(array $items): array
{
    return collect($items)->map(fn (array $item): array => [$item['name'] => categoryNames($item['children'])])->values()->all();
}

it('deletes an item together with everything under it', function () {
    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    deleteCategory($component, 'Books');

    expect(Category::pluck('name')->all())->toBe(['Catalog', 'Music'])
        ->and(categoryNames($component->get('data.descendants')))->toBe([['Music' => []]]);
});

it('can move the children of a deleted item up, to take its place', function () {
    EditCategoryPage::$configureAfterRelationship = fn (AdjacencyList $list) => $list->moveChildrenUpOnDelete();

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    deleteCategory($component, 'Books');

    expect(Category::pluck('name')->all())->toBe(['Catalog', 'Music', 'Fiction', 'Crime'])
        ->and($this->fiction->refresh()->parent_id)->toBe($this->root->getKey())
        ->and($this->crime->refresh()->parent_id)->toBe($this->fiction->getKey())
        ->and(categoryNames($component->get('data.descendants')))->toBe([
            ['Fiction' => [['Crime' => []]]],
            ['Music' => []],
        ]);
});

it('deletes the whole branch of an item kept in the state', function () {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', [
        'a' => ['label' => 'A', 'children' => ['a1' => ['label' => 'A1', 'children' => []]]],
        'b' => ['label' => 'B', 'children' => []],
    ]);

    $component->callAction(
        TestAction::make('delete')->schemaComponent('items')->arguments(['statePath' => 'data.items.a', 'cachedRecordKey' => 'a']),
    );

    expect(array_keys($component->get('data.items')))->toBe(['b']);
});

it('can move the children of an item kept in the state up, into its place', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->moveChildrenUpOnDelete();

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', [
        'a' => ['label' => 'A', 'children' => [
            'a1' => ['label' => 'A1', 'children' => []],
            'a2' => ['label' => 'A2', 'children' => []],
        ]],
        'b' => ['label' => 'B', 'children' => []],
    ]);

    $component->callAction(
        TestAction::make('delete')->schemaComponent('items')->arguments(['statePath' => 'data.items.a', 'cachedRecordKey' => 'a']),
    );

    expect(array_keys($component->get('data.items')))->toBe(['a1', 'a2', 'b']);
});

it('can leave the children of a deleted item without a parent', function () {
    EditCategoryPage::$configureAfterRelationship = fn (AdjacencyList $list) => $list->nullChildrenOnDelete();

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    deleteCategory($component, 'Books');

    expect(Category::pluck('name')->all())->toBe(['Catalog', 'Music', 'Fiction', 'Crime'])
        ->and($this->fiction->refresh()->parent_id)->toBeNull()
        ->and($this->crime->refresh()->parent_id)->toBe($this->fiction->getKey())
        ->and(categoryNames($component->get('data.descendants')))->toBe([['Music' => []]]);
});

it('moves the children of an item kept in the state to the top level when they are orphaned', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->nullChildrenOnDelete();

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', [
        'a' => ['label' => 'A', 'children' => [
            'a1' => ['label' => 'A1', 'children' => [
                'a1x' => ['label' => 'A1X', 'children' => []],
            ]],
        ]],
        'b' => ['label' => 'B', 'children' => []],
    ]);

    $component->callAction(
        TestAction::make('delete')->schemaComponent('items')->arguments(['statePath' => 'data.items.a.children.a1', 'cachedRecordKey' => 'a1']),
    );

    expect(array_keys($component->get('data.items')))->toBe(['a', 'b', 'a1x'])
        ->and($component->get('data.items.a.children'))->toBe([]);
});

it('decides what happens to the children from a closure', function () {
    EditCategoryPage::$configureAfterRelationship = fn (AdjacencyList $list) => $list->childrenOnDelete(fn (): ChildrenOnDelete => ChildrenOnDelete::MoveUp);

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    deleteCategory($component, 'Fiction');

    expect($this->crime->refresh()->parent_id)->toBe($this->books->getKey());
});

it('can refuse to delete an item that has children', function () {
    EditCategoryPage::$configureAfterRelationship = fn (AdjacencyList $list) => $list->restrictChildrenOnDelete();

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    $books = collect($component->get('data.descendants'))->search(fn (array $item): bool => $item['name'] === 'Books');
    $music = collect($component->get('data.descendants'))->search(fn (array $item): bool => $item['name'] === 'Music');

    $component
        ->assertActionHidden(TestAction::make('delete')->schemaComponent('descendants')->arguments(['statePath' => "data.descendants.{$books}", 'cachedRecordKey' => $books]))
        ->assertActionVisible(TestAction::make('delete')->schemaComponent('descendants')->arguments(['statePath' => "data.descendants.{$music}", 'cachedRecordKey' => $music]));

    deleteCategory($component, 'Music');

    expect(Category::pluck('name')->all())->toBe(['Catalog', 'Books', 'Fiction', 'Crime']);
});

it('refuses on the server too, for a page that still shows the button', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->restrictChildrenOnDelete();

    $tree = [
        'a' => ['label' => 'A', 'children' => ['a1' => ['label' => 'A1', 'children' => []]]],
        'b' => ['label' => 'B', 'children' => []],
    ];

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', $tree);

    $component->instance()->mountAction('delete', ['statePath' => 'data.items.a', 'cachedRecordKey' => 'a'], ['schemaComponent' => 'form.items']);

    expect($component->get('data.items'))->toBe($tree);
});
