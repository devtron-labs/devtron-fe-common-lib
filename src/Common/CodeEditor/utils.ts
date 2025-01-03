import { ThemeType } from '@Shared/Providers'
import { CodeEditorInterface, CodeEditorThemesKeys } from './types'

export const getCodeEditorThemeFromAppTheme = (
    editorTheme: CodeEditorInterface['theme'],
    appTheme: ThemeType,
): CodeEditorInterface['theme'] => {
    const editorThemeBasedOnAppTheme =
        appTheme === ThemeType.dark ? CodeEditorThemesKeys.vsDarkDT : CodeEditorThemesKeys.vs

    switch (editorTheme) {
        case CodeEditorThemesKeys.vs:
        case CodeEditorThemesKeys.vsDarkDT:
            return editorThemeBasedOnAppTheme
        default:
            return editorTheme || editorThemeBasedOnAppTheme
    }
}
