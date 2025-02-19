import { createContext, PropsWithChildren, useContext, useMemo, useRef, useState } from 'react'
import { ConfirmationModalContextType } from './types'

export const ConfirmationModalContext = createContext<ConfirmationModalContextType>(null)

export const ConfirmationModalProvider = ({ children }: PropsWithChildren<{}>) => {
    const settersRef = useRef<ConfirmationModalContextType['settersRef']['current']>(null)
    const [modalKey, setModalKey] = useState('')

    const value = useMemo(() => ({ modalKey, setModalKey, settersRef }), [modalKey])

    return <ConfirmationModalContext.Provider value={value}>{children}</ConfirmationModalContext.Provider>
}

export const useConfirmationModalContext = () => useContext(ConfirmationModalContext)
