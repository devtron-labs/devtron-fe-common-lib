import { useMemo, useState } from 'react'
import { context } from './UseRegisterShortcutContext'
import { UseRegisterShortcutProviderType } from './types'

const UseRegisterShortcutProvider = ({ children }: UseRegisterShortcutProviderType) => {
    const [registerShortcut, setRegisterShortcut] = useState(true)

    const providerValue = useMemo(
        () => ({
            registerShortcut,
            setRegisterShortcut: (allowShortcut: boolean) => setRegisterShortcut(allowShortcut),
        }),
        [registerShortcut],
    )

    return <context.Provider value={providerValue}>{children}</context.Provider>
}

export default UseRegisterShortcutProvider
