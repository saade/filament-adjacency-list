@props(['actions', 'addable', 'ascendable', 'childrenKey', 'dedentable', 'deletable', 'descendable', 'disabled', 'editable', 'hasRulers', 'indentable', 'isCollapsed', 'isCollapsible', 'isIndentable', 'isMoveable', 'item', 'itemStatePath', 'labelKey', 'maxDepth', 'reorderable', 'statePath', 'treeId', 'uuid'])

<div
    wire:key="{{ $itemStatePath }}"
    data-id="{{ $itemStatePath }}"
    data-sortable-item
    x-data="{ isCollapsed: @js($isCollapsed) }"
    {{ $attributes->merge(['class' => 'rounded-lg']) }}
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

    <div
        class="flex justify-between w-full bg-white border border-gray-300 rounded-lg fi-adjacency-list-item dark:bg-gray-900 dark:border-white/10 group">
        <div class="flex">
            @if ($reorderable)
                <div
                    class="flex items-center justify-center w-10 px-2 border-r border-gray-300 rounded-l-lg bg-gray-50 rtl:rounded-r-lg rtl:border-r-0 rtl:border-l dark:bg-gray-800 dark:border-white/10">
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

    <div
        wire:key="{{ $itemStatePath }}.children"
        x-show="! isCollapsed"
        x-collapse
        @class([
            'fi-adjacency-list-items ms-5',
            'pb-1' => !$hasChildren,
            'border-l border-l-gray-100 dark:border-l-white/10 ps-5 pt-2' => $hasRulers,
        ])
        x-data="tree({
            treeId: @js($treeId),
            statePath: @js($itemStatePath . ".$childrenKey"),
            disabled: @js($disabled),
            maxDepth: @js($maxDepth)
        })"
    >
        @foreach ($item[$childrenKey] ?? [] as $uuid => $child)
            <x-filament-adjacency-list::item
                @class([
                    'fi-adjacency-list-branch' => !empty($child[$childrenKey]),
                    'fi-adjacency-list-leaf' => empty($child[$childrenKey]),
                ])
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
