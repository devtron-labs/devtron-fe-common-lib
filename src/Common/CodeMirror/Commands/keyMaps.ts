import { Command, EditorView } from '@uiw/react-codemirror'

export const blurOnEscape: Command = (view: EditorView) => {
    view.contentDOM.blur()
    return true
}
