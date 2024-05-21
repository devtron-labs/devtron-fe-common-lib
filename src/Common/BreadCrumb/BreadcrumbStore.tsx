import React, { createContext, useState } from 'react'
import { BreadcrumbTextProps } from './Types'

const initialState = {
    alias: {},
}

export const BreadcrumbText = ({ heading, isActive }: BreadcrumbTextProps) => (
    <h2 className={`m-0 fs-16 fw-6 lh-32 ${isActive ? 'cn-9' : 'cb-5'}`}>{heading}</h2>
)

const Store = ({ children }) => {
    const [state, setState] = useState(initialState)
    return <BreadcrumbContext.Provider value={{ state, setState }}>{children}</BreadcrumbContext.Provider>
}

export const BreadcrumbContext = createContext({
    state: { alias: {} },
    setState: null,
})

export function useBreadcrumbContext() {
    const context = React.useContext(BreadcrumbContext)
    if (!context) {
        throw new Error(`breadcrumb components cannot be used outside Breadcrumb context`)
    }
    return context
}

export default Store
