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

import { CodeEditor as CodeMirror, CodeEditorHeaderProps, CodeEditorStatusBarProps } from '@Common/CodeMirror'

import { CodeEditorWrapperProps } from './types'

export const CodeEditorWrapper = <DiffView extends boolean>({
    /* eslint-disable @typescript-eslint/no-unused-vars */
    codeEditorProps,
    codeMirrorProps,
    children,
    ...restProps
}: CodeEditorWrapperProps<DiffView>) => (
    <CodeMirror<DiffView> {...(codeMirrorProps as any)} {...restProps}>
        {children}
    </CodeMirror>
)

const CodeEditorClipboardWrapper = () => <CodeMirror.Clipboard />

const CodeEditorHeaderWrapper = (props: CodeEditorHeaderProps) => <CodeMirror.Header {...props} />

const CodeEditorWarningWrapper = (props: CodeEditorStatusBarProps) => <CodeMirror.Warning {...props} />

const CodeEditorErrorBarWrapper = (props: CodeEditorStatusBarProps) => <CodeMirror.ErrorBar {...props} />

const CodeEditorInformationWrapper = (props: CodeEditorStatusBarProps) => <CodeMirror.Information {...props} />

const CodeEditorContainerWrapper = ({
    children,
    flexExpand,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    overflowHidden,
}: {
    children: React.ReactNode
    flexExpand?: boolean
    /** @deprecated this prop does not have any effect on codeEditor */
    overflowHidden?: boolean
}) => <CodeMirror.Container flexExpand={flexExpand}>{children}</CodeMirror.Container>

CodeEditorWrapper.Clipboard = CodeEditorClipboardWrapper
CodeEditorWrapper.Header = CodeEditorHeaderWrapper
CodeEditorWrapper.Warning = CodeEditorWarningWrapper
CodeEditorWrapper.ErrorBar = CodeEditorErrorBarWrapper
CodeEditorWrapper.Information = CodeEditorInformationWrapper
CodeEditorWrapper.Container = CodeEditorContainerWrapper
