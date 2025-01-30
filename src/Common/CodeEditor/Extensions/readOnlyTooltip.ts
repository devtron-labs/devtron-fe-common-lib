import {
    EditorView,
    Extension,
    showTooltip,
    StateEffect,
    StateField,
    Tooltip,
    ViewPlugin,
    ViewUpdate,
} from '@uiw/react-codemirror'

import { getReadOnlyElement } from '../utils'

// Effect to update the tooltip in the editor state
const updateTooltipEffect = StateEffect.define<Tooltip | null>()

// StateField to manage tooltip state
const tooltipField = StateField.define<Tooltip | null>({
    // Initializes the tooltip state as null
    create: () => null,
    // Updates the tooltip state based on the dispatched effects
    update: (value, tr) => {
        const effect = tr.effects.find((_effect) => _effect.is(updateTooltipEffect))
        if (effect) {
            return effect.value
        }
        return value
    },
    // Provides the tooltip to the editor's UI
    provide: (field) => showTooltip.from(field),
})

/**
 * Creates a tooltip at the current cursor position.
 * @param view - The editor view instance.
 * @returns The tooltip object or null if no cursor position is available.
 */
const createTooltip = (view: EditorView): Tooltip => {
    const cursorPos = view.state.selection.main.head

    if (cursorPos === null) {
        return null
    }

    // Get read-only element UI.
    const dom = getReadOnlyElement()
    dom.classList.add('dc__w-fit-content')

    // Attach to body to measure its dimensions
    document.body.appendChild(dom)
    const offset = -(dom.getBoundingClientRect().width / 2)
    document.body.removeChild(dom)

    return {
        pos: cursorPos,
        // Display the tooltip above the cursor
        above: true,
        // Provide tooltip dom element and offset it's position to be in center.
        create: () => ({ dom, offset: { x: offset, y: 4 }, overlap: true }),
    }
}

// Define a plugin to manage tooltip updates
const focusTooltipPlugin = ViewPlugin.fromClass(
    class {
        // Tracks whether an update is scheduled
        public scheduled: boolean = false

        constructor(public view: EditorView) {
            this.scheduleUpdate()
        }

        // Called when the editor state changes
        update(update: ViewUpdate) {
            if (update.focusChanged || update.selectionSet) {
                this.scheduleUpdate()
            }
        }

        // Schedules a tooltip update in the next microtask
        scheduleUpdate() {
            if (this.scheduled) return
            this.scheduled = true

            // Update the tooltip asynchronously
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.resolve().then(() => {
                this.scheduled = false
                const tooltip = this.view.state.readOnly && this.view.hasFocus ? createTooltip(this.view) : null
                this.view.dispatch({
                    effects: updateTooltipEffect.of(tooltip),
                })
            })
        }
    },
)

/**
 * The read-only tooltip extension for CodeMirror. \
 * Displays a tooltip at the cursor position when the editor is read-only and focused.
 */
export const readOnlyTooltip: Extension = [tooltipField, focusTooltipPlugin]
