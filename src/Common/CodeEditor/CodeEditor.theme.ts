import { githubDarkInit, githubLightStyle, githubDarkStyle, githubLightInit } from '@uiw/codemirror-theme-github'

import { AppThemeType } from '@Shared/Providers'

export const codeEditorTheme = (appTheme: AppThemeType) => {
    const themeInit = appTheme === AppThemeType.light ? githubLightInit : githubDarkInit
    const styles = appTheme === AppThemeType.light ? githubLightStyle : githubDarkStyle

    return themeInit({
        settings: {
            fontSize: '14px',
            fontFamily: 'Inconsolata, monospace',
            background: 'var(--bg-code-editor)',
            foreground: 'var(--N900)',
            caret: 'var(--N900)',
            gutterBackground: 'var(--bg-tertiary)',
            gutterForeground: 'var(--N500)',
            gutterBorder: 'transparent',
        },
        styles,
    })
}
