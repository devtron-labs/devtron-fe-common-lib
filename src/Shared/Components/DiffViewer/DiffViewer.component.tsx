import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'
import { diffViewerStyles } from './constants'
import { DiffViewerProps, DiffViewTitleWrapperProps } from './types'

const DiffViewTitleWrapper = ({ title }: DiffViewTitleWrapperProps) => <div>{title}</div>

/**
 * Component for showing diff between two string or object.
 *
 * Note: Pass down the object as stringified for optimized performance.
 *
 * @example Usage
 *
 * ```tsx
 * <DiffViewer
 *   oldValue={oldValue}
 *   newValue={newValue}
 * />
 * ```
 *
 * @example With left/right title for lhs/rhs
 *
 * ```tsx
 * <DiffViewer
 *   oldValue={oldValue}
 *   newValue={newValue}
 *   leftTitle="Title for LHS"
 *   rightTitle={
 *     <span>Title for RHS</span>
 *   }
 * />
 * ```
 *
 * @example With custom message for folded code
 * Note: the entire section would be clickable
 *
 * ```tsx
 * <DiffViewer
 *   oldValue={oldValue}
 *   newValue={newValue}
 *   codeFoldMessageRenderer={(totalFoldedLines, leftStartLineNumber, rightStartLineNumber) => <span>Custom text</span>}
 * />
 * ```
 */
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
