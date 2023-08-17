@props(['actions', 'addable', 'childrenKey', 'deletable', 'disabled', 'editable', 'item', 'itemStatePath', 'labelKey', 'reorderable', 'statePath'])

<div
    class="space-y-2"
    data-id="{{ $itemStatePath }}"
    data-sortable-item
    x-data="{ open: $persist(true) }"
    wire:key="{{ $itemStatePath }}"
>
    @php
        [$addChildAction, $deleteAction, $editAction] = $actions;

        $hasChildren = count($item[$childrenKey]) > 0;
    @endphp

    <div class="relative group">
        <div @class([
            'bg-white rounded-lg border border-gray-300 w-full flex justify-between',
            'dark:bg-gray-700 dark:border-gray-600',
        ])>
            <div class="flex w-full">
                @if($reorderable)
                    <button
                        data-sortable-handle
                        type="button"
                        title="{{ __('filament-adjacency-list::adjacency-list.actions.reorder.label') }}"
                        @class([
                            'flex items-center bg-gray-50 rounded-l-lg border-r border-gray-300 px-1',
                            'dark:bg-gray-800 dark:border-gray-600',
                        ])
                    >
                        @svg('heroicon-o-ellipsis-vertical', 'text-gray-400 w-4 h-4 -mr-2')
                        @svg('heroicon-o-ellipsis-vertical', 'text-gray-400 w-4 h-4')
                    </button>
                @endif

                @if ($hasChildren)
                    <button
                        class="px-2 text-gray-500 appearance-none"
                        type="button"
                        title="{{ __('filament-adjacency-list::adjacency-list.actions.toggle-children.label') }}"
                        x-on:click="open = !open"
                    >
                        <x-heroicon-o-chevron-right class="w-3.5 h-3.5 transition ease-in-out duration-200" x-bind:class="{'rotate-90': open}" />
                    </button>
                @endif

                <button
                    @class([
                        'w-full py-2 text-left appearance-none',
                        'px-4' => !$hasChildren,
                        'cursor-default' => $disabled || !$editable,
                    ])
                    type="button"
                    @if($editable) wire:click="mountFormComponentAction(@js($statePath), 'edit', @js(['statePath' => $itemStatePath]))" @endif
                >
                    <span>{{ $item[$labelKey] }}</span>
                </button>
            </div>

            <div class="items-center flex-shrink-0 hidden px-2 space-x-2 group-hover:flex">
                @if($addable) {{ $addChildAction(['statePath' => $itemStatePath]) }} @endif
                @if($editable) {{ $editAction(['statePath' => $itemStatePath]) }} @endif
                @if($deletable) {{ $deleteAction(['statePath' => $itemStatePath]) }} @endif
            </div>
        </div>
    </div>

    <div
        class="ml-6"
        x-show="open"
        x-collapse
    >
        <div
            class="space-y-2"
            wire:key="{{ $itemStatePath }}-children"
            x-data="tree({
                statePath: @js($itemStatePath . ".$childrenKey"),
                disabled: @js($disabled)
            })"
        >
            @foreach ($item[$childrenKey] as $uuid => $child)
                <x-filament-adjacency-list::item
                    :actions="$actions"
                    :addable="$addable"
                    :children-key="$childrenKey"
                    :deletable="$deletable"
                    :disabled="$disabled"
                    :editable="$editable"
                    :item="$child"
                    :item-state-path="$itemStatePath . '.' . $childrenKey . '.' . $uuid"
                    :label-key="$labelKey"
                    :reorderable="$reorderable"
                    :state-path="$statePath"
                />
            @endforeach
        </div>
    </div>
</div>