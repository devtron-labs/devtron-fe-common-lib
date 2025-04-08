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

import { ensureSyntaxTree } from '@codemirror/language'
import { Decoration, DecorationSet, EditorState, EditorView, Extension, Range, StateField } from '@uiw/react-codemirror'

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
