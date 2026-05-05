<?php

declare(strict_types=1);

use Tests\Fixtures\Pages\AdjacencyListPage;

use function Pest\Livewire\livewire;

it('renders the adjacency list form component', function (): void {
    livewire(AdjacencyListPage::class)
        ->assertOk()
        ->assertFormFieldExists('items');
});

it('mounts with an empty items list', function (): void {
    livewire(AdjacencyListPage::class)
        ->assertOk()
        ->assertFormSet(['items' => []]);
});

it('can fill the form with a flat list of items', function (): void {
    $items = [
        'aaa' => ['label' => 'Home', 'children' => []],
        'bbb' => ['label' => 'About', 'children' => []],
    ];

    livewire(AdjacencyListPage::class)
        ->fillForm(['items' => $items])
        ->assertFormSet(['items' => $items]);
});

it('can fill the form with nested items', function (): void {
    $items = [
        'aaa' => [
            'label' => 'Parent',
            'children' => [
                'bbb' => ['label' => 'Child', 'children' => []],
            ],
        ],
    ];

    livewire(AdjacencyListPage::class)
        ->fillForm(['items' => $items])
        ->assertFormSet(['items' => $items]);
});
