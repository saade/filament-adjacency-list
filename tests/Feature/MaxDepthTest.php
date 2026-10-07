<?php

declare(strict_types=1);

use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Pages\AdjacencyListPage;

afterEach(function () {
    AdjacencyListPage::$configure = null;
});

function deepTree(string $childrenKey = 'children'): array
{
    return [
        'a' => ['label' => 'A', $childrenKey => [
            'a1' => ['label' => 'A1', $childrenKey => []],
        ]],
        'b' => ['label' => 'B', $childrenKey => []],
        'c' => ['label' => 'C', $childrenKey => []],
    ];
}

function dragInto($component, string $target, array $items)
{
    $key = $component->instance()->form->getComponent(fn ($component): bool => $component instanceof AdjacencyList)->getKey();

    return $component->call('callSchemaComponentMethod', $key, 'sort', [
        'targetStatePath' => $target,
        'targetItemsStatePaths' => $items,
    ]);
}

it('refuses a drag that would push the children of the dragged item past the limit', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->maxDepth(1);

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', deepTree());

    dragInto($component, 'data.items.b.children', ['data.items.a']);

    expect($component->get('data.items'))->toBe(deepTree());

    dragInto($component, 'data.items.b.children', ['data.items.c']);

    expect(array_keys($component->get('data.items.b.children')))->toBe(['c']);
});

it('refuses a drag below the limit', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->maxDepth(1);

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', deepTree());

    dragInto($component, 'data.items.a.children.a1.children', ['data.items.c']);

    expect($component->get('data.items'))->toBe(deepTree());
});

it('refuses to indent an item whose children would end up past the limit', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->maxDepth(1);

    $tree = [
        'b' => ['label' => 'B', 'children' => []],
        'a' => ['label' => 'A', 'children' => ['a1' => ['label' => 'A1', 'children' => []]]],
    ];

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', $tree);

    $component->instance()->mountAction('indent', ['statePath' => 'data.items.a', 'cachedRecordKey' => 'a'], ['schemaComponent' => 'form.items']);

    expect($component->get('data.items'))->toBe($tree);
});

it('has no limit unless one is set', function () {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', deepTree());

    dragInto($component, 'data.items.a.children.a1.children', ['data.items.b']);
    dragInto($component, 'data.items.a.children.a1.children.b.children', ['data.items.c']);

    expect(array_keys($component->get('data.items.a.children.a1.children.b.children')))->toBe(['c']);
});

it('counts the depth of an item from the tree, whatever the field and the children key are called', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->childrenKey('items')->maxDepth(1);

    $limited = Livewire::test(AdjacencyListPage::class)->set('data.items', deepTree('items'))->html();

    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->childrenKey('items');

    $unlimited = Livewire::test(AdjacencyListPage::class)->set('data.items', deepTree('items'))->html();

    // Four items, of which the three at the top level can still take a child.
    expect(substr_count($limited, 'Add child'))->toBe(substr_count($unlimited, 'Add child') / 4 * 3);
});
