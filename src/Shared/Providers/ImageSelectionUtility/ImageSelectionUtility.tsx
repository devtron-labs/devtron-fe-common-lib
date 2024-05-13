import { createContext, useContext, useMemo } from 'react'
import { ImageSelectionUtilityContextType, ImageSelectionUtilityProviderProps } from './types'

export const ImageSelectionUtilityContext = createContext<ImageSelectionUtilityContextType>(null)
export const useImageSelectionUtilityContext = () => {
    const context = useContext<ImageSelectionUtilityContextType>(ImageSelectionUtilityContext)
    if (!context) {
        throw new Error('useImageSelectionUtilityContext must be used within ImageSelectionUtilityProvider')
    }

    return context
}

export const ImageSelectionUtilityProvider = ({ children, value }: ImageSelectionUtilityProviderProps) => {
    const memoizedValue = useMemo(() => value, [value])

    return (
        <ImageSelectionUtilityContext.Provider value={memoizedValue}>{children}</ImageSelectionUtilityContext.Provider>
    )
}
