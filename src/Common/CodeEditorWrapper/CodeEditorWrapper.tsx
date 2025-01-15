import { createContext, useContext, useMemo } from 'react'

import { CodeEditor, CodeEditorInterface } from '../CodeEditor'
import { CodeEditor as CodeMirror, CodeEditorProps } from '../CodeMirror'

type CodeEditorWrapperProps<IsCodeMirror extends boolean = false> = {
    isCodeMirror?: IsCodeMirror
} & (IsCodeMirror extends true ? CodeEditorProps : CodeEditorInterface)

const CodeEditorWrapperContext = createContext({ isCodeMirror: false })

const Validation = (props: any) => {
    const { isCodeMirror } = useContext(CodeEditorWrapperContext)

    return isCodeMirror ? <CodeMirror.ValidationError {...props} /> : <CodeEditor.ValidationError {...props} />
}
const Clipboard = (props: any) => {
    const { isCodeMirror } = useContext(CodeEditorWrapperContext)

    return isCodeMirror ? <CodeMirror.Clipboard {...props} /> : <CodeEditor.Clipboard {...props} />
}
const Header = (props: any) => {
    const { isCodeMirror } = useContext(CodeEditorWrapperContext)

    return isCodeMirror ? <CodeMirror.Header {...props} /> : <CodeEditor.Header {...props} />
}
const Warning = (props: any) => {
    const { isCodeMirror } = useContext(CodeEditorWrapperContext)

    return isCodeMirror ? <CodeMirror.Warning {...props} /> : <CodeEditor.Warning {...props} />
}
const ErrorBar = (props: any) => {
    const { isCodeMirror } = useContext(CodeEditorWrapperContext)

    return isCodeMirror ? <CodeMirror.ErrorBar {...props} /> : <CodeEditor.ErrorBar {...props} />
}

const Information = (props: any) => {
    const { isCodeMirror } = useContext(CodeEditorWrapperContext)

    return isCodeMirror ? <CodeMirror.Information {...props} /> : <CodeEditor.Information {...props} />
}

export const CodeEditorWrapper = <IsCodeMirror extends boolean>({
    isCodeMirror,
    ...restProps
}: CodeEditorWrapperProps<IsCodeMirror>) => {
    const value = useMemo(() => ({ isCodeMirror }), [isCodeMirror])

    return (
        <CodeEditorWrapperContext.Provider value={value}>
            {isCodeMirror ? (
                <CodeMirror {...(restProps as CodeEditorProps)} />
            ) : (
                <CodeEditor {...(restProps as CodeEditorInterface)} />
            )}
        </CodeEditorWrapperContext.Provider>
    )
}

CodeEditorWrapper.ValidationError = Validation
CodeEditorWrapper.Clipboard = Clipboard
CodeEditorWrapper.Header = Header
CodeEditorWrapper.Warning = Warning
CodeEditorWrapper.ErrorBar = ErrorBar
CodeEditorWrapper.Information = Information
