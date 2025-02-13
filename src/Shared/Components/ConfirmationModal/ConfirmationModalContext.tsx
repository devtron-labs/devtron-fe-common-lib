import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { ConfirmationModalContextType } from './types'

export const ConfirmationModalContext = createContext<ConfirmationModalContextType>(null)

export const ConfirmationModalProvider = ({ children }: PropsWithChildren<{}>) => {
    const [props, setProps] = useState<ConfirmationModalContextType['props']>(null)

    const value = useMemo(() => ({ props, setProps }), [props])

    return <ConfirmationModalContext.Provider value={value}>{children}</ConfirmationModalContext.Provider>
}

export const useConfirmationModalContext = () => useContext(ConfirmationModalContext)
