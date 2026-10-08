<?php

declare(strict_types=1);

use Illuminate\Support\Arr;
use Livewire\Livewire;
use Tests\Fixtures\Pages\AdjacencyListPage;

function translationKeys(string $locale): array
{
    $keys = array_keys(Arr::dot(require __DIR__ . "/../../resources/lang/{$locale}/adjacency-list.php"));

    sort($keys);

    return $keys;
}

it('translates every key to Brazilian Portuguese', function () {
    expect(translationKeys('pt_BR'))->toBe(translationKeys('en'));
});

it('falls back to English for a key a locale does not have', function () {
    app()->setLocale('fr');

    expect(__('filament-adjacency-list::adjacency-list.actions.indent.label'))->toBe('Indent');
});

it('shows an item that has no label', function () {
    Livewire::test(AdjacencyListPage::class)
        ->set('data.items', ['home' => ['children' => []]])
        ->assertOk()
        ->assertSee(__('filament-adjacency-list::adjacency-list.items.untitled'));
});
