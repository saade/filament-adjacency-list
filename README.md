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
### Customizing the `label` and `children` keys.
```php
AdjacencyList::make('subjects')
    ->labelKey('name')          // defaults to 'label'
    ->childrenKey('subitems')   // defaults to 'children'
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
> [!IMPORTANT]
> **Reorder Action**
> 
> If you want to add `->extraAttributes()` to the action, you need to add the `['data-sortable-handle' => 'true']` attribute to the array.
> 
> if you want to trigger a livewire action on click, you need to chain `->livewireClickHandlerEnabled()` on the action.

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
