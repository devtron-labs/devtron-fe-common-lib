import React, { createContext, useContext, useMemo, useState } from 'react'
import { UseUserEmailContextType } from './types'

const context = createContext<UseUserEmailContextType>(null)

export const useUserEmail = () => useContext(context)

export const UserEmailProvider: React.FC<{}> = ({ children }) => {
    const [email, setEmail] = useState<string>('')

    const providerValue = useMemo(
        () => ({
            email,
            setEmail,
        }),
        [email],
    )

    return <context.Provider value={providerValue}>{children}</context.Provider>
}

// For using the provider in class based components
export const withUserEmail = (Component: React.ComponentClass) => (props: object) => {
    const { email, setEmail } = useUserEmail()
    return <Component {...{ ...props, email, setEmail }} />
}
