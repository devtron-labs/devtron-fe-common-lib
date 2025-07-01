import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

import { noop } from '@Common/Helper'

import { GenericModalContextType } from './types'

const GenericModalContext = createContext<GenericModalContextType>({
    name: 'dummy-generic-modal-name',
    onClose: noop,
})

export const GenericModalProvider = ({ value, children }: PropsWithChildren<{ value: GenericModalContextType }>) => {
    const contextValue = useMemo(() => value, [value])

    return <GenericModalContext.Provider value={contextValue}>{children}</GenericModalContext.Provider>
}

export const useGenericModalContext = () => {
    const context = useContext(GenericModalContext)

    if (!context) {
        throw new Error(`Generic Modal components cannot be rendered outside the GenericModal`)
    }

    return context
}
