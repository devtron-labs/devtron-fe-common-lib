import { FunctionComponent } from 'react'
import { Progressing } from '../../../Common'
import BuildInfraFormAction from './BuildInfraFormAction'
import BuildInfraFormItem from './BuildInfraFormItem'
import BuildInfraProfileDescriptionField from './BuildInfraDescriptionField'
import BuildInfraProfileNameField from './BuildInfraProfileNameField'
import { BUILD_INFRA_FORM_FIELDS, BUILD_INFRA_TEXT } from './constants'
import { BuildInfraActionType, BuildInfraConfigFormProps, InheritingHeaderProps } from './types'

const InheritingHeader = ({ defaultHeading, inhertingData }: InheritingHeaderProps) => {
    const inhertingDataString = inhertingData.reduce((acc, data) => `${acc} - ${data.value} ${data.unit ?? ''}`, '')

    return (
        <div className="flexbox dc__align-items-center dc__content-space w-100">
            {defaultHeading}

            <p className="m-0 flexbox pt-0 pb-0 pl-4 pr-4 fs-13 lh-20 fw-4 cn-9">{inhertingDataString}</p>

            <p className="m-0 cn-7 fs-13 fw-4 lh-20">{BUILD_INFRA_TEXT.INHERITING_HEADING_DESCRIPTION}</p>
        </div>
    )
}

const BuildInfraConfigForm: FunctionComponent<BuildInfraConfigFormProps> = ({
    profileInput,
    profileInputErrors,
    handleProfileInputChange,
    isDefaultProfile,
    unitsMap,
}) => {
    const currentConfigurations = profileInput?.configurations

    // will get the desired configuration from the currentConfigurations and then check if it is active or not
    const isInheritingProfileValues = (actions: BuildInfraActionType[]) =>
        actions.some((action) => !currentConfigurations[action.actionType].active)

    // Had to show loader for an instance due to batching of state updates not working as expected :/
    if (!currentConfigurations) {
        return <Progressing pageLoader />
    }

    return (
        <div className="p-16 flexbox-col dc__gap-16 br-4 dc__border-n1 dc__mxw-920">
            {!isDefaultProfile && (
                <>
                    <BuildInfraProfileNameField
                        handleProfileInputChange={handleProfileInputChange}
                        currentValue={profileInput.name}
                        error={profileInputErrors.name}
                    />

                    <BuildInfraProfileDescriptionField
                        handleProfileInputChange={handleProfileInputChange}
                        currentValue={profileInput.description}
                        error={profileInputErrors.description}
                    />
                </>
            )}

            {BUILD_INFRA_FORM_FIELDS.map((field, index) => (
                <BuildInfraFormItem
                    key={field.locator}
                    marker={field.marker}
                    heading={isInheritingProfileValues(field.actions) ? InheritingHeader : field.heading}
                    showDivider={index !== BUILD_INFRA_FORM_FIELDS.length - 1}
                    isInherting={isInheritingProfileValues(field.actions)}
                    handleProfileInputChange={handleProfileInputChange}
                    locator={field.locator}
                >
                    <div className="w-50 flexbox dc__gap-12 w-100 dc__align-start">
                        {field.actions.map((action) => (
                            <BuildInfraFormAction
                                key={action.actionType}
                                actionType={action.actionType}
                                label={action.label}
                                placeholder={action.placeholder}
                                error={profileInputErrors[action.actionType]}
                                // Assumption is for default profiles all input fields are required
                                isRequired={isDefaultProfile}
                                profileUnitsMap={unitsMap[action.actionType]}
                                handleProfileInputChange={handleProfileInputChange}
                                currentUnitName={currentConfigurations[action.actionType].unit}
                                currentValue={currentConfigurations[action.actionType].value}
                            />
                        ))}
                    </div>
                </BuildInfraFormItem>
            ))}
        </div>
    )
}

export default BuildInfraConfigForm
