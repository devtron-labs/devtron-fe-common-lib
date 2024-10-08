import { ShortcutType } from './types'

export const preprocessKeys = (keys: ShortcutType['keys']) =>
    keys.map((key) => key.toUpperCase()).sort() as ShortcutType['keys']
