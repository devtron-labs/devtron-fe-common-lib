import { ComponentSizeType } from '@Shared/constants'
import { TabGroupProps, TabProps } from './TabGroup.types'

export const getClassNameBySize = ({
    size,
    hideTopPadding,
    alignActiveBorderWithContainer,
}: Pick<TabGroupProps, 'size' | 'hideTopPadding' | 'alignActiveBorderWithContainer'>) => {
    switch (size) {
        case ComponentSizeType.medium:
            return {
                tabClassName: `fs-12 ${!hideTopPadding ? 'pt-6' : ''} ${alignActiveBorderWithContainer ? 'pb-5' : 'pb-6'}`,
                iconClassName: 'icon-dim-14',
                badgeClassName: 'fs-11 lh-18 tab-group__tab__badge--medium',
            }
        default:
            return {
                tabClassName: `fs-13 ${!hideTopPadding ? 'pt-8' : ''} ${alignActiveBorderWithContainer ? 'pb-7' : 'pb-8'}`,
                iconClassName: 'icon-dim-16',
                badgeClassName: 'fs-12 lh-20',
            }
    }
}

export const getIconColorClass = ({ iconType, active }: Pick<TabProps, 'iconType' | 'active'>) => {
    if (iconType === 'fill') {
        return `tab-group__tab__icon--fill ${active ? 'fcb-5' : 'fcn-7'}`
    }
    if (iconType === 'stroke') {
        return `tab-group__tab__icon--stroke ${active ? 'scb-5' : 'scn-7'}`
    }

    return ''
}
