import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as Info } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ErrorIcon } from '@Icons/ic-error-exclamation.svg'
import { ClipboardButton } from '@Common/ClipboardButton'
import { Progressing } from '@Common/Progressing'

import { useCodeEditorContext } from './CodeEditor.context'
import { CodeEditorHeaderProps, CodeEditorStatusBarProps } from './types'

// TODO: Check use-case of this
export const CodeEditorPlaceholder = ({ className = '', style = {}, customLoader }: any) => {
    const { height } = useCodeEditorContext()

    if (customLoader) {
        return customLoader
    }

    return (
        <div className={`code-editor code-editor--placeholder disabled ${className}`} style={{ ...style, height }}>
            <div className="flex">
                <Progressing pageLoader />
            </div>
        </div>
    )
}

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
            <div className="diff-icon" />
            {state.diffMode ? 'Hide comparison' : 'Compare with default'}
        </div>
    )
}

export const Header = ({ children, className, hideDefaultSplitHeader }: CodeEditorHeaderProps) => {
    const { state } = useCodeEditorContext()

    return (
        <div className={className || 'code-editor__header flex right'}>
            {children}
            {!hideDefaultSplitHeader && state.defaultCode && <SplitPane />}
        </div>
    )
}

export const ValidationError = () => {
    const { error } = useCodeEditorContext()

    return error ? <div className="form__error">{error}</div> : null
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
