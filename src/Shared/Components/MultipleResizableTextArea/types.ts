import { DetailedHTMLProps, MutableRefObject, TextareaHTMLAttributes } from 'react'

export interface MultipleResizableTextAreaProps
    extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    minHeight?: number
    maxHeight?: number
    dataTestId?: string
    refVar?: MutableRefObject<HTMLTextAreaElement>
    dependentRefs?: Record<string | number, MutableRefObject<HTMLTextAreaElement>>
    disableOnBlurResizeToMinHeight?: boolean
}
