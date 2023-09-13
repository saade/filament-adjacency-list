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
            onSort: (evt) => {

                if (this.maxDepth !== null && this.getDepth(evt.item) > this.maxDepth) {
                    // Undo the sorting
                    evt.from.insertBefore(evt.item, evt.pullMode ? null : evt.from.children[evt.oldIndex]);
                }

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
