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
              {
                  tag: [t.className, t.propertyName],
                  color: 'var(--code-editor-property-name)',
              },
              {
                  tag: [t.variableName, t.attributeName, t.number, t.operator],
                  color: 'var(--code-editor-number)',
              },
              {
                  tag: [t.heading, t.strong],
                  color: 'var(--code-editor-property-name)',
                  fontWeight: 'bold',
              },
              {
                  tag: [t.emphasis],
                  color: 'var(--code-editor-property-name)',
                  fontStyle: 'italic',
              },
              {
                  tag: [t.atom, t.bool, t.special(t.variableName)],
                  color: 'var(--code-editor-boolean)',
              },
          ]
        : [
              {
                  tag: [t.className, t.propertyName],
                  color: 'var(--code-editor-property-name)',
              },
              {
                  tag: [t.variableName, t.attributeName, t.number, t.operator],
                  color: 'var(--code-editor-number)',
              },
              {
                  tag: [t.atom, t.bool, t.special(t.variableName)],
                  color: 'var(--code-editor-boolean)',
              },
          ]

    return {
        themeExtension: EditorView.theme({
            '.cm-highlight-number': {
                color: 'var(--code-editor-number)',
            },
            '.cm-highlight-bool': {
                color: 'var(--code-editor-boolean)',
            },
        }),
        codeEditorTheme: themeInit({
            settings: {
                fontSize: '15px',
                fontFamily: 'Inconsolata, monospace',
                background: 'var(--bg-code-editor-base)',
                foreground: 'var(--fg-code-editor)',
                caret: 'var(--N900)',
                gutterBackground: 'var(--bg-code-editor-base-gutter)',
                gutterForeground: 'var(--N500)',
                gutterBorder: 'transparent',
                lineHighlight: 'var(--active-line)',
            },
            styles,
            theme: isDark ? 'dark' : 'light',
        }),
    }
}
