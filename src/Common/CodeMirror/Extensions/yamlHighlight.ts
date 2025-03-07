import { Decoration, DecorationSet, EditorState, EditorView, Extension, Range, StateField } from '@uiw/react-codemirror'
import { ensureSyntaxTree } from '@codemirror/language'

const isBool = (value: string) => /^(true|false)$/i.test(value)

const isNumberOrBool = (value: string) => isBool(value) || /^[-+]?\d*\.\d+$/.test(value) || /^[-+]?\d+$/.test(value)

const calculateDecorations = (state: EditorState) => {
    const decorations: Range<Decoration>[] = []
    const tree = ensureSyntaxTree(state, state.doc.length)

    if (tree) {
        tree.iterate({
            from: 0,
            to: state.doc.length,
            enter: (node) => {
                if (node.name === 'Pair') {
                    const valueNode = node.node.getChild('Literal')
                    if (valueNode) {
                        const valueText = state.sliceDoc(valueNode.from, valueNode.to).trim()
                        if (isNumberOrBool(valueText)) {
                            decorations.push(
                                Decoration.mark({
                                    class: isBool(valueText) ? 'cm-highlight-bool' : 'cm-highlight-number',
                                }).range(valueNode.from, valueNode.to),
                            )
                        }
                    }
                }
            },
        })
    }

    return Decoration.set(decorations)
}

const highlightDecorationField = StateField.define<DecorationSet>({
    create(state) {
        return calculateDecorations(state)
    },
    update(decorations, tr) {
        let updatedDecorations = decorations.map(tr.changes)
        if (tr.docChanged) {
            updatedDecorations = calculateDecorations(tr.state)
        }
        return updatedDecorations
    },
    provide: (field) => EditorView.decorations.from(field),
})

export const yamlHighlight: Extension = highlightDecorationField
