import Sortable from 'sortablejs'

export default function filamentAdjacencyList({
    treeId,
    key,
    statePath,
    disabled,
    maxDepth,
}) {
    return {
        statePath,
        sortable: null,

        init() {
            this.sortable = new Sortable(this.$el, {
                disabled,
                group: treeId,
                animation: 150,
                fallbackOnBody: true,
                swapThreshold: 0.25,
                invertSwap: true,
                draggable: '[data-sortable-item]',
                handle: '[data-sortable-handle]',
                onMove: (evt) => {
                    if (
                        maxDepth &&
                        maxDepth >= 0 &&
                        this.getDepth(evt.related) > maxDepth
                    ) {
                        return false // Prevent dragging items to a depth greater than maxDepth
                    }
                },
                onSort: () => {
                    this.$wire.callSchemaComponentMethod(key, 'sort', {
                        targetStatePath: this.statePath,
                        targetItemsStatePaths: this.sortable.toArray(),
                    })
                },
            })
        },

        getDepth(el, depth = 0) {
            const parentElement = el.parentElement.closest(
                '[data-sortable-item]',
            )

            if (parentElement) {
                return this.getDepth(parentElement, ++depth)
            }

            return depth
        },
    }
}
