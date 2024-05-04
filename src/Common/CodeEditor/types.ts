import { MODES } from '../Constants'

export interface InformationBarProps {
    text: string
    className?: string
    children?: React.ReactNode
}

export interface CodeEditorInterface {
    value?: string
    lineDecorationsWidth?: number
    responseType?: string
    onChange?: (string) => void
    onBlur?: () => void
    onFocus?: () => void
    children?: any
    defaultValue?: string
    mode?: MODES | string
    tabSize?: number
    readOnly?: boolean
    noParsing?: boolean
    minHeight?: number
    maxHeight?: number
    inline?: boolean
    height?: number | string
    shebang?: string | JSX.Element
    diffView?: boolean
    loading?: boolean
    customLoader?: JSX.Element
    theme?: string
    original?: string
    focus?: boolean
    validatorSchema?: any
    isKubernetes?: boolean
    cleanData?: boolean
    chartVersion?: any
}

export interface CodeEditorHeaderInterface {
    children?: any
    className?: string
    hideDefaultSplitHeader?: boolean
}
export interface CodeEditorComposition {
    Header?: React.FC<any>
    LanguageChanger?: React.FC<any>
    ThemeChanger?: React.FC<any>
    ValidationError?: React.FC<any>
    Clipboard?: React.FC<any>
    Warning?: React.FC<InformationBarProps>
    ErrorBar?: React.FC<InformationBarProps>
    Information?: React.FC<InformationBarProps>
}
export interface CodeEditorHeaderComposition {
    LanguageChanger?: React.FC<any>
    ThemeChanger?: React.FC<any>
    ValidationError?: React.FC<any>
    Clipboard?: React.FC<any>
}

export type ActionTypes = 'changeLanguage' | 'setDiff' | 'setTheme' | 'setCode' | 'setHeight'

export interface Action {
    type: ActionTypes
    value: any
}

export enum CodeEditorThemesKeys {
    vsDarkDT = 'vs-dark--dt',
    deleteDraft = 'delete-draft',
    unpublished = 'unpublished',
    vs = 'vs',
}

export interface CodeEditorState {
    mode: MODES
    diffMode: boolean
    theme: CodeEditorThemesKeys
    code: string
    noParsing: boolean
}

export enum CodeEditorActionTypes {
    reInit = 'reInit',
    submitLoading = 'submitLoading',
    overrideLoading = 'overrideLoading',
    success = 'success',
}
