import { AppThemeType } from '@Shared/Providers'
import { CodeEditorInterface, CodeEditorThemesKeys } from './types'

export const getCodeEditorThemeFromAppTheme = (
    editorTheme: CodeEditorInterface['theme'],
    appTheme: AppThemeType,
): CodeEditorInterface['theme'] => {
    if (!editorTheme) {
        const editorThemeBasedOnAppTheme =
            appTheme === AppThemeType.dark ? CodeEditorThemesKeys.vsDarkDT : CodeEditorThemesKeys.vs
        return editorThemeBasedOnAppTheme
    }

    return editorTheme
}
