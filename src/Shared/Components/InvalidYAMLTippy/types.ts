import { TooltipProps } from '@Common/Tooltip/types'

export interface InvalidYAMLTippyWrapperProps {
    parsingError: string
    restoreLastSavedYAML?: () => void
    children: TooltipProps['children']
}

export enum InvalidTippyTypeEnum {
    YAML = 'yaml',
    JSON = 'json',
}

export interface InvalidTippyProps extends Pick<InvalidYAMLTippyWrapperProps, 'parsingError' | 'restoreLastSavedYAML'> {
    type?: InvalidTippyTypeEnum
}
