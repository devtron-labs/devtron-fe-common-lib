import { useContext } from 'react'
import { context } from './UseRegisterShortcutContext'

const useRegisterShorcut = () => useContext(context)

export default useRegisterShorcut
