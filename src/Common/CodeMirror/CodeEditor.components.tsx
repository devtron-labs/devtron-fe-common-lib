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

import { ReactNode } from 'react'

import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'
import { ReactComponent as Info } from '@Icons/ic-info-filled.svg'
import { ReactComponent as ErrorIcon } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICCompare } from '@Icons/ic-compare.svg'
import { ClipboardButton } from '@Common/ClipboardButton'
import { getComponentSpecificThemeClass } from '@Shared/Providers'

import { useCodeEditorContext } from './CodeEditor.context'
import { CodeEditorHeaderProps, CodeEditorStatusBarProps } from './types'

const SplitPane = () => {
    const { diffMode, setDiffMode, readOnly } = useCodeEditorContext()

    const handleToggle = () => {
        if (readOnly) {
            return
        }
        setDiffMode(!diffMode)
    }

    return (
        <div className="code-editor__split-pane flex pointer cn-7 fcn-7 ml-auto" onClick={handleToggle}>
            <ICCompare className="icon-dim-20 mr-4" />
            {diffMode ? 'Hide comparison' : 'Compare with default'}
        </div>
    )
}

export const Header = ({ children, className, hideDefaultSplitHeader }: CodeEditorHeaderProps) => {
    const { diffMode, lhsValue, hasCodeEditorContainer, theme } = useCodeEditorContext()

    return (
        <div className={`${getComponentSpecificThemeClass(theme)} flexbox w-100 border__primary--bottom`}>
            <div
                data-code-editor-header
                className={`${hasCodeEditorContainer ? 'dc__top-radius-4' : ''} code-editor__header flex-grow-1 bg__secondary ${className || 'px-16 pt-6 pb-5'} ${diffMode ? 'dc__grid-half vertical-divider' : ''}`}
            >
                {children}
                {!hideDefaultSplitHeader && lhsValue && <SplitPane />}
            </div>
            {diffMode ? <div className="bg__secondary px-5 dc__align-self-stretch" /> : null}
        </div>
    )
}

export const Warning = ({ className, text, children }: CodeEditorStatusBarProps) => (
    <div
        className={`code-editor__warning fs-12 fw-4 lh-16 cn-9 py-8 px-16 bcy-1 dc__border-bottom-y2 dc__height-auto ${className || ''}`}
    >
        <ICWarningY5 className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const ErrorBar = ({ className, text, children }: CodeEditorStatusBarProps) => (
    <div className={`code-editor__error fs-12 fw-4 lh-16 py-8 px-16 bco-1 co-5 dc__border-bottom ${className || ''}`}>
        <ErrorIcon className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const Information = ({ className, children, text }: CodeEditorStatusBarProps) => (
    <div
        className={`code-editor__information fs-12 fw-4 lh-16 cn-9 py-8 px-16 bcb-1 dc__border-bottom dc__height-auto ${className || ''}`}
    >
        <Info className="code-editor__status-info-icon" />
        {text}
        {children}
    </div>
)

export const Clipboard = () => {
    const { value } = useCodeEditorContext()

    return <ClipboardButton content={value} iconSize={16} />
}

export const Container = ({ children, flexExpand }: { children: ReactNode; flexExpand?: boolean }) => (
    <div
        data-code-editor-container
        className={`code-editor__container w-100 dc__border br-4
        ${flexExpand ? 'flex-grow-1 flexbox-col' : ''}`}
    >
        {children}
    </div>
)
