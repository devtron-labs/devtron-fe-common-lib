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

const updateTooltipEffect = StateEffect.define<Tooltip | null>()

const tooltipField = StateField.define<Tooltip | null>({
    create: () => null,
    update: (value, tr) => {
        const effect = tr.effects.find((_effect) => _effect.is(updateTooltipEffect))
        if (effect) {
            return effect.value
        }

        return value
    },
    provide: (field) => showTooltip.from(field),
})

const createTooltip = (view: EditorView): Tooltip => {
    const cursorPos = view.state.selection.main.head

    if (cursorPos === null) {
        return null
    }

    const dom = getReadOnlyElement()
    dom.classList.add('dc__w-fit-content')
    document.body.appendChild(dom)
    const offset = -(dom.getBoundingClientRect().width / 2)
    document.body.removeChild(dom)

    return {
        pos: cursorPos,
        above: true,
        create: () => ({ dom, offset: { x: offset, y: 4 }, overlap: true }),
    }
}

// Define a plugin to manage tooltip updates
const focusTooltipPlugin = ViewPlugin.fromClass(
    class {
        public scheduled: boolean = false

        constructor(public view: EditorView) {
            this.scheduleUpdate()
        }

        update(update: ViewUpdate) {
            if (update.focusChanged || update.selectionSet) {
                this.scheduleUpdate()
            }
        }

        scheduleUpdate() {
            if (this.scheduled) return
            this.scheduled = true

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

export const readOnlyTooltip: Extension = [tooltipField, focusTooltipPlugin]
