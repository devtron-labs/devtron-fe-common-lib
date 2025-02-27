import { CodeEditor } from '@Common/CodeEditor'
import { CodeEditor as CodeMirror, CodeEditorHeaderProps, CodeEditorStatusBarProps } from '@Common/CodeMirror'

import { CodeEditorWrapperProps } from './types'

export const isCodeMirrorEnabled = () => window._env_.FEATURE_CODE_MIRROR_ENABLE

export const CodeEditorWrapper = <DiffView extends boolean>({
    codeEditorProps,
    codeMirrorProps,
    children,
    ...restProps
}: CodeEditorWrapperProps<DiffView>) =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? (
        <CodeMirror<DiffView> {...(codeMirrorProps as any)} {...restProps}>
            {children}
        </CodeMirror>
    ) : (
        <CodeEditor {...(codeEditorProps as any)} {...restProps}>
            {children}
        </CodeEditor>
    )

const CodeEditorLanguageChangerWrapper = () =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? null : <CodeEditor.LanguageChanger />

const CodeEditorThemeChangerWrapper = () =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? null : <CodeEditor.ThemeChanger />

const CodeEditorValidationErrorWrapper = () =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? null : <CodeEditor.ValidationError />

const CodeEditorClipboardWrapper = () =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? <CodeMirror.Clipboard /> : <CodeEditor.Clipboard />

const CodeEditorHeaderWrapper = ({ diffViewWidth, ...props }: CodeEditorHeaderProps & { diffViewWidth?: boolean }) =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? (
        <CodeMirror.Header {...props} />
    ) : (
        <CodeEditor.Header diffViewWidth={diffViewWidth} {...props} />
    )

const CodeEditorWarningWrapper = (props: CodeEditorStatusBarProps) =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? <CodeMirror.Warning {...props} /> : <CodeEditor.Warning {...props} />

const CodeEditorErrorBarWrapper = (props: CodeEditorStatusBarProps) =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? <CodeMirror.ErrorBar {...props} /> : <CodeEditor.ErrorBar {...props} />

const CodeEditorInformationWrapper = (props: CodeEditorStatusBarProps) =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? (
        <CodeMirror.Information {...props} />
    ) : (
        <CodeEditor.Information {...props} />
    )

const CodeEditorContainerWrapper = ({
    overflowHidden,
    ...props
}: {
    children: React.ReactNode
    flexExpand?: boolean
    overflowHidden?: boolean
}) =>
    window._env_.FEATURE_CODE_MIRROR_ENABLE ? (
        <CodeMirror.Container {...props} />
    ) : (
        <CodeEditor.Container overflowHidden={overflowHidden} {...props} />
    )

CodeEditorWrapper.LanguageChanger = CodeEditorLanguageChangerWrapper
CodeEditorWrapper.ThemeChanger = CodeEditorThemeChangerWrapper
CodeEditorWrapper.ValidationError = CodeEditorValidationErrorWrapper
CodeEditorWrapper.Clipboard = CodeEditorClipboardWrapper
CodeEditorWrapper.Header = CodeEditorHeaderWrapper
CodeEditorWrapper.Warning = CodeEditorWarningWrapper
CodeEditorWrapper.ErrorBar = CodeEditorErrorBarWrapper
CodeEditorWrapper.Information = CodeEditorInformationWrapper
CodeEditorWrapper.Container = CodeEditorContainerWrapper
