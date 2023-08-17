<?php

namespace Saade\FilamentAdjacencyList\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Saade\FilamentAdjacencyList\FilamentAdjacencyList
 */
class FilamentAdjacencyList extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \Saade\FilamentAdjacencyList\FilamentAdjacencyList::class;
    }
}
