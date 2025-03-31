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
    isCodeMirrorEnabled() ? (
        <CodeMirror<DiffView> {...(codeMirrorProps as any)} {...restProps}>
            {children}
        </CodeMirror>
    ) : (
        <CodeEditor {...(codeEditorProps as any)} {...restProps}>
            {children}
        </CodeEditor>
    )

const CodeEditorLanguageChangerWrapper = () => (isCodeMirrorEnabled() ? null : <CodeEditor.LanguageChanger />)

const CodeEditorThemeChangerWrapper = () => (isCodeMirrorEnabled() ? null : <CodeEditor.ThemeChanger />)

const CodeEditorValidationErrorWrapper = () => (isCodeMirrorEnabled() ? null : <CodeEditor.ValidationError />)

const CodeEditorClipboardWrapper = () => (isCodeMirrorEnabled() ? <CodeMirror.Clipboard /> : <CodeEditor.Clipboard />)

const CodeEditorHeaderWrapper = (props: CodeEditorHeaderProps) =>
    isCodeMirrorEnabled() ? <CodeMirror.Header {...props} /> : <CodeEditor.Header {...props} />

const CodeEditorWarningWrapper = (props: CodeEditorStatusBarProps) =>
    isCodeMirrorEnabled() ? <CodeMirror.Warning {...props} /> : <CodeEditor.Warning {...props} />

const CodeEditorErrorBarWrapper = (props: CodeEditorStatusBarProps) =>
    isCodeMirrorEnabled() ? <CodeMirror.ErrorBar {...props} /> : <CodeEditor.ErrorBar {...props} />

const CodeEditorInformationWrapper = (props: CodeEditorStatusBarProps) =>
    isCodeMirrorEnabled() ? <CodeMirror.Information {...props} /> : <CodeEditor.Information {...props} />

const CodeEditorContainerWrapper = ({
    overflowHidden,
    ...props
}: {
    children: React.ReactNode
    flexExpand?: boolean
    overflowHidden?: boolean
}) =>
    isCodeMirrorEnabled() ? (
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
