import { KEY_VALUE } from './Constants'

export interface ResponseType {
    code: number
    status: string
    result?: any
    errors?: any
}

export interface APIOptions {
    timeout?: number
    signal?: AbortSignal
    preventAutoLogout?: boolean
}

export interface OptionType {
    label: string
    value: string
}

export enum TippyTheme {
    black = 'black',
    white = 'white',
}

export interface TagType {
    id?: number
    key: string
    value?: string
    description?: string
    propagate: boolean
    mandatoryProjectIdsCsv?: string[]
    isInvalidKey?: boolean
    isInvalidValue?: boolean
}

export interface TagErrorType {
    isValid: boolean
    messages: string[]
}
export interface TagLabelSelectType {
    isCreateApp?: boolean
    labelTags: TagType[]
    setLabelTags: (tagList: TagType[]) => void
    tabIndex?: number
}

export interface TagDetailType {
    index: number
    tagData: TagType
    setTagData: (index: number, tagData: TagType) => void
    removeTag: (index: number) => void
    tabIndex?: number
}

export interface TagLabelValueSelectorType {
    selectedTagIndex: number
    tagData: TagType
    setTagData: (index: number, tagData: TagType) => void
    tagOptions?: OptionType[]
    isRequired?: boolean
    tagInputType?: KEY_VALUE
    placeholder?: string
    tabIndex?: number
    refVar?: React.MutableRefObject<HTMLTextAreaElement>
    dependentRef?: React.MutableRefObject<HTMLTextAreaElement>
}

export interface ResizableTagTextAreaProps {
    className?: string
    minHeight?: number
    maxHeight?: number
    value?: string
    onChange?: (e) => void
    onBlur?: (e) => void
    onFocus?: (e) => void
    placeholder?: string
    tabIndex?: number
    refVar?: React.MutableRefObject<HTMLTextAreaElement>
    dependentRef?: React.MutableRefObject<HTMLTextAreaElement>
}

export interface TeamList extends ResponseType {
    result: Teams[]
}

export interface Teams {
    id: number
    name: string
    active: boolean
}
