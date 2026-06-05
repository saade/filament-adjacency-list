<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    @php
        $treeId = $getId();
        $key = $getKey();

        $childrenKey = $getChildrenKey();
        $labelKey = $getLabelKey();
        $statePath = $getStatePath();

        $hasRulers = $hasRulers();
        $isAddable = $isAddable();
        $isCollapsible = $isCollapsible();
        $isCollapsed = $isCollapsed();
        $isDeletable = $isDeletable();
        $isDisabled = $isDisabled();
        $isEditable = $isEditable();
        $isIndentable = $isIndentable();
        $isMoveable = $isMoveable();
        $isReorderable = $isReorderable();

        $maxDepth = $getMaxDepth();

        $addAction = $getAction('add');

        [
            $addChildAction,
            $deleteAction,
            $editAction,
            $reorderAction,
            $indentAction,
            $dedentAction,
            $moveUpAction,
            $moveDownAction,
        ] = [
            $getAction('addChild'),
            $getAction('delete'),
            $getAction('edit'),
            $getAction('reorder'),
            $getAction('indent'),
            $getAction('dedent'),
            $getAction('moveUp'),
            $getAction('moveDown'),
        ];
    @endphp

    @capture($renderItem, $renderItem, $item, $uuid, $itemStatePath, $rootClass, $ascendable, $descendable, $indentable, $dedentable)
        @php
            $hasChildren = count($item[$childrenKey] ?? []) > 0;

            $hitDepthLimit = $maxDepth && substr_count($itemStatePath, $childrenKey) >= $maxDepth;

            $itemLabel = $getItemLabel($item);
            $itemAction = $getItemAction($item);
            $itemUrl = $getItemUrl($item);
            $openItemUrlInNewTab = $shouldOpenItemUrlInNewTab($item);

            $mountArgs = ['statePath' => $itemStatePath, 'cachedRecordKey' => $uuid];

            $itemClasses = \Illuminate\Support\Arr::toCssClasses([
                'flex-1 py-2 text-left rtl:text-right appearance-none',
                'px-8' => !$isCollapsible || !$hasChildren,
                'cursor-default' => $itemAction && $itemUrl === null && $isDisabled,
            ]);
        @endphp

        <div
            wire:key="{{ $itemStatePath }}"
            data-id="{{ $itemStatePath }}"
            data-sortable-item
            x-data="{ isCollapsed: @js($isCollapsed) }"
            @class([
                'rounded-lg mt-1.5',
                $rootClass,
            ])
        >
            <div
                class="flex justify-between w-full mt-1 bg-white border border-gray-300 rounded-lg fi-adjacency-list-item dark:bg-gray-900 dark:border-white/10 group">
                <div class="flex flex-1">
                    @if ($isReorderable)
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

                    @if ($itemUrl && $itemAction === null)
                        <a
                            class="{{ $itemClasses }}"
                            {{ \Filament\Support\generate_href_html($itemUrl, $openItemUrlInNewTab) }}
                        >
                            <span>{{ $itemLabel }}</span>
                        </a>
                    @elseif ($itemAction)
                        <button
                            type="button"
                            class="{{ $itemClasses }}"
                            @if (!$isDisabled) wire:click="mountAction(@js($itemAction), @js($mountArgs), { schemaComponent: @js($key) })" @endif
                        >
                            <span>{{ $itemLabel }}</span>
                        </button>
                    @else
                        <div class="{{ $itemClasses }}">
                            <span>{{ $itemLabel }}</span>
                        </div>
                    @endif
                </div>

                <div class="items-center flex-shrink-0 hidden px-2 space-x-2 rtl:space-x-reverse group-hover:flex">
                    @if ($isAddable && !$hitDepthLimit)
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
                    @if ($isDeletable)
                        {{ $deleteAction($mountArgs) }}
                    @endif
                    @if ($isEditable)
                        {{ $editAction($mountArgs) }}
                    @endif
                </div>
            </div>

            <div
                wire:key="{{ $itemStatePath }}.children"
                x-show="! isCollapsed"
                x-collapse
                @class([
                    'fi-adjacency-list-items ms-5',
                    'border-l border-l-gray-100 dark:border-l-white/10 ps-5' => $hasRulers,
                ])
                x-data="filamentAdjacencyList({
                    treeId: @js($treeId),
                    key: @js($key),
                    statePath: @js($itemStatePath . ".$childrenKey"),
                    disabled: @js($isDisabled),
                    maxDepth: @js($maxDepth)
                })"
            >
                @foreach ($item[$childrenKey] ?? [] as $childUuid => $child)
                    {{ $renderItem(
                        $renderItem,
                        $child,
                        $childUuid,
                        $itemStatePath . '.' . $childrenKey . '.' . $childUuid,
                        empty($child[$childrenKey]) ? 'fi-adjacency-list-leaf' : 'fi-adjacency-list-branch',
                        $isMoveable && ! $loop->first,
                        $isMoveable && ! $loop->last,
                        $isIndentable && (! $loop->first && $loop->count > 1),
                        $isIndentable,
                    ) }}
                @endforeach
            </div>
        </div>
    @endcapture

    <div
        x-ignore
        class="fi-adjacency-list-tree"
        data-sortable-container
        x-load
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('filament-adjacency-list-alpine', 'saade/filament-adjacency-list') }}"
        x-data="filamentAdjacencyList({
            treeId: @js($treeId),
            key: @js($key),
            statePath: @js($statePath),
            disabled: @js($isDisabled),
            maxDepth: @js($maxDepth)
        })"
    >
        @forelse($getState() as $uuid => $item)
            {{ $renderItem(
                $renderItem,
                $item,
                $uuid,
                $statePath . '.' . $uuid,
                'fi-adjacency-list-root',
                $isMoveable && ! $loop->first,
                $isMoveable && ! $loop->last,
                $isIndentable && (! $loop->first && $loop->count > 1),
                false,
            ) }}
        @empty
            <div
                class="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg rtl:text-right dark:bg-gray-900 dark:border-white/10">
                {{ __('filament-adjacency-list::adjacency-list.items.empty') }}
            </div>
        @endforelse
    </div>

    <div class="flex justify-end">
        @if ($isAddable)
            {{ $addAction(['statePath' => $statePath]) }}
        @endif
    </div>
</x-dynamic-component>
