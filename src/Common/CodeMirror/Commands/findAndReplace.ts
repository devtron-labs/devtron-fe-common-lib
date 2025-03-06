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
