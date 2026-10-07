<?php

declare(strict_types=1);

use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Pages\AdjacencyListPage;

function sortableTree(): array
{
    return [
        'a' => ['label' => 'A', 'children' => [
            'a1' => ['label' => 'A1', 'children' => []],
            'a2' => ['label' => 'A2', 'children' => []],
        ]],
        'b' => ['label' => 'B', 'children' => []],
        'c' => ['label' => 'C', 'children' => []],
    ];
}

function sortItems($component, string $target, array $items)
{
    $key = $component->instance()->form->getComponent(fn ($component): bool => $component instanceof AdjacencyList)->getKey();

    return $component->call('callSchemaComponentMethod', $key, 'sort', [
        'targetStatePath' => $target,
        'targetItemsStatePaths' => $items,
    ]);
}

function labels(array $items): array
{
    return collect($items)->map(fn (array $item): array => [$item['label'] => labels($item['children'])])->values()->all();
}

it('moves an item to another level in one step, without leaving a copy behind', function () {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', sortableTree());

    sortItems($component, 'data.items.b.children', ['data.items.c']);

    expect(labels($component->get('data.items')))->toBe([
        ['A' => [['A1' => []], ['A2' => []]]],
        ['B' => [['C' => []]]],
    ]);
});

it('finds an item that has moved since the page was rendered', function () {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', sortableTree());

    sortItems($component, 'data.items.b.children', ['data.items.c']);
    sortItems($component, 'data.items.b.children', ['data.items.c', 'data.items.a.children.a2']);
    sortItems($component, 'data.items.a.children', ['data.items.a.children.a1']);

    expect(labels($component->get('data.items')))->toBe([
        ['A' => [['A1' => []]]],
        ['B' => [['C' => []], ['A2' => []]]],
    ]);
});

it('keeps the items of a list that a sort does not mention', function () {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', sortableTree());

    sortItems($component, 'data.items', ['data.items.c']);

    expect(labels($component->get('data.items')))->toBe([
        ['C' => []],
        ['A' => [['A1' => []], ['A2' => []]]],
        ['B' => []],
    ]);
});

it('ignores items and lists it does not know', function () {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', sortableTree());

    sortItems($component, 'data.items', ['data.items.c', 'data.items.nope', 'data.items.a', 'data.items.b']);
    sortItems($component, 'data.items.nope.children', ['data.items.a']);

    expect(labels($component->get('data.items')))->toBe([
        ['C' => []],
        ['A' => [['A1' => []], ['A2' => []]]],
        ['B' => []],
    ]);
});
