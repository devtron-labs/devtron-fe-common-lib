import { ThemeType } from '@Shared/Providers'
import { CodeEditorInterface, CodeEditorThemesKeys } from './types'

export const getCodeEditorThemeFromAppTheme = (
    editorTheme: CodeEditorInterface['theme'],
    appTheme: ThemeType,
): CodeEditorInterface['theme'] => {
    if (!editorTheme) {
        const editorThemeBasedOnAppTheme =
            appTheme === ThemeType.dark ? CodeEditorThemesKeys.vsDarkDT : CodeEditorThemesKeys.vs
        return editorThemeBasedOnAppTheme
    }

    return editorTheme
}
