import { ShortcutKeyBadgeProps } from './types'

export const ShortcutKeyBadge = ({ shortcutKey }: ShortcutKeyBadgeProps) => (
    <div className="shadow__key flex fs-12 lh-20 icon-dim-20 bg__primary cn-7 fw-6 dc__border br-2">{shortcutKey}</div>
)
