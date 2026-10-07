<?php

declare(strict_types=1);

use Filament\Actions\Action;
use Filament\Actions\Testing\TestAction;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Models\Category;
use Tests\Fixtures\Pages\EditCategoryPage;

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
});

afterEach(function () {
    EditCategoryPage::$configureBeforeRelationship = null;
    EditCategoryPage::$configureAfterRelationship = null;
});

function customizeEveryAction(AdjacencyList $list): AdjacencyList
{
    return $list
        ->addAction(fn (Action $action): Action => $action->label('New category'))
        ->addChildAction(fn (Action $action): Action => $action->label('New subcategory'))
        ->editAction(fn (Action $action): Action => $action->label('Rename'))
        ->deleteAction(fn (Action $action): Action => $action->label('Remove'));
}

function itemArguments($component, int $position = 0): array
{
    $key = array_keys($component->get('data.descendants'))[$position];

    return ['statePath' => "data.descendants.{$key}", 'cachedRecordKey' => $key];
}

dataset('where the actions are customized', [
    'before relationship()' => ['configureBeforeRelationship'],
    'after relationship()' => ['configureAfterRelationship'],
]);

it('keeps a customization of the actions', function (string $moment) {
    EditCategoryPage::${$moment} = customizeEveryAction(...);

    $list = Livewire::test(EditCategoryPage::class, ['record' => $this->root])
        ->instance()
        ->form
        ->getComponent(fn ($component): bool => $component instanceof AdjacencyList);

    expect($list->getAddAction()->getLabel())->toBe('New category')
        ->and($list->getAddChildAction()->getLabel())->toBe('New subcategory')
        ->and($list->getEditAction()->getLabel())->toBe('Rename')
        ->and($list->getDeleteAction()->getLabel())->toBe('Remove');
})->with('where the actions are customized');

it('still saves a new item to the database when the actions are customized', function (string $moment) {
    EditCategoryPage::${$moment} = customizeEveryAction(...);

    Livewire::test(EditCategoryPage::class, ['record' => $this->root])
        ->callAction(TestAction::make('add')->schemaComponent('descendants'), ['name' => 'Music']);

    expect(Category::where('name', 'Music')->value('parent_id'))->toBe($this->root->getKey());
})->with('where the actions are customized');

it('still saves a new child, an edit and a deletion when the actions are customized', function (string $moment) {
    EditCategoryPage::${$moment} = customizeEveryAction(...);

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    $component->callAction(
        TestAction::make('addChild')->schemaComponent('descendants')->arguments(itemArguments($component)),
        ['name' => 'Fiction'],
    );

    expect(Category::where('name', 'Fiction')->value('parent_id'))->toBe($this->books->getKey());

    $component->callAction(
        TestAction::make('edit')->schemaComponent('descendants')->arguments(itemArguments($component)),
        ['name' => 'Novels'],
    );

    expect($this->books->refresh()->name)->toBe('Novels');

    Category::where('name', 'Fiction')->delete();

    $component = Livewire::test(EditCategoryPage::class, ['record' => $this->root]);

    $component->callAction(
        TestAction::make('delete')->schemaComponent('descendants')->arguments(itemArguments($component)),
    );

    expect(Category::whereKey($this->books->getKey())->exists())->toBeFalse();
})->with('where the actions are customized');
