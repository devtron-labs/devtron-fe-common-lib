export interface GenericDescriptionProps {
    text?: string
    updatedBy?: string
    updatedOn?: string
    isDescriptionPreview: boolean
    updateDescription: (string) => void
    title: string
    tabIndex?: number
}

export enum MDEditorSelectedTabType {
    WRITE = 'write',
    PREVIEW = 'preview',
}
