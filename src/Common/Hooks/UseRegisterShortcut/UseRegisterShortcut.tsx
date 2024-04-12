import { useContext } from 'react'
import { context } from './UseRegisterShortcutContext'

const useRegisterShortcut = () => useContext(context)

export default useRegisterShortcut
