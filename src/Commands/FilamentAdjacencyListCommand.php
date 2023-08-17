<?php

namespace Saade\FilamentAdjacencyList\Commands;

use Illuminate\Console\Command;

class FilamentAdjacencyListCommand extends Command
{
    public $signature = 'filament-adjacency-list';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
