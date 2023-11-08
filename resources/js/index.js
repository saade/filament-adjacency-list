import Sortable from "sortablejs"

export default ({
    statePath,
    disabled,
    maxDepth
}) => ({
    statePath,
    sortable: null,
    maxDepth,

    init() {
        this.sortable = new Sortable(this.$el, {
            disabled,
            group: "nested",
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.50,
            draggable: "[data-sortable-item]",
            handle: "[data-sortable-handle]",
            onMove: (evt) => {
                if (this.maxDepth >= 0 && this.getDepth(evt.related) > this.maxDepth) {
                    return false;  // Prevent sorting
                }
            },
            onSort: (evt) => {
                this.$wire.dispatchFormEvent('builder::sort', this.statePath, this.sortable.toArray())
            }
        })
    },

    getDepth(el, depth = 0) {
        let parentEl = el.parentElement.closest('[data-sortable-item]');
        if (parentEl) {
            return this.getDepth(parentEl, ++depth);
        }
        return depth;
    },
})
