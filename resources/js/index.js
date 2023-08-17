import Sortable from "sortablejs"

export default ({
    statePath,
    disabled
}) => ({
    statePath,
    sortable: null,

    init() {
        this.sortable = new Sortable(this.$el, {
            disabled,
            group: "nested",
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.50,
            draggable: "[data-sortable-item]",
            handle: "[data-sortable-handle]",
            onSort: () => {
                this.$wire.dispatchFormEvent('builder::sort', this.statePath, this.sortable.toArray())
            }
        })
    }
 })
