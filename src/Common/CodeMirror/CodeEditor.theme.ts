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

import { EditorView } from '@uiw/react-codemirror'
import { githubDarkInit, githubLightInit } from '@uiw/codemirror-theme-github'
import { tags as t } from '@lezer/highlight'

export const getCodeEditorTheme = (isDark: boolean) => {
    const themeInit = isDark ? githubDarkInit : githubLightInit
    const styles = isDark
        ? [
              { tag: [t.comment], color: '#8b949e' },
              { tag: [t.variableName, t.attributeName], color: '#79c0ff' },
              { tag: [t.string], color: '#a5d6ff' },
              { tag: [t.number, t.bool], color: '#ffab70' },
              { tag: [t.keyword], color: '#ff7b72' },
              { tag: [t.operator, t.punctuation], color: '#8b949e' },
              { tag: [t.meta], color: '#d2a8ff' },
          ]
        : [
              { tag: [t.comment], color: '#6a737d' },
              { tag: [t.variableName, t.attributeName], color: '#005cc5' },
              { tag: [t.string], color: '#032f62' },
              { tag: [t.number, t.bool], color: '#e36209' },
              { tag: [t.keyword], color: '#d73a49' },
              { tag: [t.operator, t.punctuation], color: '#6a737d' },
              { tag: [t.meta], color: '#6f42c1' },
          ]

    return {
        themeExtension: EditorView.theme({
            '.cm-highlight-number': {
                color: isDark ? '#ffab70' : '#e36209',
            },
            '.cm-highlight-bool': {
                color: isDark ? '#ffab70' : '#e36209',
            },
        }),
        codeEditorTheme: themeInit({
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
            theme: isDark ? 'dark' : 'light',
        }),
    }
}
