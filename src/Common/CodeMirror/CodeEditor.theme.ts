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

import { githubDarkInit, githubLightStyle, githubDarkStyle, githubLightInit } from '@uiw/codemirror-theme-github'

export const getCodeEditorTheme = (isDark: boolean) => {
    const themeInit = isDark ? githubDarkInit : githubLightInit
    const styles = isDark ? githubDarkStyle : githubLightStyle

    return themeInit({
        settings: {
            fontSize: '14px',
            fontFamily: 'Inconsolata, monospace',
            background: 'var(--bg-code-editor-base)',
            foreground: 'var(--N900)',
            caret: 'var(--N900)',
            gutterBackground: 'var(--bg-code-editor-base-gutter)',
            gutterForeground: 'var(--N900)',
            gutterBorder: 'transparent',
            lineHighlight: 'var(--active-line)',
        },
        styles,
    })
}
