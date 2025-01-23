import { githubDarkInit, githubLightStyle, githubDarkStyle, githubLightInit } from '@uiw/codemirror-theme-github'

export const getCodeEditorTheme = (isDark: boolean) => {
    const themeInit = isDark ? githubDarkInit : githubLightInit
    const styles = isDark ? githubDarkStyle : githubLightStyle

    return themeInit({
        settings: {
            fontSize: '14px',
            fontFamily: 'Inconsolata, monospace',
            background: 'var(--bg-code-editor-base)',
            foreground: isDark ? 'var(--white)' : 'var(--black)',
            caret: isDark ? 'var(--white)' : 'var(--black)',
            gutterBackground: 'var(--bg-code-editor-base-gutter)',
            gutterForeground: isDark ? 'var(--white)' : 'var(--black)',
            gutterBorder: 'transparent',
            lineHighlight: 'var(--active-line)',
        },
        styles,
    })
}
