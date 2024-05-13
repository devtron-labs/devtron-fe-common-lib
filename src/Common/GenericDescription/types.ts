export interface GenericDescriptionProps {
    text?: string
    updatedBy?: string
    updatedOn?: string
    isDescriptionPreview: boolean
    updateDescription: (string) => Promise<void>
    title: string
    tabIndex?: number
    minEditorHeight?: number
}

export enum MDEditorSelectedTabType {
    WRITE = 'write',
    PREVIEW = 'preview',
}
