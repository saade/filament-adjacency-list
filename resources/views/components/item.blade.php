@props(['uuid', 'treeId', 'actions', 'addable', 'childrenKey', 'deletable', 'disabled', 'editable', 'startCollapsed', 'item', 'itemStatePath', 'labelKey', 'reorderable', 'statePath'])

<div
    {{-- hover:bg-gray-950/5 --}}
    class="pb-3 rounded-lg"
    data-id="{{ $itemStatePath }}"
    data-sortable-item
    x-data="{ open: $persist(!@js($startCollapsed)) }"
    wire:key="{{ $itemStatePath }}"
>
    @php
        [$addChildAction, $deleteAction, $editAction, $reorderAction] = $actions;
        
        $hasChildren = count($item[$childrenKey] ?? []) > 0;
        
        $mountArgs = [
            'statePath' => $itemStatePath,
            'cachedRecordKey' => $uuid,
        ];
    @endphp

    <div class="relative group">
        <div @class([
            'bg-white rounded-lg border border-gray-300 w-full flex justify-between',
            'dark:bg-gray-900 dark:border-white/10',
        ])>
            <div class="flex w-full">
                @if ($reorderable)
                    <div @class([
                        'flex items-center bg-gray-50 rounded-l-lg rtl:rounded-r-lg border-r rtl:border-r-0 rtl:border-l border-gray-300 px-2',
                        'dark:bg-gray-800 dark:border-white/10',
                    ])>
                        {{ $reorderAction($mountArgs) }}
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
                    type="button"
                    @class([
                        'w-full py-2 text-left rtl:text-right appearance-none',
                        'px-4' => !$hasChildren,
                        'cursor-default' => $disabled || !$editable,
                    ])
                    @if ($editable)
                    wire:click="mountFormComponentAction(@js($statePath), 'edit', @js($mountArgs))"
                    @endif>
                    <span>{{ $item[$labelKey] }}</span>
                </button>
            </div>

            <div class="items-center flex-shrink-0 hidden px-2 space-x-2 rtl:space-x-reverse group-hover:flex">
                @if ($addable)
                    {{ $addChildAction($mountArgs) }}
                @endif
                @if ($editable)
                    {{ $editAction($mountArgs) }}
                @endif
                @if ($deletable)
                    {{ $deleteAction($mountArgs) }}
                @endif
            </div>
        </div>
    </div>

    <div
        @class(['ms-6', 'pt-2' => $hasChildren])
        x-show="open"
        x-collapse
    >
        <div
            wire:key="{{ $itemStatePath }}-children"
            x-data="tree({
                treeId: @js($treeId),
                statePath: @js($itemStatePath . ".$childrenKey"),
                disabled: @js($disabled),
                maxDepth: @js($maxDepth)
            })"
        >
            @foreach ($item[$childrenKey] ?? [] as $uuid => $child)
                <x-filament-adjacency-list::item
                    :uuid="$uuid"
                    :tree-id="$treeId"
                    :actions="$actions"
                    :addable="$addable"
                    :children-key="$childrenKey"
                    :deletable="$deletable"
                    :disabled="$disabled"
                    :editable="$editable"
                    :start-collapsed="$startCollapsed"
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
