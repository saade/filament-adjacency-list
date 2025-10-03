<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    @php
        $treeId = $getId();
        $key = $getKey();

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
        $itemActions = [
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

    <div
        x-ignore
        class="fi-adjacency-list-tree"
        data-sortable-container
        x-load
        x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('filament-adjacency-list-alpine', 'saade/filament-adjacency-list') }}"
        x-data="filamentAdjacencyList({
            treeId: @js($treeId),
            key: @js($key),
            statePath: @js($getStatePath()),
            disabled: @js($isDisabled),
            maxDepth: @js($maxDepth)
        })"
    >
        @forelse($getState() as $uuid => $item)
            <x-filament-adjacency-list::item
                class="fi-adjacency-list-root"
                :actions="$itemActions"
                :addable="$isAddable"
                :ascendable="$isMoveable && !$loop->first"
                :children-key="$getChildrenKey()"
                :dedentable="$isIndentable && false"
                :deletable="$isDeletable"
                :descendable="$isMoveable && !$loop->last"
                :disabled="$isDisabled"
                :editable="$isEditable"
                :get-item-action="$getItemAction"
                :get-item-label="$getItemLabel"
                :get-item-url="$getItemUrl"
                :has-rulers="$hasRulers"
                :indentable="$isIndentable && (!$loop->first && $loop->count > 1)"
                :is-collapsed="$isCollapsed"
                :is-collapsible="$isCollapsible"
                :is-indentable="$isIndentable"
                :is-moveable="$isMoveable"
                :item="$item"
                :item-state-path="$getStatePath() . '.' . $uuid"
                :key="$key"
                :label-key="$getLabelKey()"
                :max-depth="$maxDepth"
                :reorderable="$isReorderable"
                :should-open-item-url-in-new-tab="$shouldOpenItemUrlInNewTab"
                :state-path="$getStatePath()"
                :tree-id="$treeId"
                :uuid="$uuid"
            />
        @empty
            <div
                class="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg rtl:text-right dark:bg-gray-900 dark:border-white/10">
                {{ __('filament-adjacency-list::adjacency-list.items.empty') }}
            </div>
        @endforelse
    </div>

    <div class="flex justify-end">
        @if ($isAddable)
            {{ $addAction(['statePath' => $getStatePath()]) }}
        @endif
    </div>
</x-dynamic-component>
