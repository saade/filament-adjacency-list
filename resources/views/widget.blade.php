@php
    $isContained = $this->isContained();
@endphp

<x-filament-widgets::widget>
    <x-filament::section :contained="$isContained">
        <form wire:submit="create">
            {{ $this->form }}
        </form>

        <x-filament-actions::modals />
    </x-filament::section>
</x-filament-widgets::widget>
