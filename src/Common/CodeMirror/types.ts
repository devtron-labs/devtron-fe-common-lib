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
import { ReactCodeMirrorProps } from '@uiw/react-codemirror'

import { MODES } from '@Common/Constants'
import { AppThemeType } from '@Shared/Providers'

// TODO: Remove this after theming is done for code-mirror
export enum CodeEditorThemesKeys {
    vsDarkDT = 'vs-dark--dt',
    vs = 'vs',
    networkStatusInterface = 'network-status-interface',
}

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

export interface CodeEditorProps extends Pick<ReactCodeMirrorProps, 'value' | 'onBlur' | 'onFocus' | 'autoFocus'> {
    /**
     * @default 450
     */
    height?: 'auto' | '100%' | number
    onChange?: (value: string) => void
    children?: ReactNode
    defaultValue?: string
    mode?: MODES
    tabSize?: number
    readOnly?: boolean
    noParsing?: boolean
    shebang?: string | JSX.Element
    diffView?: boolean
    loading?: boolean
    customLoader?: JSX.Element
    theme?: CodeEditorThemesKeys
    original?: string
    validatorSchema?: JSONSchema7
    cleanData?: boolean
    schemaURI?: string
    /**
     * If true, disable the in-built search of monaco editor
     * @default false
     */
    disableSearch?: boolean
}

// CODE-MIRROR TYPES
export type HoverTexts = {
    message: string
    typeInfo: string
}

// REDUCER TYPES
export type CodeEditorActionTypes = 'setDiff' | 'setTheme' | 'setCode' | 'setDefaultCode'

export interface CodeEditorAction {
    type: CodeEditorActionTypes
    value: any
}

export interface CodeEditorInitialValueType
    extends Pick<CodeEditorProps, 'theme' | 'value' | 'noParsing' | 'tabSize' | 'mode'> {
    defaultValue: string
    appTheme: AppThemeType
    diffView: boolean
}

export interface CodeEditorState extends Pick<CodeEditorProps, 'noParsing'> {
    theme: CodeEditorThemesKeys
    code: string
    defaultCode: string
    diffMode: boolean
}

export interface CodeEditorContextProps extends Pick<CodeEditorProps, 'readOnly' | 'height'> {
    state: CodeEditorState
    dispatch: Dispatch<CodeEditorAction>
    error: boolean
}
