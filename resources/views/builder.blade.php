<x-filament-forms::field-wrapper
    class="fi-adjacency-list-wrapper"
    :id="$getId()"
    :label="$getLabel()"
    :label-sr-only="$isLabelHidden()"
    :helper-text="$getHelperText()"
    :hint="$getHint()"
    :hint-icon="$getHintIcon()"
    :required="$isRequired()"
    :state-path="$getStatePath()"
>
    @php
        $treeId = $getId();
        
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
        $itemActions = [$getAction('addChild'), $getAction('delete'), $getAction('edit'), $getAction('reorder'), $getAction('indent'), $getAction('dedent'), $getAction('moveUp'), $getAction('moveDown')];
    @endphp

    <div
        class="fi-adjacency-list-tree"
        data-sortable-container
        ax-load
        ax-load-css="{{ \Filament\Support\Facades\FilamentAsset::getStyleHref('filament-adjacency-list-styles', 'saade/filament-adjacency-list') }}"
        ax-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('filament-adjacency-list', 'saade/filament-adjacency-list') }}"
        x-data="adjacencyList({
            treeId: @js($treeId),
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
                :has-rulers="$hasRulers"
                :indentable="$isIndentable && (!$loop->first && $loop->count > 1)"
                :is-collapsed="$isCollapsed"
                :is-collapsible="$isCollapsible"
                :is-indentable="$isIndentable"
                :is-moveable="$isMoveable"
                :item="$item"
                :item-state-path="$getStatePath() . '.' . $uuid"
                :label-key="$getLabelKey()"
                :max-depth="$maxDepth"
                :reorderable="$isReorderable"
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
</x-filament-forms::field-wrapper>
