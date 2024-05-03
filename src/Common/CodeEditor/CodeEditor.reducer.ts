import { MODES } from '../Constants'
import { Action, CodeEditorState, CodeEditorThemesKeys } from './types'

export const CodeEditorReducer = (state: CodeEditorState, action: Action) => {
    switch (action.type) {
        case 'changeLanguage':
            return { ...state, mode: action.value }
        case 'setDiff':
            return { ...state, diffMode: action.value }
        case 'setTheme':
            return { ...state, theme: action.value }
        case 'setCode':
            return { ...state, code: action.value }
        case 'setHeight':
            return { ...state, height: action.value.toString() }
        default:
            return state
    }
}

export const initialState = (mode, theme, value, diffView, noParsing): CodeEditorState => ({
    mode,
    theme: theme || CodeEditorThemesKeys.vs,
    code: value,
    diffMode: diffView,
    noParsing: [MODES.JSON, MODES.YAML].includes(mode) ? noParsing : true,
})
