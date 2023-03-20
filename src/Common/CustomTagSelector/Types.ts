import { KEY_VALUE } from '../Constants'
import { OptionType } from '../Types'

export interface TagType {
    id?: number
    key: string
    value?: string
    description?: string
    propagate: boolean
    mandatoryProjectIdsCsv?: string
    isInvalidKey?: boolean
    isInvalidValue?: boolean
    isSuggested?: boolean
    isPropagateDisabled?: boolean
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
    selectedProjectId?: number
    suggestedTagsOptions?: OptionType[]
}

export interface TagDetailType {
    index: number
    tagData: TagType
    setTagData: (index: number, tagData: TagType) => void
    removeTag?: (index: number) => void
    tabIndex?: number
    suggestedTagsOptions?: OptionType[]
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
