<?php

namespace Saade\FilamentAdjacencyList\Forms\Components\Actions;

use Filament\Actions\Action as BaseAction;
use Filament\Actions\Concerns\CanCustomizeProcess;

abstract class Action extends BaseAction
{
    use CanCustomizeProcess;
}
