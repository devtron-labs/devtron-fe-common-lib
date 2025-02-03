import { IS_PLATFORM_MAC_OS } from '@Common/Constants'
import { SupportedKeyboardKeysType } from '@Common/Hooks/UseRegisterShortcut/types'

export const PREVIOUS_MATCH_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Shift', 'Enter']
export const NEXT_MATCH_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Enter']
export const REPLACE_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Enter']
export const REPLACE_ALL_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = [IS_PLATFORM_MAC_OS ? 'Meta' : 'Control', 'Enter']
export const SELECT_ALL_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Alt', 'Enter']
export const CLOSE_SEARCH_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Escape']
