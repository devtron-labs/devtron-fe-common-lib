import { IconBaseProps } from './types'

export const IconBase = ({ name, iconMap, size = 24 }: IconBaseProps) => {
    const IconComponent = iconMap[name]

    if (!IconComponent) {
        throw new Error(`Icon with name "${name}" does not exist.`)
    }

    return <IconComponent className={`icon-dim-${size}`} />
}
