import { ReactNode } from 'react'

import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as Info } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ErrorIcon } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICCompare } from '@Icons/ic-compare.svg'
import { ClipboardButton } from '@Common/ClipboardButton'

import { useCodeEditorContext } from './CodeEditor.context'
import { CodeEditorHeaderProps, CodeEditorStatusBarProps } from './types'

const SplitPane = () => {
    const { state, dispatch, readOnly } = useCodeEditorContext()

    const handleToggle = () => {
        if (readOnly) {
            return
        }
        dispatch({ type: 'setDiff', value: !state.diffMode })
    }

    return (
        <div className="code-editor__split-pane flex pointer cn-7 fcn-7 ml-auto" onClick={handleToggle}>
            <ICCompare className="icon-dim-20 mr-4" />
            {state.diffMode ? 'Hide comparison' : 'Compare with default'}
        </div>
    )
}

export const Header = ({ children, className, hideDefaultSplitHeader }: CodeEditorHeaderProps) => {
    const { state, hasCodeEditorContainer } = useCodeEditorContext()

    return (
        <div
            data-code-editor-header
            className={`${hasCodeEditorContainer ? 'dc__top-radius-4' : ''} ${className || 'code-editor__header flex right bcn-1 pt-10 pb-9 px-16 dc__border-bottom'}`}
        >
            {children}
            {!hideDefaultSplitHeader && state.lhsCode && <SplitPane />}
        </div>
    )
}

export const Warning = ({ className, text, children }: CodeEditorStatusBarProps) => (
    <div
        className={`code-editor__warning fs-12 fw-4 lh-16 cn-9 py-8 px-16 bcy-1 bw-1 ey-2 dc__height-auto ${className || ''}`}
    >
        <ICWarningY5 className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const ErrorBar = ({ className, text, children }: CodeEditorStatusBarProps) => (
    <div className={`code-editor__error fs-12 fw-4 lh-16 py-8 px-16 dc__border-bottom bco-1 co-5 ${className || ''}`}>
        <ErrorIcon className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const Information = ({ className, children, text }: CodeEditorStatusBarProps) => (
    <div
        className={`code-editor__information fs-12 fw-4 lh-16 cn-9 dc__height-auto py-8 px-16 dc__border-bottom bcb-1 ${className || ''}`}
    >
        <Info className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const Clipboard = () => {
    const { state } = useCodeEditorContext()

    return <ClipboardButton content={state.code} iconSize={16} />
}

export const Container = ({ children, flexExpand }: { children: ReactNode; flexExpand?: boolean }) => (
    <div
        data-code-editor-container
        className={`code-editor__container w-100 dc__border br-4
        ${flexExpand ? 'flex-grow-1 flexbox-col' : ''}`}
    >
        {children}
    </div>
)
