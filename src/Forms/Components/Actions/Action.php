<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Actions\Concerns\CanCustomizeProcess;
use Filament\Forms\Components\Actions\Action as BaseAction;

abstract class Action extends BaseAction
{
    use CanCustomizeProcess;
}
