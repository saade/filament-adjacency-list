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
                        this.getListDepth(evt.to) +
                            this.getHeight(evt.dragged) >
                            maxDepth
                    ) {
                        return false
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

        getListDepth(list) {
            let depth = 0
            let item = list.closest('[data-sortable-item]')

            while (item) {
                depth++
                item = item.parentElement.closest('[data-sortable-item]')
            }

            return depth
        },

        getHeight(item) {
            let height = 0

            item.querySelectorAll('[data-sortable-item]').forEach((child) => {
                let depth = 0

                while (child !== item) {
                    depth++
                    child = child.parentElement.closest('[data-sortable-item]')
                }

                height = Math.max(height, depth)
            })

            return height
        },
    }
}
