<?php

namespace Saade\FilamentAdjacencyList\Enums;

enum ChildrenOnDelete
{
    case Cascade;

    case MoveUp;

    case SetNull;

    case Restrict;
}
