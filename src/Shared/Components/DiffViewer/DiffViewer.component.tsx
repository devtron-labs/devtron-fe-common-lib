/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
