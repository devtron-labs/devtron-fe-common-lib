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
        <div className="code-editor__split-pane flex pointer" onClick={handleToggle}>
            <ICCompare className="icon-dim-20 mr-4" />
            {state.diffMode ? 'Hide comparison' : 'Compare with default'}
        </div>
    )
}

export const Header = ({ children, className, hideDefaultSplitHeader }: CodeEditorHeaderProps) => {
    const { state } = useCodeEditorContext()

    return (
        <div className={className || 'code-editor__header flex right'}>
            {children}
            {!hideDefaultSplitHeader && state.lhsCode && <SplitPane />}
        </div>
    )
}

export const Warning = ({ className, text, children }: CodeEditorStatusBarProps) => (
    <div className={`code-editor__warning ${className || ''}`}>
        <ICWarningY5 className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const ErrorBar = ({ className, text, children }: CodeEditorStatusBarProps) => (
    <div className={`code-editor__error ${className || ''}`}>
        <ErrorIcon className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const Information = ({ className, children, text }: CodeEditorStatusBarProps) => (
    <div className={`code-editor__status ${className || ''}`}>
        <Info className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const Clipboard = () => {
    const { state } = useCodeEditorContext()

    return <ClipboardButton content={state.code} iconSize={16} />
}
