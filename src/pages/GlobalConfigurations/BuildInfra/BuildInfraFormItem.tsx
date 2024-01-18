import { FormEvent, FunctionComponent } from 'react'
import { BuildInfraFormItemProps, BuildInfraInheritActions } from './types'
import { CHECKBOX_VALUE, Checkbox } from '../../../Common'

const BuildInfraFormItem: FunctionComponent<BuildInfraFormItemProps> = ({
    heading,
    marker: Marker,
    children,
    isInherting,
    showDivider,
    handleProfileInputChange,
    locator,
}) => {
    const handleActivationChange = (e: FormEvent<HTMLInputElement>) => {
        const { checked } = e.currentTarget
        const action = (checked ? `activate_${locator}` : `de_activate_${locator}`) as BuildInfraInheritActions
        handleProfileInputChange({ action })
    }

    // If in configuration active is false, means it is inheriting values from other profile
    return (
        <>
            <div className="flexbox-col dc__gap-8 w-100">
                <div className="flexbox dc__gap-12 dc__align-start w-100">
                    {isInherting ? (
                        <Checkbox
                            onChange={handleActivationChange}
                            isChecked={isInherting}
                            value={CHECKBOX_VALUE.CHECKED}
                            dataTestId={locator}
                        />
                    ) : (
                        <Marker className="icon-dim-20 dc__no-shrink" />
                    )}

                    <div className="flexbox-col dc__gap-8 w-100">
                        {heading}
                        {!isInherting && children}
                    </div>
                </div>
            </div>

            {showDivider && <div className="w-100 dc__border-bottom-n1" />}
        </>
    )
}

export default BuildInfraFormItem
