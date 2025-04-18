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

import { AppThemeType } from '@Shared/Providers'

import { MODES } from '../Constants'

export interface InformationBarProps {
    text: string
    className?: string
    children?: React.ReactNode
}

export enum CodeEditorThemesKeys {
    vsDarkDT = 'vs-dark--dt',
    vs = 'vs',
    networkStatusInterface = 'network-status-interface',
}

interface CodeEditorBaseInterface {
    value?: string
    lineDecorationsWidth?: number
    responseType?: string
    onChange?: (value: string, defaultValue: string) => void
    onBlur?: () => void
    onFocus?: () => void
    children?: any
    defaultValue?: string
    mode?: MODES | string
    tabSize?: number
    readOnly?: boolean
    noParsing?: boolean
    inline?: boolean
    shebang?: string | JSX.Element
    diffView?: boolean
    loading?: boolean
    customLoader?: JSX.Element
    theme?: CodeEditorThemesKeys
    original?: string
    focus?: boolean
    validatorSchema?: any
    isKubernetes?: boolean
    cleanData?: boolean
    schemaURI?: string
    /**
     * If true, disable the in-built search of monaco editor
     * @default false
     */
    disableSearch?: boolean
    /**
     * If true, Enable original value editing of monaco editor
     * @default false
     */
    originalEditable?: boolean
}

export type CodeEditorInterface = CodeEditorBaseInterface &
    (
        | {
              adjustEditorHeightToContent?: boolean
              height?: never
          }
        | {
              adjustEditorHeightToContent?: never
              height?: number | string
          }
    )

export interface CodeEditorHeaderInterface {
    children?: any
    className?: string
    hideDefaultSplitHeader?: boolean
}
export interface CodeEditorComposition {
    Header?: React.FC<any>
    LanguageChanger?: React.FC<any>
    ThemeChanger?: React.FC<any>
    ValidationError?: React.FC<any>
    Clipboard?: React.FC<any>
    Warning?: React.FC<InformationBarProps>
    ErrorBar?: React.FC<InformationBarProps>
    Information?: React.FC<InformationBarProps>
    Container?: React.FC<{ children: React.ReactNode; flexExpand?: boolean; overflowHidden?: boolean }>
}
export interface CodeEditorHeaderComposition {
    LanguageChanger?: React.FC<any>
    ThemeChanger?: React.FC<any>
    ValidationError?: React.FC<any>
    Clipboard?: React.FC<any>
}

type ActionTypes = 'changeLanguage' | 'setDiff' | 'setTheme' | 'setCode' | 'setDefaultCode' | 'setHeight'

export interface Action {
    type: ActionTypes
    value: any
}

export interface CodeEditorInitialValueType extends Pick<CodeEditorBaseInterface, 'theme'> {
    mode: string
    diffView: boolean
    value: string
    defaultValue: string
    noParsing?: boolean
    tabSize: number
    appTheme: AppThemeType
}

export interface CodeEditorState {
    mode: MODES
    diffMode: boolean
    theme: CodeEditorThemesKeys
    code: string
    defaultCode: string
    noParsing: boolean
}

export enum CodeEditorActionTypes {
    reInit = 'reInit',
    submitLoading = 'submitLoading',
    overrideLoading = 'overrideLoading',
    success = 'success',
}
