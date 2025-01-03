import { ThemeType } from '@Shared/Providers'
import { CodeEditorThemesKeys } from './types'

export const getCodeEditorThemeFromAppTheme = (
    editorTheme: CodeEditorThemesKeys,
    appTheme: ThemeType,
): CodeEditorThemesKeys => {
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
