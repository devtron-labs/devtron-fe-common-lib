import { renderToString } from 'react-dom/server'
import DOMPurify from 'dompurify'

import { ReactComponent as ICCaretDown } from '@Icons/ic-caret-down.svg'

import { CodeEditorProps, HoverTexts } from './types'

// DOM HELPERS
export const getFoldGutterElement = (open) => {
    const icon = document.createElement('span')
    const caretIcon = (
        <ICCaretDown
            className="icon-dim-16 scn-6 rotate"
            style={{ ['--rotateBy' as string]: !open ? '-90deg' : '0deg' }}
        />
    )

    icon.innerHTML = renderToString(caretIcon)
    return icon
}

export const getHoverElement = (schemaURI: CodeEditorProps['schemaURI']) => (data: HoverTexts) => {
    const hoverContainer = document.createElement('div')
    const node = (
        <div className="tippy-box default-tt flexbox-col px-10 py-6 br-4 lh-18">
            <p className="m-0">{data.message}</p>
            <p
                className="m-0"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.typeInfo.replace(/`([^`]+)`/g, '<code>$1</code>')),
                }}
            />
            <a className="m-0 dc__w-fit-content" href={schemaURI} target="_blank" rel="noreferrer">
                Source
            </a>
        </div>
    )

    hoverContainer.innerHTML = renderToString(node)
    return hoverContainer
}
