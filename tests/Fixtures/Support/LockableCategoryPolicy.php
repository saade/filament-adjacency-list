<?php

declare(strict_types=1);

namespace Tests\Fixtures\Support;

use Illuminate\Foundation\Auth\User;
use Tests\Fixtures\Models\Category;

/**
 * Not named CategoryPolicy, so Laravel does not discover it for every test.
 */
class LockableCategoryPolicy
{
    /**
     * @var array<int>
     */
    public static array $lockedCategories = [];

    public function reorder(User $user, Category $category): bool
    {
        return ! in_array($category->getKey(), static::$lockedCategories);
    }
}
