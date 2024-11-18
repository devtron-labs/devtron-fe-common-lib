import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'
import { diffViewerStyles } from './constants'
import { DiffViewerProps } from './types'

const DiffViewer = ({ oldValue, newValue, leftTitle, rightTitle }: DiffViewerProps) => (
    <ReactDiffViewer
        splitView
        oldValue={oldValue}
        newValue={newValue}
        useDarkTheme={false}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        compareMethod={DiffMethod.WORDS}
        styles={diffViewerStyles}
    />
)

export default DiffViewer
