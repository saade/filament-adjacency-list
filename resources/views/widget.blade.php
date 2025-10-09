<x-filament-widgets::widget>
    <form wire:submit="create">
        {{ $this->form }}
    </form>

    <x-filament-actions::modals />
</x-filament-widgets::widget>
