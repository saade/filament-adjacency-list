<?php

declare(strict_types=1);

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Models\Category;
use Tests\Fixtures\Models\Subcategory;
use Tests\Fixtures\Pages\EditCategoryPage;
use Tests\Fixtures\Support\LockableCategoryPolicy;
use Tests\Fixtures\Widgets\CategoryTreeWidget;

beforeEach(function () {
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();
        $table->string('name');
        $table->unsignedInteger('sort')->default(0);
        $table->timestamps();
    });

    $this->root = Category::create(['name' => 'Catalog']);

    $this->books = $this->root->children()->create(['name' => 'Books', 'sort' => 1]);
    $this->music = $this->root->children()->create(['name' => 'Music', 'sort' => 2]);
    $this->fiction = $this->books->children()->create(['name' => 'Fiction', 'sort' => 1]);
});

afterEach(function () {
    EditCategoryPage::$relationship = 'descendants';
});

function treeNames(array $items): array
{
    return collect($items)
        ->map(fn (array $item): array => [$item['name'] => treeNames($item['children'])])
        ->values()
        ->all();
}

it('loads the descendants of the record as a tree, as the README shows', function () {
    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    expect(treeNames($component->get('data.descendants')))->toBe([
        ['Books' => [['Fiction' => []]]],
        ['Music' => []],
    ]);

    $component->assertSee(['Books', 'Fiction', 'Music']);
});

it('accepts a model that gets the tree trait from a parent class', function () {
    $component = Livewire::test(EditCategoryPage::class, ['record' => Subcategory::find($this->root->getKey())]);

    expect(treeNames($component->get('data.descendants')))->toBe([
        ['Books' => [['Fiction' => []]]],
        ['Music' => []],
    ]);
});

it('saves a new order and a new parent with the form', function () {
    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    $state = $component->get('data.descendants');
    [$booksKey, $musicKey] = array_keys($state);
    $fictionKey = array_key_first($state[$booksKey]['children']);

    $fiction = $state[$booksKey]['children'][$fictionKey];
    $state[$booksKey]['children'] = [];
    $state[$musicKey]['children'] = [$fictionKey => $fiction];

    $component
        ->set('data.descendants', [$musicKey => $state[$musicKey], $booksKey => $state[$booksKey]])
        ->call('save');

    expect($this->fiction->refresh()->parent_id)->toBe($this->music->getKey())
        ->and($this->music->refresh()->sort)->toBe(1)
        ->and($this->books->refresh()->sort)->toBe(2)
        ->and($this->music->parent_id)->toBe($this->root->getKey())
        ->and($this->root->refresh()->parent_id)->toBeNull();
});

it('leaves the record itself alone when the tree includes it', function () {
    EditCategoryPage::$relationship = 'descendantsAndSelf';

    $this->root->update(['sort' => 7]);

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    expect(treeNames($component->get('data.descendants')))->toBe([
        ['Catalog' => [['Books' => [['Fiction' => []]]], ['Music' => []]]],
    ]);

    $component->call('save');

    expect($this->root->refresh()->parent_id)->toBeNull()
        ->and($this->root->sort)->toBe(7)
        ->and($this->books->refresh()->parent_id)->toBe($this->root->getKey());
});

it('does not move the record itself under one of its own items', function () {
    EditCategoryPage::$relationship = 'descendantsAndSelf';

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    $state = $component->get('data.descendants');
    $rootKey = array_key_first($state);
    $root = $state[$rootKey];
    [$booksKey, $musicKey] = array_keys($root['children']);

    $music = $root['children'][$musicKey];
    unset($root['children'][$musicKey]);
    $music['children'] = [$rootKey => $root];

    $component->set('data.descendants', [$musicKey => $music])->call('save');

    expect($this->root->refresh()->parent_id)->toBeNull()
        ->and($this->music->refresh()->parent_id)->toBe($this->root->getKey());
});

it('shows the tree of a record in the widget once the widget declares its record', function () {
    Livewire::test(CategoryTreeWidget::class, ['record' => $this->root])
        ->assertSee(['Books', 'Fiction', 'Music']);
});

it('does not let a drag move a record the user may not reorder', function () {
    Gate::policy(Category::class, LockableCategoryPolicy::class);
    LockableCategoryPolicy::$lockedCategories = [$this->music->getKey()];

    $this->actingAs(new User);

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    [$books, $music] = array_keys($component->get('data.descendants'));
    $before = $component->get('data.descendants');

    $key = $component->instance()->form->getComponent(fn ($component): bool => $component instanceof AdjacencyList)->getKey();

    $component->call('callSchemaComponentMethod', $key, 'sort', [
        'targetStatePath' => "data.descendants.{$books}.children",
        'targetItemsStatePaths' => ["data.descendants.{$music}"],
    ]);

    expect($component->get('data.descendants'))->toBe($before);

    LockableCategoryPolicy::$lockedCategories = [];

    $component->call('callSchemaComponentMethod', $key, 'sort', [
        'targetStatePath' => "data.descendants.{$books}.children",
        'targetItemsStatePaths' => ["data.descendants.{$music}"],
    ]);

    expect(array_keys($component->get("data.descendants.{$books}.children")))->toContain($music);
});
