<?php

declare(strict_types=1);

use Livewire\Livewire;
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;
use Tests\Fixtures\Pages\AdjacencyListPage;

afterEach(function () {
    AdjacencyListPage::$configure = null;
});

function collapsibleTree(): array
{
    return [
        'products' => ['label' => 'Products', 'children' => [
            'books' => ['label' => 'Books', 'children' => []],
        ]],
    ];
}

it('remembers which items are collapsed when asked to', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->collapsible()->persistCollapsed();

    Livewire::test(AdjacencyListPage::class)
        ->set('data.items', collapsibleTree())
        ->assertSeeHtml('$persist(false).as(\'adjacency-list-data.items-products-isCollapsed\')')
        ->assertSeeHtml('adjacency-list-data.items-books-isCollapsed');
});

it('does not remember collapsed items by default', function () {
    AdjacencyListPage::$configure = fn (AdjacencyList $list) => $list->collapsible();

    Livewire::test(AdjacencyListPage::class)
        ->set('data.items', collapsibleTree())
        ->assertSeeHtml('isCollapsed:')
        ->assertDontSeeHtml('$persist(');
});
