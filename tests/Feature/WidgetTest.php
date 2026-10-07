<?php

declare(strict_types=1);

use Filament\Actions\Testing\TestAction;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Saade\FilamentAdjacencyList\Widgets\AdjacencyListWidget;
use Tests\Fixtures\Models\Category;
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
    $this->games = $this->root->children()->create(['name' => 'Games', 'sort' => 3]);
});

function widgetList($component): AdjacencyList
{
    return $component->instance()->form->getComponent(fn ($component): bool => $component instanceof AdjacencyList);
}

function widgetKeys($component): array
{
    return array_keys($component->get('data.descendants'));
}

it('receives the record of the page it is on without declaring it', function () {
    $widget = new class extends AdjacencyListWidget
    {
        protected function adjacencyList(AdjacencyList $adjacencyList): AdjacencyList
        {
            return $adjacencyList->labelKey('name');
        }
    };

    Livewire::test($widget::class, ['record' => $this->root])
        ->assertSee(['Books', 'Music', 'Games']);
});

it('saves a new order as soon as items are dragged', function () {
    $component = Livewire::test(CategoryTreeWidget::class, ['record' => $this->root]);

    [$books, $music, $games] = widgetKeys($component);

    $component->call('callSchemaComponentMethod', widgetList($component)->getKey(), 'sort', [
        'targetStatePath' => 'data.descendants',
        'targetItemsStatePaths' => ["data.descendants.{$games}", "data.descendants.{$books}", "data.descendants.{$music}"],
    ]);

    expect(Category::where('parent_id', $this->root->getKey())->orderBy('sort')->pluck('name')->all())
        ->toBe(['Games', 'Books', 'Music']);
});

it('saves a new parent as soon as an item is dragged into another', function () {
    $component = Livewire::test(CategoryTreeWidget::class, ['record' => $this->root]);

    [$books, $music] = widgetKeys($component);

    $component->call('callSchemaComponentMethod', widgetList($component)->getKey(), 'sort', [
        'targetStatePath' => "data.descendants.{$books}.children",
        'targetItemsStatePaths' => ["data.descendants.{$music}"],
    ]);

    expect($this->music->refresh()->parent_id)->toBe($this->books->getKey())
        ->and($this->books->refresh()->parent_id)->toBe($this->root->getKey());
});

it('saves a move made with the buttons', function () {
    $component = Livewire::test(CategoryTreeWidget::class, ['record' => $this->root]);

    [, $music] = widgetKeys($component);

    $component->callAction(
        TestAction::make('indent')->schemaComponent('descendants')->arguments(['statePath' => "data.descendants.{$music}", 'cachedRecordKey' => $music]),
    );

    expect($this->music->refresh()->parent_id)->toBe($this->books->getKey());

    $component = Livewire::test(CategoryTreeWidget::class, ['record' => $this->root]);

    [, $games] = widgetKeys($component);

    $component->callAction(
        TestAction::make('moveUp')->schemaComponent('descendants')->arguments(['statePath' => "data.descendants.{$games}", 'cachedRecordKey' => $games]),
    );

    expect(Category::where('parent_id', $this->root->getKey())->orderBy('sort')->pluck('name')->all())
        ->toBe(['Games', 'Books']);
});
