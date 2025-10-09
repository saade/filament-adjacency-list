@props(['actions', 'addable', 'ascendable', 'childrenKey', 'dedentable', 'deletable', 'descendable', 'disabled', 'editable', 'getItemAction', 'getItemUrl', 'hasRulers', 'indentable', 'isCollapsed', 'isCollapsible', 'isIndentable', 'isMoveable', 'item', 'itemStatePath', 'labelKey', 'maxDepth', 'reorderable', 'shouldOpenItemUrlInNewTab', 'statePath', 'treeId', 'uuid'])

<div
    wire:key="{{ $itemStatePath }}"
    data-id="{{ $itemStatePath }}"
    data-sortable-item
    x-data="{ isCollapsed: @js($isCollapsed) }"
    {{ $attributes->merge(['class' => 'rounded-lg mt-1.5']) }}
>
    @php
        [$addChildAction, $deleteAction, $editAction, $reorderAction, $indentAction, $dedentAction, $moveUpAction, $moveDownAction] = $actions;

        $hasChildren = count($item[$childrenKey] ?? []) > 0;

        $hitDepthLimit = $maxDepth && substr_count($itemStatePath, $childrenKey) >= $maxDepth;

        $itemAction = $getItemAction($item);
        $itemUrl = $getItemUrl($item);
        $openItemUrlInNewTab = $shouldOpenItemUrlInNewTab($item);

        $mountArgs = ['statePath' => $itemStatePath, 'cachedRecordKey' => $uuid];

        $itemClasses = \Illuminate\Support\Arr::toCssClasses([
            'flex-1 py-2 text-left rtl:text-right appearance-none',
            'px-8' => !$isCollapsible || !$hasChildren,
            'cursor-default' => ($itemAction && $itemUrl === null) && $disabled,
        ])
    @endphp

    <div
        class="flex justify-between w-full bg-white border border-gray-300 rounded-lg fi-adjacency-list-item dark:bg-gray-900 dark:border-white/10 group">
        <div class="flex flex-1">
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
                
            @if($itemUrl && $itemAction === null)
                <a
                    class="{{ $itemClasses }}"
                    {{ \Filament\Support\generate_href_html($itemUrl, $openItemUrlInNewTab) }}
                >
                    <span>{{ $item[$labelKey] }}</span>
                </a>
            @elseif ($itemAction)
                <button
                    type="button"
                    class="{{ $itemClasses }}"
                    @if(!$disabled)
                    wire:click="mountFormComponentAction(@js($statePath), @js($itemAction), @js($mountArgs))"
                    @endif
                >
                    <span>{{ $item[$labelKey] }}</span>
                </button>
            @else
                <div class="{{ $itemClasses }}">
                    <span>{{ $item[$labelKey] }}</span>
                </div>
            @endif
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
            @if ($editable)
                {{ $editAction($mountArgs) }}
            @endif
        </div>
    </div>

    <div
        wire:key="{{ $itemStatePath }}.children"
        x-show="! isCollapsed"
        x-collapse
        @class([
            'fi-adjacency-list-items ms-5 mt-1.5',
            'border-l border-l-gray-100 dark:border-l-white/10 ps-5' => $hasRulers,
        ])
        x-data="filamentAdjacencyList({
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
                :get-item-action="$getItemAction"
                :get-item-url="$getItemUrl"
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
                :should-open-item-url-in-new-tab="$shouldOpenItemUrlInNewTab"
                :state-path="$statePath"
                :tree-id="$treeId"
                :uuid="$uuid"
            />
        @endforeach
    </div>
</div>
