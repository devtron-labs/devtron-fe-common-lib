import { KEYBOARD_KEYS_MAP } from '@Common/Hooks/UseRegisterShortcut/types'

import { KeyboardShortcutProps } from './types'

const KeyboardShortcut = ({ keyboardKey }: KeyboardShortcutProps) => (
    <kbd className="p-4 cn-7 lh-20 flex bg__primary border__primary br-4 shadow__key fs-12 dc__no-shrink mw-20 h-20">
        {KEYBOARD_KEYS_MAP[keyboardKey] || keyboardKey}
    </kbd>
)

export default KeyboardShortcut
