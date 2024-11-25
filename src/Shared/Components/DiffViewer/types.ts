import { ReactNode } from 'react'
import { ReactDiffViewerProps } from 'react-diff-viewer-continued'

export interface DiffViewerProps
    extends Pick<ReactDiffViewerProps, 'oldValue' | 'newValue' | 'codeFoldMessageRenderer'> {
    leftTitle?: ReactDiffViewerProps['leftTitle'] | ReactNode
    rightTitle?: ReactDiffViewerProps['rightTitle'] | ReactNode
}

export interface DiffViewTitleWrapperProps {
    title: DiffViewerProps['leftTitle']
}
