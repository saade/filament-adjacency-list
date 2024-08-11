<?php

namespace Saade\FilamentAdjacencyList;

use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Assets\Asset;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentAdjacencyListServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-adjacency-list';

    public static string $viewNamespace = 'filament-adjacency-list';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name);

        if (file_exists($package->basePath('/../resources/lang'))) {
            $package->hasTranslations();
        }

        if (file_exists($package->basePath('/../resources/views'))) {
            $package->hasViews(static::$viewNamespace);
        }
    }

    public function packageRegistered(): void
    {
    }

    public function packageBooted(): void
    {
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );
    }

    protected function getAssetPackageName(): ?string
    {
        return 'saade/filament-adjacency-list';
    }

    /**
     * @return array<Asset>
     */
    protected function getAssets(): array
    {
        return [
            AlpineComponent::make('filament-adjacency-list', __DIR__ . '/../resources/dist/filament-adjacency-list.js'),
            Css::make('filament-adjacency-list-styles', __DIR__ . '/../resources/dist/filament-adjacency-list.css'),
        ];
    }
}
