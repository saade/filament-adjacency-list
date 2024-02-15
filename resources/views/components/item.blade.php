@props(['actions', 'addable', 'ascendable', 'childrenKey', 'dedentable', 'deletable', 'descendable', 'disabled', 'editable', 'hasRulers', 'indentable', 'isCollapsed', 'isCollapsible', 'isIndentable', 'isMoveable', 'item', 'itemStatePath', 'labelKey', 'maxDepth', 'reorderable', 'statePath', 'treeId', 'uuid'])

<div
    {{-- hover:bg-gray-950/5 --}}
    class="pb-3 rounded-lg"
    data-id="{{ $itemStatePath }}"
    data-sortable-item
    x-data="{ isCollapsed: @js($isCollapsed) }"
    wire:key="{{ $itemStatePath }}"
>
    @php
        [$addChildAction, $deleteAction, $editAction, $reorderAction, $indentAction, $dedentAction, $moveUpAction, $moveDownAction] = $actions;
        
        $hasChildren = count($item[$childrenKey] ?? []) > 0;
        
        $hitDepthLimit = $maxDepth && substr_count($itemStatePath, $childrenKey) >= $maxDepth;
        
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

                @if ($isCollapsible && $hasChildren)
                    <button
                        class="px-2 text-gray-500 appearance-none"
                        type="button"
                        title="{{ __('filament-adjacency-list::adjacency-list.actions.toggle-children.label') }}"
                        x-on:click.stop="isCollapsed = !isCollapsed"
                    >
                        @svg('heroicon-o-chevron-right', 'w-3.5 h-3.5 transition ease-in-out duration-200 rtl:rotate-180', ['x-bind:class' => "{'ltr:rotate-90 rtl:!rotate-90': !isCollapsed}"])
                    </button>
                @endif

                <button
                    type="button"
                    @class([
                        'w-full py-2 text-left rtl:text-right appearance-none',
                        'px-4' => !$isCollapsible || !$hasChildren,
                        'cursor-default' => $disabled || !$editable,
                    ])
                    @if ($editable)
                    wire:click="mountFormComponentAction(@js($statePath), 'edit', @js($mountArgs))"
                    @endif>
                    <span>{{ $item[$labelKey] }}</span>
                </button>
            </div>

            <div class="items-center flex-shrink-0 hidden px-2 space-x-2 rtl:space-x-reverse group-hover:flex">
                @if ($addable && !$hitDepthLimit)
                    {{ $addChildAction($mountArgs) }}
                @endif
                @if ($dedentable)
                    {{ $dedentAction($mountArgs) }}
                @endif
                @if ($ascendable)
                    {{ $moveUpAction($mountArgs) }}
                @endif
                @if ($descendable)
                    {{ $moveDownAction($mountArgs) }}
                @endif
                @if ($indentable && !$hitDepthLimit)
                    {{ $indentAction($mountArgs) }}
                @endif
                @if ($deletable)
                    {{ $deleteAction($mountArgs) }}
                @endif
            </div>
        </div>
    </div>

    <div
        @class([
            'ms-6' => !$hasRulers,
            'ms-5 border-l border-l-gray-100 ps-4' => $hasRulers,
            'pt-2' => $hasChildren,
        ])
        x-show="! isCollapsed"
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
                    :actions="$actions"
                    :addable="$addable"
                    :ascendable="$isMoveable && !$loop->first"
                    :children-key="$childrenKey"
                    :dedentable="$isIndentable && true"
                    :deletable="$deletable"
                    :descendable="$isMoveable && !$loop->last"
                    :disabled="$disabled"
                    :editable="$editable"
                    :has-rulers="$hasRulers"
                    :indentable="$isIndentable && (!$loop->first && $loop->count > 1)"
                    :is-collapsed="$isCollapsed"
                    :is-collapsible="$isCollapsible"
                    :is-indentable="$isIndentable"
                    :is-moveable="$isMoveable"
                    :item="$child"
                    :item-state-path="$itemStatePath . '.' . $childrenKey . '.' . $uuid"
                    :label-key="$labelKey"
                    :max-depth="$maxDepth"
                    :reorderable="$reorderable"
                    :state-path="$statePath"
                    :tree-id="$treeId"
                    :uuid="$uuid"
                />
            @endforeach
        </div>
    </div>
</div>
