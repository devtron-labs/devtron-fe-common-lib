import { CodeEditorInterface } from '@Common/CodeEditor'
import { CodeEditorProps } from '@Common/CodeMirror'

export type CodeEditorWrapperProps<DiffView extends boolean> = Pick<
    CodeEditorProps<DiffView>,
    | 'mode'
    | 'tabSize'
    | 'readOnly'
    | 'placeholder'
    | 'noParsing'
    | 'loading'
    | 'customLoader'
    | 'cleanData'
    | 'disableSearch'
    | 'children'
> & {
    diffView?: DiffView
    codeEditorProps: Omit<
        CodeEditorInterface,
        | 'mode'
        | 'tabSize'
        | 'readOnly'
        | 'placeholder'
        | 'noParsing'
        | 'loading'
        | 'customLoader'
        | 'cleanData'
        | 'disableSearch'
        | 'children'
    >
    codeMirrorProps: Omit<
        CodeEditorProps<DiffView>,
        | 'mode'
        | 'tabSize'
        | 'readOnly'
        | 'placeholder'
        | 'noParsing'
        | 'loading'
        | 'customLoader'
        | 'cleanData'
        | 'disableSearch'
        | 'children'
    >
}
