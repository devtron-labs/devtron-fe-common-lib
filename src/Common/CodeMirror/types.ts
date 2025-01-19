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

import { Dispatch, ReactNode } from 'react'
import { JSONSchema7 } from 'json-schema'
import { EditorView, ReactCodeMirrorProps } from '@uiw/react-codemirror'
// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchQuery } from '@codemirror/search'

import { MODES } from '@Common/Constants'
import { Never } from '@Shared/types'

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

export type CodeEditorProps = {
    /**
     * @default 450
     */
    height?: 'auto' | '100%' | number
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
     * If true, disable the in-built search of monaco editor
     * @default false
     */
    disableSearch?: boolean
} & (
    | ({
          diffView?: true
          onOriginalValueChange?: (originalValue: string) => void
          onModifiedValueChange?: (modifiedValue: string) => void
          originalValue?: ReactCodeMirrorProps['value']
          modifiedValue?: ReactCodeMirrorProps['value']
          value?: never
          onChange?: never
          shebang?: never
          validatorSchema?: never
          schemaURI?: never
      } & Never<Pick<ReactCodeMirrorProps, 'onBlur' | 'onFocus' | 'autoFocus'>>)
    | ({
          diffView?: false
          value?: ReactCodeMirrorProps['value']
          onChange?: (value: string) => void
          shebang?: string | JSX.Element
          validatorSchema?: JSONSchema7
          schemaURI?: string
          originalValue?: never
          modifiedValue?: never
          onOriginalValueChange?: never
          onModifiedValueChange?: never
      } & Pick<ReactCodeMirrorProps, 'onBlur' | 'onFocus' | 'autoFocus'>)
)

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
    defaultQuery: SearchQuery
}

// REDUCER TYPES
export type CodeEditorActionTypes = 'setDiff' | 'setCode' | 'setLhsCode'

export interface CodeEditorAction {
    type: CodeEditorActionTypes
    value: any
}

export interface CodeEditorInitialValueType extends Pick<CodeEditorProps, 'value' | 'noParsing' | 'tabSize' | 'mode'> {
    lhsValue: string
    diffView: boolean
}

export interface CodeEditorState extends Pick<CodeEditorProps, 'noParsing'> {
    code: string
    lhsCode: string
    diffMode: boolean
}

export interface CodeEditorContextProps extends Pick<CodeEditorProps, 'readOnly' | 'height'> {
    state: CodeEditorState
    dispatch: Dispatch<CodeEditorAction>
    error: boolean
}
