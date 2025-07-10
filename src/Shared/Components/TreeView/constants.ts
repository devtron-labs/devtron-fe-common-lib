import { TreeViewProps } from './types'

export const DEFAULT_NO_ITEMS_TEXT = 'No items found'

export const VARIANT_TO_BG_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'bg__primary',
    secondary: 'bg__secondary',
}

export const VARIANT_TO_HOVER_CLASS_MAP: Record<TreeViewProps['variant'], string> = {
    primary: 'bg__hover--opaque',
    secondary: 'bg__hover-secondary--opaque',
}
