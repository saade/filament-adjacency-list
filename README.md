# Filament Adjacency List

[![Latest Version on Packagist](https://img.shields.io/packagist/v/saade/filament-adjacency-list.svg?style=flat-square)](https://packagist.org/packages/saade/filament-adjacency-list)
[![Total Downloads](https://img.shields.io/packagist/dt/saade/filament-adjacency-list.svg?style=flat-square)](https://packagist.org/packages/saade/filament-adjacency-list)

A Filament package to manage adjacency lists (aka trees).

<p align="center">
    <img src="https://raw.githubusercontent.com/saade/filament-adjacency-list/3.x/art/cover.png" alt="Banner" style="width: 100%; max-width: 800px;" />
</p>

## Installation

You can install the package via composer:

```bash
composer require saade/filament-adjacency-list
```

## Usage

```php
use Saade\FilamentAdjacencyList\Forms\Components\AdjacencyList;

AdjacencyList::make('subjects')
    ->form([
        Forms\Components\TextInput::make('label')
            ->required(),
    ])
```

## Configuration
### Customizing the `label` key used to display the item's label
```php
AdjacencyList::make('subjects')
    ->labelKey('name')          // defaults to 'label'
```

### Customizing the `children` key used to gather the item's children.
> **Note:** This is only used when not using relationships.
```php
AdjacencyList::make('subjects')
    ->childrenKey('children')   // defaults to 'children'
```

### Customizing the `MaxDepth` of the tree.
```php
AdjacencyList::make('subjects')
    ->maxDepth(2)               // defaults to -1 (unlimited depth)
```

### Customizing the `MaxDepth` of the tree.
```php
AdjacencyList::make('subjects')
    ->maxDepth(2)               // defaults to -1 (unlimited depth)
```

### Creating items without a modal.
```php
AdjacencyList::make('subjects')
    ->modal(false)      // defaults to true
```

### Disabling creation, edition, deletion, and reordering.
```php
AdjacencyList::make('subjects')
    ->addable(false)
    ->editable(false)
    ->deletable(false)
    ->reorderable(false)
```

### Customizing actions
```php
use Filament\Forms\Actions\Action;

AdjacencyList::make('subjects')
    ->addAction(fn (Action $action): Action => $action->icon('heroicon-o-plus')->color('primary'))
    ->addChildAction(fn (Action $action): Action => $action->button())
    ->editAction(fn (Action $action): Action => $action->icon('heroicon-o-pencil'))
    ->deleteAction(fn (Action $action): Action => $action->requiresConfirmation())
    ->reorderAction(fn (Action $action): Action => $action->icon('heroicon-o-arrow-path-rounded-square'))
```

## Relationships
In this example, we'll be creating a Ticketing system, where tickets can be assigned to a department, and departments have subjects.

### Building the relationship
```php
// App/Models/Department.php

class Department extends Model
{
    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class)->whereNull('parent_id')->with('children')->orderBy('sort');
    }
}
```

```php
// App/Models/Subject.php

class Subject extends Model
{
    protected $fillable ['parent_id', 'name', 'sort']; // or whatever your columns are

    public function children(): HasMany
    {
        return $this->hasMany(Subject::class, 'parent_id')->with('children')->orderBy('sort');
    }
}
```

Now you've created a nested relationship between departments and subjects.

### Using the relationship
```php
// App/Filament/Resources/DepartmentResource.php

AdjacencyList::make('subjects')
    ->relationship('subjects')          // Define the relationship
    ->labelKey('name')                  // Customize the label key to your model's column
    ->childrenKey('children')           // Customize the children key to the relationship's method name
    ->form([                            // Define the form
        Forms\Components\TextInput::make('name')
            ->label(__('Name'))
            ->required(),
    ]);
```

That's it! Now you're able to manage your adjacency lists using relationships.

### Working with Staudenmeir's Laravel Adjacency List
This package also supports [Staudenmeir's Laravel Adjacency List](https://github.com/staudenmeir/laravel-adjacency-list) package.

First, install the package:
```bash
composer require staudenmeir/laravel-adjacency-list:"^1.0"
```

1. Use the `HasRecursiveRelationships` trait in your model, and override the default path separator.

```php
// App/Models/Department.php

class Department extends Model
{
    use \Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

    public function getPathSeparator()
    {
        return '.children.';
    }
}
```

If you're already using the HasRecursiveRelationships trait for other parts of your application, it's probably not a good idea to change your model's path separator, since it can break other parts of your application. Instead, you can add as many path separators as you want:

```php
class Department extends Model
{
    use \Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

    public function getCustomPaths()
    {
        return [
            [
                'name' => 'tree_path',
                'column' => 'id',
                'separator' => '.children.',
            ],
        ];
    }
}
```

2. Use the `relationship` method to define the relationship:

```php
AdjacencyList::make('subdepartments')
    ->relationship('descendants')   // or 'descendantsAndSelf', 'children' ...
    ->customPath('tree_path')       // if you're using custom paths
```

That's it! Now you're able to manage your adjacency lists using relationships.

### Customizing the query
```php
AdjacencyList::make('subdepartments')
    ->relationship('descendants', fn (Builder $query): Builder => $query->where('enabled', 1))
```

### Ordering
If your application needs to order the items in the list, you can use the `orderColumn` method:

```php
AdjacencyList::make('subdepartments')
    ->orderColumn('sort')   // or any other column
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Saade](https://github.com/saade)
- [Ryan Chandler's Navigation Plugin](https://github.com/ryangjchandler/filament-navigation) for the inspiration.
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

<p align="center">
    <a href="https://github.com/sponsors/saade">
        <img src="https://raw.githubusercontent.com/saade/filament-adjacency-list/3.x/art/sponsor.png" alt="Sponsor Saade" style="width: 100%; max-width: 800px;" />
    </a>
</p>
