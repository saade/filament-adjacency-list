<?php

declare(strict_types=1);

use Filament\Actions\Testing\TestAction;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Livewire\Livewire;
use Tests\Fixtures\Models\Category;
use Tests\Fixtures\Pages\CreateCategoryPage;

beforeEach(function () {
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();
        $table->string('name');
        $table->unsignedInteger('sort')->default(0);
        $table->timestamps();
    });
});

afterEach(function () {
    CreateCategoryPage::$model = Category::class;
});

it('does not offer to add items before the record is saved', function () {
    Category::create(['name' => 'Unrelated']);

    Livewire::test(CreateCategoryPage::class)
        ->assertOk()
        ->assertSet('data.descendants', [])
        ->assertActionHidden(TestAction::make('add')->schemaComponent('descendants'));

    expect(Category::count())->toBe(1);
});

it('creates the record without touching other rows', function () {
    $unrelated = Category::create(['name' => 'Unrelated']);

    Livewire::test(CreateCategoryPage::class)
        ->set('data.name', 'Catalog')
        ->call('create')
        ->assertHasNoErrors();

    expect(Category::pluck('parent_id', 'name')->all())->toBe(['Unrelated' => null, 'Catalog' => null])
        ->and($unrelated->refresh()->sort)->toBe(0);
});

it('renders an empty tree when the form has no model', function () {
    CreateCategoryPage::$model = null;

    Livewire::test(CreateCategoryPage::class)
        ->assertOk()
        ->assertSet('data.descendants', [])
        ->assertActionHidden(TestAction::make('add')->schemaComponent('descendants'));
});
