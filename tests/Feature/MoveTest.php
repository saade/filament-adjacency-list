<?php

declare(strict_types=1);

use Filament\Actions\Testing\TestAction;
use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Pages\AdjacencyListPage;

afterEach(function () {
    AdjacencyListPage::$configure = null;
});

function moveAction(string $name, string $path): TestAction
{
    return TestAction::make($name)->schemaComponent('items')->arguments([
        'statePath' => $path,
        'cachedRecordKey' => str($path)->afterLast('.')->toString(),
    ]);
}

function siblings(int $count): array
{
    return collect(range(1, $count))
        ->mapWithKeys(fn (int $number): array => ["item-{$number}" => ['label' => "Item {$number}", 'children' => []]])
        ->all();
}

it('moves an item one place up or down, however long the list is', function (int $count) {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', siblings($count));

    $keys = array_keys(siblings($count));
    $position = intdiv($count, 2);
    $key = $keys[$position];

    $component->callAction(moveAction('moveUp', "data.items.{$key}"));

    $expected = $keys;
    [$expected[$position - 1], $expected[$position]] = [$expected[$position], $expected[$position - 1]];

    expect(array_keys($component->get('data.items')))->toBe($expected);

    $component->callAction(moveAction('moveDown', "data.items.{$key}"));

    expect(array_keys($component->get('data.items')))->toBe($keys);
})->with([3, 16, 17, 50, 200]);

it('leaves the first item where it is when it is moved up, and the last when it is moved down', function () {
    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', siblings(3));

    $component
        ->callAction(moveAction('moveUp', 'data.items.item-1'))
        ->callAction(moveAction('moveDown', 'data.items.item-3'));

    expect(array_keys($component->get('data.items')))->toBe(['item-1', 'item-2', 'item-3']);
});

it('indents and outdents with a children key of its own', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->childrenKey('items');

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', [
        'a' => ['label' => 'A', 'items' => [
            'a1' => ['label' => 'A1', 'items' => [
                'a1x' => ['label' => 'A1X', 'items' => []],
            ]],
        ]],
        'b' => ['label' => 'B', 'items' => []],
    ]);

    $component->callAction(moveAction('indent', 'data.items.b'));

    expect($component->get('data.items'))->toBe([
        'a' => ['label' => 'A', 'items' => [
            'a1' => ['label' => 'A1', 'items' => [
                'a1x' => ['label' => 'A1X', 'items' => []],
            ]],
            'b' => ['label' => 'B', 'items' => []],
        ]],
    ]);

    $component->callAction(moveAction('dedent', 'data.items.a.items.a1.items.a1x'));

    expect(array_keys($component->get('data.items.a.items')))->toBe(['a1', 'b', 'a1x'])
        ->and($component->get('data.items.a.items.a1.items'))->toBe([]);

    $component->callAction(moveAction('dedent', 'data.items.a.items.b'));

    expect(array_keys($component->get('data.items')))->toBe(['a', 'b']);
});

it('does nothing when the first item of a list is indented, or a top-level item is outdented', function () {
    $tree = [
        'a' => ['label' => 'A', 'children' => ['a1' => ['label' => 'A1', 'children' => []]]],
        'b' => ['label' => 'B', 'children' => []],
    ];

    $component = Livewire::test(AdjacencyListPage::class)->set('data.items', $tree);

    $component->instance()->mountAction('indent', ['statePath' => 'data.items.a', 'cachedRecordKey' => 'a'], ['schemaComponent' => 'form.items']);
    $component->instance()->mountAction('indent', ['statePath' => 'data.items.a.children.a1', 'cachedRecordKey' => 'a1'], ['schemaComponent' => 'form.items']);
    $component->instance()->mountAction('dedent', ['statePath' => 'data.items.b', 'cachedRecordKey' => 'b'], ['schemaComponent' => 'form.items']);

    expect($component->get('data.items'))->toBe($tree);
});
