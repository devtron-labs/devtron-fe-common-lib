import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'
import { diffViewerStyles } from './constants'
import { DiffViewerProps, DiffViewTitleWrapperProps } from './types'

const DiffViewTitleWrapper = ({ title }: DiffViewTitleWrapperProps) => <div>{title}</div>

const DiffViewer = ({ oldValue, newValue, leftTitle, rightTitle, ...props }: DiffViewerProps) => (
    <ReactDiffViewer
        {...props}
        splitView
        oldValue={oldValue}
        newValue={newValue}
        useDarkTheme={false}
        leftTitle={leftTitle ? <DiffViewTitleWrapper title={leftTitle} /> : null}
        rightTitle={rightTitle ? <DiffViewTitleWrapper title={rightTitle} /> : null}
        compareMethod={DiffMethod.WORDS}
        styles={diffViewerStyles}
    />
)

export default DiffViewer
