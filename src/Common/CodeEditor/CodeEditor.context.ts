import { createContext, useContext } from 'react'

import { CodeEditorContextProps } from './types'

export const CodeEditorContext = createContext<CodeEditorContextProps>(null)

export const useCodeEditorContext = () => {
    const context = useContext(CodeEditorContext)
    if (!context) {
        throw new Error(`cannot be rendered outside the component`)
    }
    return context
}
