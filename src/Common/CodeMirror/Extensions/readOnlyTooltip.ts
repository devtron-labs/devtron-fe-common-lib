/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EditorView, Extension, showTooltip, StateEffect, StateField, Tooltip, ViewPlugin } from '@uiw/react-codemirror'

import { getReadOnlyElement } from '../utils'
import { READ_ONLY_TOOLTIP_TIMEOUT } from '../CodeEditor.constants'

/** Array of keys to be ignored on keypress */
const ignoreKeys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Enter', 'Escape']

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

// Plugin to show and remove tooltip on keypress
const keypressTooltipPlugin = ViewPlugin.fromClass(
    class {
        private timeoutId: number | null = null

        constructor(public view: EditorView) {
            this.view.dom.addEventListener('keydown', this.handleKeyPress)
        }

        destroy() {
            this.view.dom.removeEventListener('keydown', this.handleKeyPress)
            if (this.timeoutId) {
                clearTimeout(this.timeoutId)
            }
        }

        handleKeyPress = (e: KeyboardEvent) => {
            if (
                !this.view.state.readOnly ||
                ignoreKeys.includes(e.key) ||
                e.metaKey ||
                e.shiftKey ||
                e.altKey ||
                e.ctrlKey
            ) {
                return
            }

            // Show tooltip
            const tooltip = createTooltip(this.view)
            this.view.dispatch({ effects: updateTooltipEffect.of(tooltip) })

            // Reset the timer after every key press
            if (this.timeoutId) {
                clearTimeout(this.timeoutId)
            }

            // Remove tooltip after timeout time
            this.timeoutId = setTimeout(() => {
                this.view.dispatch({ effects: updateTooltipEffect.of(null) })
            }, READ_ONLY_TOOLTIP_TIMEOUT)
        }
    },
)

/**
 * The read-only tooltip extension for CodeMirror. \
 * Displays a tooltip at the cursor position when the editor is read-only and key is pressed.
 */
export const readOnlyTooltip: Extension = [tooltipField, keypressTooltipPlugin]
