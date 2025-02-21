import { EditorView, Facet, ViewPlugin } from '@uiw/react-codemirror'

const Theme = EditorView.theme({
    '&': { height: '100%', overflowY: 'auto' },
    '& .cm-minimap-gutter': { position: 'sticky', right: 0, top: 0 },
    '& .cm-minimap-inner': { height: '100%', position: 'absolute', right: 0, top: 0 },
})

export interface MinimapConfig {
    create: (view: EditorView) => { dom: HTMLElement }
}

const minimapClass = ViewPlugin.fromClass(
    class {
        private dom: HTMLElement

        constructor(view: EditorView) {
            // eslint-disable-next-line no-use-before-define
            if (view.state.facet(showDiffMap)) {
                this.create(view)
            }
        }

        private create(view: EditorView) {
            const dom = document.createElement('div')
            dom.classList.add('cm-gutters')
            this.dom = dom
            view.scrollDOM.insertBefore(this.dom, view.contentDOM.nextSibling)
        }

        destroy() {
            this.dom.remove()
        }
    },
)

const showDiffMap = Facet.define<MinimapConfig | null, MinimapConfig | null>({
    combine: (c) => c.find((o) => o !== null) ?? null,
    enables: () => [Theme, minimapClass],
})

export { showDiffMap }
