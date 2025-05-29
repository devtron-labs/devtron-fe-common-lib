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

import { openSearchPanel as cmOpenSearchPanel, replaceAll as cmReplaceAll, searchPanelOpen } from '@codemirror/search'
import { Command, EditorState, EditorView, StateEffect, StateField } from '@uiw/react-codemirror'

export const setShowReplaceField = StateEffect.define<boolean>()

export const showReplaceFieldState = StateField.define<boolean>({
    create() {
        return false
    },
    update(value, tr) {
        const effect = tr.effects.find((_effect) => _effect.is(setShowReplaceField))
        if (effect) {
            return effect.value
        }
        return value
    },
})

export const getShowReplaceField = (state: EditorState) => {
    const curState = state.field(showReplaceFieldState, false)
    return curState || false
}

export const openSearchPanel: Command = (view: EditorView) => {
    view.dispatch({
        effects: [setShowReplaceField.of(searchPanelOpen(view.state) ? getShowReplaceField(view.state) : false)],
    })
    cmOpenSearchPanel(view)
    return true
}

export const openSearchPanelWithReplace: Command = (view: EditorView) => {
    openSearchPanel(view)
    view.dispatch({ effects: [setShowReplaceField.of(!view.state.readOnly && true)] })
    return true
}

export const replaceAll: Command = (view: EditorView) => {
    const isReplaceEnabled = getShowReplaceField(view.state)
    if (isReplaceEnabled) {
        cmReplaceAll(view)
    }
    return true
}
