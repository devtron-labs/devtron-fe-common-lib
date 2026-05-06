import { Icon } from '../Icon'
import { KEY_TO_UI_MAP } from './constants'
import { KeyboardShortcutProps } from './types'

const KeyboardShortcut = ({ keyboardKey }: KeyboardShortcutProps) => (
    <kbd className="p-4 cn-7 lh-20 flex bg__primary border__primary br-4 shadow__key fs-12 dc__no-shrink mw-20 h-20 fw-5">
        {typeof KEY_TO_UI_MAP[keyboardKey] === 'string' ? (
            KEY_TO_UI_MAP[keyboardKey]
        ) : (
            <Icon
                name={KEY_TO_UI_MAP[keyboardKey].name}
                rotateBy={KEY_TO_UI_MAP[keyboardKey].rotateBy}
                color="N800"
                size={12}
            />
        )}
    </kbd>
)

export default KeyboardShortcut
