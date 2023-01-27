import { TagLabelSelect } from './CustomTagSelector'

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

export interface TagType {
    key: string
    value?: string
    description?: string
    propagate: boolean
    mandatoryProjectIdsCsv?: string[]
    isInvalidKey?: boolean
    isInvalidValue?: boolean
}

export interface OptionType {
    label: string
    value: string
}

export enum TippyTheme {
    black = 'black',
    white = 'white',
}

export interface TagLabelSelectType {
    labelTags: TagType[]
    setLabelTags: (tagList: TagType[]) => void
}

export interface TagDetailType {
    index: number
    tagData: TagType
    setTagData: (index: number, tagData: TagType) => void
    removeTag: (index: number) => void
}

export interface TagLabelValueSelectorType {
  selectedTagIndex: number
  tagData: TagType
  setTagData: (index: number, tagData: TagType) => void
  tagOptions?: OptionType[]
  isRequired?: boolean
  type?: string
  placeholder?: string
}

export interface TeamList extends ResponseType {
  result: Teams[];
}

export interface Teams {
  id: number;
  name: string;
  active: boolean;
}