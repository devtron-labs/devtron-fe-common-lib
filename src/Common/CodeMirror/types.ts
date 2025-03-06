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

import { Dispatch, FunctionComponent, Key, MutableRefObject, ReactNode, SetStateAction, SVGProps } from 'react'
import { JSONSchema7 } from 'json-schema'
import { EditorView, ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { CodeMirrorMergeRef } from 'react-codemirror-merge'
import { SearchQuery } from '@codemirror/search'

import { MODES } from '@Common/Constants'
import { Never } from '@Shared/types'
import { AppThemeType } from '@Shared/Providers'

// COMPONENT PROPS
export interface CodeEditorStatusBarProps {
    text: string
    className?: string
    children?: ReactNode
}

export interface CodeEditorHeaderProps {
    className?: string
    hideDefaultSplitHeader?: boolean
    children?: ReactNode
}

type CodeEditorBaseProps = Partial<Pick<ReactCodeMirrorProps, 'onBlur' | 'onFocus' | 'autoFocus'>> & {
    value?: ReactCodeMirrorProps['value']
    onChange?: (value: string) => void
    shebang?: string | JSX.Element
    validatorSchema?: JSONSchema7
    schemaURI?: string
}

type CodeEditorDiffBaseProps = {
    onOriginalValueChange?: (originalValue: string) => void
    onModifiedValueChange?: (modifiedValue: string) => void
    originalValue?: ReactCodeMirrorProps['value']
    modifiedValue?: ReactCodeMirrorProps['value']
    isOriginalModifiable?: boolean
}

type CodeEditorPropsBasedOnDiffView<DiffView extends boolean> = DiffView extends true
    ? CodeEditorDiffBaseProps & Never<CodeEditorBaseProps>
    : CodeEditorBaseProps & Never<CodeEditorDiffBaseProps>

export type CodeEditorProps<DiffView extends boolean = false> = {
    /**
     * @default 450
     */
    height?: 'auto' | '100%' | 'fitToParent' | number
    children?: ReactNode
    mode?: MODES
    tabSize?: number
    readOnly?: boolean
    placeholder?: string
    noParsing?: boolean
    loading?: boolean
    customLoader?: JSX.Element
    cleanData?: boolean
    /**
     * If true, disables the in-built search
     * @default false
     */
    disableSearch?: boolean
    diffView?: DiffView
    theme?: AppThemeType
    showDiffMinimap?: boolean
} & CodeEditorPropsBasedOnDiffView<DiffView>

export interface GetCodeEditorHeightReturnType {
    codeEditorParentClassName: string
    codeEditorClassName: string
    codeEditorHeight: string
}

// CODE-MIRROR TYPES
export type HoverTexts = {
    message: string
    typeInfo: string
}

export type FindReplaceQuery = Partial<
    Pick<SearchQuery, 'search' | 'wholeWord' | 'regexp' | 'replace' | 'caseSensitive'>
>

export interface FindReplaceProps {
    view: EditorView
    /** Default value for Search Query state. */
    defaultQuery: SearchQuery
    /** Default value for showReplaceField state. */
    defaultShowReplace: boolean
}

export interface CodeEditorContextProps extends Required<Pick<CodeEditorProps, 'readOnly' | 'theme'>> {
    diffMode: CodeEditorProps<boolean>['diffView']
    value: CodeEditorProps['value']
    lhsValue: CodeEditorProps<true>['originalValue']
    hasCodeEditorContainer: boolean
    setDiffMode: Dispatch<SetStateAction<CodeEditorProps<boolean>['diffView']>>
}

// EXTENSION PROPS
export interface FindReplaceToggleButtonProps {
    isChecked: boolean
    Icon: FunctionComponent<SVGProps<SVGSVGElement>>
    onChange: (isChecked: boolean) => void
    iconType?: 'stroke' | 'fill'
    tooltipText: string
}

// CODE-EDITOR RENDERER PROPS
export type CodeEditorRendererProps = Required<
    Pick<
        CodeEditorProps,
        | 'theme'
        | 'loading'
        | 'customLoader'
        | 'height'
        | 'readOnly'
        | 'shebang'
        | 'placeholder'
        | 'onBlur'
        | 'onFocus'
        | 'autoFocus'
        | 'showDiffMinimap'
    >
> &
    Required<Pick<CodeEditorDiffBaseProps, 'isOriginalModifiable'>> & {
        codemirrorMergeKey: Key
        codeMirrorParentDivRef: MutableRefObject<HTMLDivElement>
        codeEditorTheme: ReactCodeMirrorProps['theme']
        handleOnChange: ReactCodeMirrorProps['onChange']
        handleLhsOnChange: ReactCodeMirrorProps['onChange']
        originalViewExtensions: ReactCodeMirrorProps['extensions']
        modifiedViewExtensions: ReactCodeMirrorProps['extensions']
        extensions: ReactCodeMirrorProps['extensions']
        diffMinimapExtensions: ReactCodeMirrorProps['extensions']
    }

export interface DiffMinimapProps
    extends Pick<CodeEditorRendererProps, 'diffMinimapExtensions' | 'codeEditorTheme' | 'theme'> {
    view: CodeMirrorMergeRef['view']
}
