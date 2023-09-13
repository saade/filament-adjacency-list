@props(['actions', 'addable', 'childrenKey', 'deletable', 'disabled', 'editable', 'item', 'itemStatePath', 'labelKey', 'reorderable', 'statePath'])

<div
    class="space-y-2"
    data-id="{{ $itemStatePath }}"
    data-sortable-item
    x-data="{ open: $persist(true) }"
    wire:key="{{ $itemStatePath }}"
>
    @php
        [$addChildAction, $deleteAction, $editAction, $reorderAction] = $actions;

        $hasChildren = count($item[$childrenKey]) > 0;
    @endphp

    <div class="relative group">
        <div @class([
            'bg-white rounded-lg border border-gray-300 w-full flex justify-between',
            'dark:bg-gray-900 dark:border-white/10',
        ])>
            <div class="flex w-full">
                @if($reorderable)
                    <div @class([
                        'flex items-center bg-gray-50 rounded-l-lg rtl:rounded-r-lg border-r rtl:border-r-0 rtl:border-l border-gray-300 px-1',
                        'dark:bg-gray-800 dark:border-white/10',
                    ])>
                        {{ ($reorderAction)(['statePath' => $itemStatePath]) }}
                    </div>
                @endif

                @if ($hasChildren)
                    <button
                        class="px-2 text-gray-500 appearance-none"
                        type="button"
                        title="{{ __('filament-adjacency-list::adjacency-list.actions.toggle-children.label') }}"
                        x-on:click="open = !open"
                    >
                        @svg('heroicon-o-chevron-right', 'w-3.5 h-3.5 transition ease-in-out duration-200 rtl:rotate-180', ['x-bind:class' => "{'ltr:rotate-90 rtl:!rotate-90': open}"])
                    </button>
                @endif

                <button
                    @class([
                        'w-full py-2 text-left rtl:text-right appearance-none',
                        'px-4' => !$hasChildren,
                        'cursor-default' => $disabled || !$editable,
                    ])
                    type="button"
                    @if($editable) wire:click="mountFormComponentAction(@js($statePath), 'edit', @js(['statePath' => $itemStatePath]))" @endif
                >
                    <span>{{ $item[$labelKey] }}</span>
                </button>
            </div>

            <div class="items-center flex-shrink-0 hidden px-2 space-x-2 rtl:space-x-reverse group-hover:flex">
                @if($addable) {{ $addChildAction(['statePath' => $itemStatePath]) }} @endif
                @if($editable) {{ $editAction(['statePath' => $itemStatePath]) }} @endif
                @if($deletable) {{ $deleteAction(['statePath' => $itemStatePath]) }} @endif
            </div>
        </div>
    </div>

    <div
        class="ltr:ml-6 rtl:mr-6"
        x-show="open"
        x-collapse
    >
        <div
            class="space-y-2"
            wire:key="{{ $itemStatePath }}-children"
            x-data="tree({
                statePath: @js($itemStatePath . ".$childrenKey"),
                disabled: @js($disabled),
                maxDepth: @js($maxDepth)
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
                    :max-depth="$maxDepth"
                />
            @endforeach
        </div>
    </div>
</div>
