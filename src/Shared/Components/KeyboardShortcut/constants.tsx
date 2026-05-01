import { IconsProps } from '../Icon'

import { SupportedKeyboardKeysType } from '@Common/Hooks'
import { KEYBOARD_KEYS_MAP } from '@Common/Hooks/UseRegisterShortcut/types'

export const KEY_TO_UI_MAP: Record<SupportedKeyboardKeysType, string | Pick<IconsProps, 'name' | 'rotateBy'>> = {
    ...KEYBOARD_KEYS_MAP,
    ArrowUp: {
        name: 'ic-arrow-right',
        rotateBy: -90,
    },
    ArrowDown: {
        name: 'ic-arrow-right',
        rotateBy: 90,
    },
    ArrowRight: {
        name: 'ic-arrow-right',
    },
    ArrowLeft: {
        name: 'ic-arrow-right',
        rotateBy: 180,
    },
    Enter: {
        name: 'ic-key-enter',
    },
    '>': {
        name: 'ic-symbol-greater-than',
    },
}
