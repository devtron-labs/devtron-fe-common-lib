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
