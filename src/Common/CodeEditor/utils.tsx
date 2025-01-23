import { renderToString } from 'react-dom/server'
import DOMPurify from 'dompurify'

import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'

import { CodeEditorProps, HoverTexts } from './types'

// UTILS
export const getCodeEditorHeight = (height: CodeEditorProps['height']) => {
    switch (height) {
        case '100%':
            return {
                codeEditorParentClassName: 'h-100',
                codeEditorClassName: 'h-100',
                codeEditorHeight: '100%',
            }
        case 'auto':
            return {
                codeEditorParentClassName: '',
                codeEditorClassName: '',
                codeEditorHeight: 'auto',
            }
        case 'fitToParent':
            return {
                codeEditorParentClassName: 'flex-grow-1 h-0 dc__overflow-hidden',
                codeEditorClassName: 'h-100',
                codeEditorHeight: '100%',
            }
        default:
            return {
                codeEditorParentClassName: '',
                codeEditorClassName: '',
                codeEditorHeight: `${height}px`,
            }
    }
}

// DOM HELPERS
export const getFoldGutterElement = (open) => {
    const icon = document.createElement('span')
    icon.className = `flex h-100 ${!open ? 'is-closed' : ''}`
    const caretIcon = (
        <ICCaretDown
            className="icon-dim-12 scn-6 rotate"
            style={{ ['--rotateBy' as string]: !open ? '-90deg' : '0deg' }}
        />
    )

    icon.innerHTML = renderToString(caretIcon)
    return icon
}

export const getHoverElement = (schemaURI: CodeEditorProps['schemaURI']) => (data: HoverTexts) => {
    const hoverContainer = document.createElement('div')
    const node = (
        <div className="code-editor__schema-tooltip dc__mxw-300 flexbox-col px-10 py-6 br-4 lh-18">
            {data.message && <p className="m-0">{data.message}</p>}
            {data.typeInfo && (
                <p
                    className="m-0"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(data.typeInfo.replace(/`([^`]+)`/g, '<code>$1</code>')),
                    }}
                />
            )}
            {schemaURI && (
                <a className="m-0 dc__w-fit-content" href={schemaURI} target="_blank" rel="noreferrer">
                    Source
                </a>
            )}
        </div>
    )

    hoverContainer.classList.add('dc__w-fit-content')
    hoverContainer.innerHTML = renderToString(node)
    return hoverContainer
}

export const getReadOnlyElement = () => {
    const dom = document.createElement('div')
    const node = (
        <div className="code-editor__read-only-tooltip py-6 px-10 br-4">
            <p className="m-0 fs-12 lh-18">Cannot edit in read-only editor</p>
        </div>
    )

    dom.innerHTML = renderToString(node)

    return dom
}
