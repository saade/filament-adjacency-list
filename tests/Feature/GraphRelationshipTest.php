<?php

declare(strict_types=1);

use Filament\Actions\Testing\TestAction;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Livewire\Livewire;
use Tests\Fixtures\Models\Node;
use Tests\Fixtures\Pages\EditNodePage;

beforeEach(function () {
    Schema::create('nodes', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->unsignedInteger('sort')->default(0);
        $table->timestamps();
    });

    Schema::create('edges', function (Blueprint $table) {
        $table->foreignId('parent_id')->constrained('nodes')->cascadeOnDelete();
        $table->foreignId('child_id')->constrained('nodes')->cascadeOnDelete();
        $table->unsignedInteger('sort')->default(0);
        $table->primary(['parent_id', 'child_id']);
    });

    $this->root = Node::create(['name' => 'Root']);
    $this->a = Node::create(['name' => 'A']);
    $this->b = Node::create(['name' => 'B']);
    $this->a1 = Node::create(['name' => 'A1']);

    $this->root->children()->attach([$this->a->getKey(), $this->b->getKey()]);
    $this->a->children()->attach($this->a1);
});

function edges(): array
{
    return DB::table('edges')
        ->join('nodes as parents', 'parents.id', '=', 'edges.parent_id')
        ->join('nodes as children', 'children.id', '=', 'edges.child_id')
        ->orderBy('parents.name')
        ->orderBy('children.name')
        ->get(['parents.name as parent', 'children.name as child'])
        ->map(fn (object $edge): string => "{$edge->parent} > {$edge->child}")
        ->all();
}

function graphNames(array $items): array
{
    return collect($items)
        ->map(fn (array $item): array => [$item['name'] => graphNames($item['children'])])
        ->values()
        ->all();
}

function graphItem($component, string $name, ?array $items = null, string $path = 'data.descendants'): array
{
    foreach ($items ?? $component->get('data.descendants') as $key => $item) {
        if ($item['name'] === $name) {
            return ['statePath' => "{$path}.{$key}", 'cachedRecordKey' => $key];
        }

        if ($found = graphItem($component, $name, $item['children'], "{$path}.{$key}.children")) {
            return $found;
        }
    }

    return [];
}

afterEach(function () {
    EditNodePage::$isOrdered = false;
});

it('loads a graph as a tree', function () {
    $component = Livewire::test(EditNodePage::class, ['record' => $this->root]);

    expect(graphNames($component->get('data.descendants')))->toBe([
        ['A' => [['A1' => []]]],
        ['B' => []],
    ]);
});

it('adds an item under the record', function () {
    Livewire::test(EditNodePage::class, ['record' => $this->root])
        ->callAction(TestAction::make('add')->schemaComponent('descendants'), ['name' => 'C']);

    expect(edges())->toBe(['A > A1', 'Root > A', 'Root > B', 'Root > C']);
});

it('adds a child without detaching the other children of its parent', function () {
    $component = Livewire::test(EditNodePage::class, ['record' => $this->root]);

    $component->callAction(
        TestAction::make('addChild')->schemaComponent('descendants')->arguments(graphItem($component, 'A')),
        ['name' => 'A2'],
    );

    expect(edges())->toBe(['A > A1', 'A > A2', 'Root > A', 'Root > B']);
});

it('saves the form without changing a graph that was not touched', function () {
    Livewire::test(EditNodePage::class, ['record' => $this->root])->call('save');

    expect(edges())->toBe(['A > A1', 'Root > A', 'Root > B']);
});

it('saves a new parent, and empties the old one', function () {
    $component = Livewire::test(EditNodePage::class, ['record' => $this->root]);

    $state = $component->get('data.descendants');
    [$a, $b] = array_keys($state);
    $a1 = array_key_first($state[$a]['children']);

    $state[$b]['children'] = [$a1 => $state[$a]['children'][$a1]];
    $state[$a]['children'] = [];

    $component->set('data.descendants', $state)->call('save');

    expect(edges())->toBe(['B > A1', 'Root > A', 'Root > B']);
});

it('saves an item moved to the top level, and one moved away from it', function () {
    $component = Livewire::test(EditNodePage::class, ['record' => $this->root]);

    $state = $component->get('data.descendants');
    [$a, $b] = array_keys($state);
    $a1 = array_key_first($state[$a]['children']);

    $component->set('data.descendants', [
        $a => [...$state[$a], 'children' => [$b => $state[$b]]],
        $a1 => $state[$a]['children'][$a1],
    ])->call('save');

    expect(edges())->toBe(['A > B', 'Root > A', 'Root > A1']);
});

it('keeps the order of the children of each parent on the pivot', function () {
    EditNodePage::$isOrdered = true;

    $c = Node::create(['name' => 'C']);
    $this->root->children()->attach($c);

    $component = Livewire::test(EditNodePage::class, ['record' => $this->root]);

    $state = $component->get('data.descendants');
    $keys = collect($state)->mapWithKeys(fn (array $item, string $key): array => [$item['name'] => $key]);

    $component->set('data.descendants', [
        $keys['C'] => $state[$keys['C']],
        $keys['A'] => $state[$keys['A']],
        $keys['B'] => $state[$keys['B']],
    ])->call('save');

    expect(DB::table('edges')->where('parent_id', $this->root->getKey())->orderBy('sort')->pluck('child_id')->all())
        ->toBe([$c->getKey(), $this->a->getKey(), $this->b->getKey()]);

    $component = Livewire::test(EditNodePage::class, ['record' => $this->root]);

    expect(array_column($component->get('data.descendants'), 'name'))->toBe(['C', 'A', 'B']);
});
