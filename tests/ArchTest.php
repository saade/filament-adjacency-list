<?php

declare(strict_types=1);

arch('no debugging functions in source')
    ->expect('Saade\FilamentAdjacencyList')
    ->not->toUse(['dd', 'dump', 'ray', 'var_dump']);
