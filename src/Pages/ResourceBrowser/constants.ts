import { SelectPickerOptionType } from '@Shared/Components'

export const ALL_NAMESPACE_OPTION: Readonly<Pick<SelectPickerOptionType<string>, 'value' | 'label'>> = {
    value: 'all',
    label: 'All namespaces',
}
