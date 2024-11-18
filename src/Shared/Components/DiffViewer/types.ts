import { ReactDiffViewerProps } from 'react-diff-viewer-continued'

export interface DiffViewerProps
    extends Pick<ReactDiffViewerProps, 'oldValue' | 'newValue' | 'leftTitle' | 'rightTitle'> {}
