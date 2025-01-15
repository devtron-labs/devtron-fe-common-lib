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

import YAML from 'yaml'

import { noop, YAMLStringify } from '@Common/Helper'
import { MODES } from '@Common/Constants'

import { CodeEditorAction, CodeEditorInitialValueType, CodeEditorState } from './types'
import { getCodeEditorThemeFromAppTheme } from './utils'

export const CodeEditorReducer = (state: CodeEditorState, action: CodeEditorAction): CodeEditorState => {
    switch (action.type) {
        case 'setDiff':
            return { ...state, diffMode: action.value }
        case 'setTheme':
            return { ...state, theme: action.value }
        case 'setCode':
            return { ...state, code: action.value }
        case 'setDefaultCode':
            return { ...state, defaultCode: action.value }
        default:
            return state
    }
}

export const parseValueToCode = (value: string, mode: string, tabSize: number) => {
    let obj = null

    try {
        obj = JSON.parse(value)
    } catch {
        try {
            obj = YAML.parse(value)
        } catch {
            noop()
        }
    }

    let final = value

    if (obj) {
        switch (mode) {
            case MODES.JSON:
                final = JSON.stringify(obj, null, tabSize)
                break
            case MODES.YAML:
                final = YAMLStringify(obj)
                break
            default:
                break
        }
    }

    return final
}

export const initialState = ({
    mode,
    theme,
    value,
    defaultValue,
    diffView,
    noParsing,
    tabSize,
    appTheme,
}: CodeEditorInitialValueType): CodeEditorState => ({
    theme: getCodeEditorThemeFromAppTheme(theme, appTheme),
    code: noParsing ? value : parseValueToCode(value, mode, tabSize),
    defaultCode: noParsing ? defaultValue : parseValueToCode(defaultValue, mode, tabSize),
    diffMode: diffView,
    noParsing: [MODES.JSON, MODES.YAML].includes(mode) ? noParsing : true,
})
