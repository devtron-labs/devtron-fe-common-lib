import { createContext, useContext } from 'react'
import { MainContext, MainContextProviderProps } from './types'

const mainContext = createContext<MainContext>(null)

export const useMainContext = () => {
    const data = useContext(mainContext)

    if (!data) {
        throw new Error('Please wrap with MainContextProvider')
    }

    return data
}

export const MainContextProvider = ({ children, value }: MainContextProviderProps) => (
    <mainContext.Provider value={value}>{children}</mainContext.Provider>
)
