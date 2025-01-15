import { AppThemeType } from '@Shared/Providers'

import { CodeEditorProps, CodeEditorThemesKeys } from './types'

export const getCodeEditorThemeFromAppTheme = (
    editorTheme: CodeEditorProps['theme'],
    appTheme: AppThemeType,
): CodeEditorProps['theme'] => {
    if (!editorTheme) {
        const editorThemeBasedOnAppTheme =
            appTheme === AppThemeType.dark ? CodeEditorThemesKeys.vsDarkDT : CodeEditorThemesKeys.vs
        return editorThemeBasedOnAppTheme
    }

    return editorTheme
}
